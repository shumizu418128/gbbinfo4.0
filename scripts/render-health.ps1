#Requires -Version 7
<#
.SYNOPSIS
  GBBinfo (Render) の帯域幅・ログを集計して JSON を stdout に出す。

.DESCRIPTION
  - 認証: ~/.render/cli.yaml の API key（または RENDER_API_KEY）
  - CLI: render whoami / render logs
  - API: GET /v1/metrics/bandwidth, /v1/metrics/bandwidth-sources
  秘密情報は出力しない。
#>
param(
  [string]$ServiceId = 'srv-cpr2q6lumphs73bumjr0',
  [int]$ErrorLimit = 50,
  [int]$AccessSample = 100
)

$ErrorActionPreference = 'Stop'

function Get-RenderApiToken {
  if ($env:RENDER_API_KEY) { return $env:RENDER_API_KEY }
  $cfgPath = Join-Path $HOME '.render' 'cli.yaml'
  if (-not (Test-Path $cfgPath)) {
    throw "Render credentials not found. Run 'render login' or set RENDER_API_KEY. Expected: $cfgPath"
  }
  $raw = Get-Content $cfgPath -Raw
  $m = [regex]::Match($raw, '(?m)^\s*key:\s*(\S+)\s*$')
  if (-not $m.Success) { throw "No api.key in $cfgPath" }
  return $m.Groups[1].Value
}

function Parse-RenderLogJson([string]$Path) {
  if (-not (Test-Path $Path)) { return @() }
  $raw = Get-Content $Path -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return @() }
  if ($raw -match '^(Error:|Usage:)') { return @() }
  try {
    $obj = $raw | ConvertFrom-Json
    if ($obj -is [System.Array]) { return @($obj) }
    return @($obj)
  } catch {
    $fixed = '[' + ($raw -replace '}\s*\{', '},{') + ']'
    try { return @($fixed | ConvertFrom-Json) } catch { return @() }
  }
}

function Invoke-Bandwidth([hashtable]$Headers, [string]$Start, [string]$End) {
  $url = "https://api.render.com/v1/metrics/bandwidth?resource=$ServiceId&startTime=$([uri]::EscapeDataString($Start))&endTime=$([uri]::EscapeDataString($End))"
  return Invoke-RestMethod -Uri $url -Headers $Headers -Method Get
}

function Sum-Mb($Series) {
  if (-not $Series -or -not $Series.values) { return 0.0 }
  return [double](($Series.values | Measure-Object -Property value -Sum).Sum)
}

function Get-DailyMb($Series) {
  if (-not $Series -or -not $Series.values) { return @() }
  $Series.values |
    Group-Object { ([DateTime]$_.timestamp).ToString('yyyy-MM-dd') } |
    Sort-Object Name |
    ForEach-Object {
      $mb = [math]::Round(($_.Group | Measure-Object value -Sum).Sum, 2)
      [ordered]@{ day = $_.Name; MB = $mb; GB = [math]::Round($mb / 1024, 3); hours = $_.Count }
    }
}

$token = Get-RenderApiToken
$headers = @{ Authorization = "Bearer $token"; Accept = 'application/json' }
$now = [DateTimeOffset]::UtcNow
$end = $now.UtcDateTime.ToString('yyyy-MM-ddTHH:mm:ssZ')
$start24 = $now.AddHours(-24).UtcDateTime.ToString('yyyy-MM-ddTHH:mm:ssZ')
$start7 = $now.AddDays(-7).UtcDateTime.ToString('yyyy-MM-ddTHH:mm:ssZ')
$monthStart = '{0:yyyy-MM}-01T00:00:00Z' -f $now.UtcDateTime

# Auth smoke check (CLI may force text on non-TTY; prefer API)
$authEmail = $null
try {
  $owners = Invoke-RestMethod -Uri 'https://api.render.com/v1/owners' -Headers $headers -Method Get
  $first = @($owners)[0]
  $owner = if ($first.owner) { $first.owner } else { $first }
  $authEmail = $owner.email
} catch {
  $ws = render workspace current -o json 2>$null | Out-String
  try {
    $wsObj = ($ws | ConvertFrom-Json)
    $authEmail = $wsObj.email
  } catch { }
}

$bw24 = Invoke-Bandwidth $headers $start24 $end
$bw7 = Invoke-Bandwidth $headers $start7 $end
$bwMtd = Invoke-Bandwidth $headers $monthStart $end

$mb24 = Sum-Mb $bw24
$mb7 = Sum-Mb $bw7
$mbMtd = Sum-Mb $bwMtd

$srcUrl = "https://api.render.com/v1/metrics/bandwidth-sources?resource=$ServiceId&startTime=$([uri]::EscapeDataString($start7))&endTime=$([uri]::EscapeDataString($end))"
$sources = Invoke-RestMethod -Uri $srcUrl -Headers $headers -Method Get
$sourceSummary = @()
foreach ($s in @($sources)) {
  $label = ($s.labels | Where-Object { $_.field -eq 'trafficSource' }).value
  if (-not $label) { $label = 'unknown' }
  $sourceSummary += [ordered]@{
    trafficSource = $label
    MB = [math]::Round((Sum-Mb $s), 2)
    GB = [math]::Round((Sum-Mb $s) / 1024, 3)
  }
}

$tmp = Join-Path $env:TEMP ("render-health-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmp | Out-Null
try {
  render logs -r $ServiceId --level error --limit $ErrorLimit --start $start7 --end $end -o json 2>&1 |
    Out-File (Join-Path $tmp 'errors.json') -Encoding utf8
  render logs -r $ServiceId --limit $AccessSample --start $start24 --end $end -o json 2>&1 |
    Out-File (Join-Path $tmp 'access.json') -Encoding utf8
  render logs -r $ServiceId --text 'limiting requests' --limit 20 --start $monthStart --end $end -o json 2>&1 |
    Out-File (Join-Path $tmp 'ratelimit.json') -Encoding utf8
  render logs -r $ServiceId --text 'No such file' --limit 30 --start $monthStart --end $end -o json 2>&1 |
    Out-File (Join-Path $tmp 'missing.json') -Encoding utf8

  $errors = Parse-RenderLogJson (Join-Path $tmp 'errors.json')
  $access = Parse-RenderLogJson (Join-Path $tmp 'access.json')
  $rateLimit = Parse-RenderLogJson (Join-Path $tmp 'ratelimit.json')
  $missing = Parse-RenderLogJson (Join-Path $tmp 'missing.json')
} finally {
  Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}

$errorCategories = [ordered]@{
  rate_limit_participant = 0
  missing__astro_asset = 0
  directory_index_forbidden = 0
  other = 0
}
$otherSamples = @()
foreach ($e in $errors) {
  $m = [string]$e.message
  if ($m -match 'limiting requests') { $errorCategories.rate_limit_participant++ }
  elseif ($m -match 'No such file or directory') { $errorCategories.missing__astro_asset++ }
  elseif ($m -match 'directory index .* is forbidden') { $errorCategories.directory_index_forbidden++ }
  else {
    $errorCategories.other++
    if ($otherSamples.Count -lt 5) {
      $otherSamples += $m.Substring(0, [Math]::Min(200, $m.Length))
    }
  }
}

$statusCounts = @{}
$non2xx = @{}
foreach ($log in $access) {
  $msg = [string]$log.message
  if ($msg -match '"([A-Z]+) ([^"]+) HTTP/[0-9.]+" ([0-9]{3})') {
    $method = $Matches[1]
    $path = ($Matches[2] -split ' ')[0]
    $st = $Matches[3]
    if (-not $statusCounts.ContainsKey($st)) { $statusCounts[$st] = 0 }
    $statusCounts[$st]++
    if ($st[0] -eq '4' -or $st[0] -eq '5') {
      $k = "$st $method $path"
      if (-not $non2xx.ContainsKey($k)) { $non2xx[$k] = 0 }
      $non2xx[$k]++
    }
  }
}

$deploys = @()
try {
  $depResp = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$ServiceId/deploys?limit=5" -Headers $headers
  foreach ($item in @($depResp)) {
    $d = if ($item.deploy) { $item.deploy } else { $item }
    $cid = ''
    if ($d.commit -and $d.commit.id) { $cid = [string]$d.commit.id }
    $deploys += [ordered]@{
      status = $d.status
      createdAt = $d.createdAt
      finishedAt = $d.finishedAt
      trigger = $d.trigger
      commit = if ($cid.Length -ge 8) { $cid.Substring(0, 8) } else { $cid }
    }
  }
} catch {
  $deploys = @([ordered]@{ error = $_.Exception.Message })
}

$peakHours = @()
if ($bw7.values) {
  $peakHours = @(
    $bw7.values |
      Sort-Object value -Descending |
      Select-Object -First 10 |
      ForEach-Object {
        [ordered]@{ timestamp = $_.timestamp; MB = [math]::Round([double]$_.value, 2) }
      }
  )
}

$result = [ordered]@{
  generatedAt = $end
  service = [ordered]@{
    id = $ServiceId
    name = 'GBBinfo'
    url = 'https://gbbinfo-jpn.onrender.com'
    planHint = 'free (~100 GB bandwidth / month reference)'
  }
  auth = [ordered]@{
    ok = [bool]$authEmail
    email = $authEmail
  }
  bandwidth = [ordered]@{
    unit = 'mb'
    last_24h = [ordered]@{ MB = [math]::Round($mb24, 2); GB = [math]::Round($mb24 / 1024, 3) }
    last_7d = [ordered]@{ MB = [math]::Round($mb7, 2); GB = [math]::Round($mb7 / 1024, 3) }
    month_to_date = [ordered]@{
      MB = [math]::Round($mbMtd, 2)
      GB = [math]::Round($mbMtd / 1024, 3)
      freePlanUsedPercent = [math]::Round(($mbMtd / 1024) / 100 * 100, 2)
    }
    daily_mtd = @(Get-DailyMb $bwMtd)
    peak_hours_7d = $peakHours
    sources_7d = $sourceSummary
  }
  deploys = $deploys
  logs = [ordered]@{
    window = [ordered]@{ start7d = $start7; start24h = $start24; end = $end }
    errorSampleCount = $errors.Count
    errorCategories = $errorCategories
    otherErrorSamples = $otherSamples
    rateLimitEventsSample = $rateLimit.Count
    missingFileEventsSample = $missing.Count
    accessSampleCount = $access.Count
    accessStatusCounts = ($statusCounts.GetEnumerator() | Sort-Object Name | ForEach-Object {
        [ordered]@{ status = $_.Key; count = $_.Value }
      })
    topNonSuccessPaths = @(
      $non2xx.GetEnumerator() |
        Sort-Object Value -Descending |
        Select-Object -First 20 |
        ForEach-Object { [ordered]@{ count = $_.Value; entry = $_.Key } }
    )
  }
}

$result | ConvertTo-Json -Depth 8
