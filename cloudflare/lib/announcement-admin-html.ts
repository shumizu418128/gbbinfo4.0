import { ANNOUNCEMENT_MESSAGE_MAX_LENGTH } from "../../shared/announcement/constants.js";

/**
 * スマホ向けお知らせ編集 UI の HTML を返す。
 *
 * API キーは HTML に埋め込まず、URL ハッシュ `#key=...` から
 * localStorage へ保存する（公開ページに秘密を載せない）。
 *
 * Returns:
 *   admin HTML 文字列。
 */
export const buildAnnouncementAdminHtml = (): string => `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>サイトお知らせ編集</title>
  <style>
    :root {
      --bg: #121212;
      --panel: #1c1c1c;
      --text: #f5f5f5;
      --muted: #a0a0a0;
      --accent: #ff6414;
      --border: #333333;
      --danger: #ff5555;
      --ok: #3dd68c;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: "Segoe UI", "Hiragino Sans", "Noto Sans JP", sans-serif;
      line-height: 1.5;
    }
    main {
      width: min(100%, 640px);
      margin: 0 auto;
      padding: 24px 16px 48px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 700;
    }
    .lead {
      margin: 0 0 24px;
      color: var(--muted);
      font-size: 14px;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .row label { margin: 0; }
    input[type="checkbox"] {
      width: 24px;
      height: 24px;
      accent-color: var(--accent);
    }
    textarea,
    input[type="datetime-local"] {
      width: 100%;
      margin-bottom: 16px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #0d0d0d;
      color: var(--text);
      font: inherit;
    }
    textarea {
      min-height: 160px;
      resize: vertical;
    }
    .hint {
      margin: -8px 0 16px;
      color: var(--muted);
      font-size: 12px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    button {
      min-height: 48px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    button.primary {
      background: var(--accent);
      color: #111;
      flex: 1 1 160px;
    }
    button.secondary {
      background: #2a2a2a;
      color: var(--text);
      flex: 1 1 120px;
    }
    #status {
      margin-top: 16px;
      min-height: 24px;
      font-size: 14px;
    }
    #status.error { color: var(--danger); }
    #status.ok { color: var(--ok); }
    .key-state {
      margin-top: 8px;
      font-size: 12px;
      color: var(--muted);
    }
    .key-state.ready { color: var(--ok); }
  </style>
</head>
<body>
  <main>
    <h1>サイトお知らせ編集</h1>
    <p class="lead">公開サイトの [お知らせ] に表示する臨時メッセージを編集します。</p>

    <section class="panel">
      <div class="row">
        <input id="enabled" type="checkbox" />
        <label for="enabled">お知らせを表示する</label>
      </div>

      <label for="message">本文（最大 ${ANNOUNCEMENT_MESSAGE_MAX_LENGTH} 文字）</label>
      <textarea id="message" maxlength="${ANNOUNCEMENT_MESSAGE_MAX_LENGTH}" placeholder="例: 本日18時よりメンテナンスを予定しています"></textarea>

      <label for="expiresAt">表示期限（任意）</label>
      <input id="expiresAt" type="datetime-local" />
      <p class="hint">未設定なら手動でオフにするまで表示します。</p>

      <div class="actions">
        <button id="save" class="primary" type="button">保存</button>
        <button id="reload" class="secondary" type="button">再読込</button>
        <button id="clearKey" class="secondary" type="button">APIキー削除</button>
      </div>
      <p id="status" role="status"></p>
      <p id="keyState" class="key-state">APIキー未設定</p>
    </section>

    <section class="panel">
      <p class="hint" style="margin:0">
        初回のみ、このページを
        <code>.../announcement/admin#key=あなたのAPIキー</code>
        で開き、端末へ保存してください。以降は通常 URL だけで編集できます。
        キーは HTML に埋め込みません。
      </p>
    </section>
  </main>
  <script>
    const STORAGE_KEY = "gbbinfo.announcement.apiKey";
    const MAX_LENGTH = ${ANNOUNCEMENT_MESSAGE_MAX_LENGTH};

    const enabledEl = document.getElementById("enabled");
    const messageEl = document.getElementById("message");
    const expiresAtEl = document.getElementById("expiresAt");
    const statusEl = document.getElementById("status");
    const keyStateEl = document.getElementById("keyState");
    const saveEl = document.getElementById("save");
    const reloadEl = document.getElementById("reload");
    const clearKeyEl = document.getElementById("clearKey");

    const setStatus = (text, kind) => {
      statusEl.textContent = text;
      statusEl.className = kind || "";
    };

    const refreshKeyState = () => {
      const hasKey = Boolean(localStorage.getItem(STORAGE_KEY));
      keyStateEl.textContent = hasKey
        ? "APIキー: この端末に保存済み"
        : "APIキー未設定（#key=... で開いてください）";
      keyStateEl.className = "key-state" + (hasKey ? " ready" : "");
    };

    const ingestKeyFromHash = () => {
      const raw = location.hash.replace(/^#/, "");
      if (!raw) return;
      const params = new URLSearchParams(raw);
      const key = params.get("key");
      if (!key) return;
      localStorage.setItem(STORAGE_KEY, key);
      history.replaceState(null, "", location.pathname + location.search);
      setStatus("APIキーをこの端末に保存しました", "ok");
    };

    const toLocalInputValue = (iso) => {
      if (!iso) return "";
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return (
        date.getFullYear() +
        "-" + pad(date.getMonth() + 1) +
        "-" + pad(date.getDate()) +
        "T" + pad(date.getHours()) +
        ":" + pad(date.getMinutes())
      );
    };

    const fromLocalInputValue = (value) => {
      if (!value) return null;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return date.toISOString();
    };

    const applyAnnouncement = (data) => {
      enabledEl.checked = Boolean(data.enabled);
      messageEl.value = typeof data.message === "string" ? data.message : "";
      expiresAtEl.value = toLocalInputValue(data.expiresAt);
    };

    const loadAnnouncement = async () => {
      setStatus("読み込み中...", "");
      const response = await fetch("/announcement", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("読み込みに失敗しました (" + response.status + ")");
      }
      const data = await response.json();
      applyAnnouncement(data);
      setStatus("読み込み完了", "ok");
    };

    const saveAnnouncement = async () => {
      const apiKey = localStorage.getItem(STORAGE_KEY);
      if (!apiKey) {
        setStatus("APIキーが未設定です。#key=... で開いてください", "error");
        return;
      }

      const message = messageEl.value.trim();
      if (message.length > MAX_LENGTH) {
        setStatus("本文が長すぎます", "error");
        return;
      }

      const payload = {
        enabled: enabledEl.checked,
        message,
        expiresAt: fromLocalInputValue(expiresAtEl.value),
      };

      setStatus("保存中...", "");
      const response = await fetch("/announcement", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 403) {
        setStatus("認証に失敗しました。APIキーを確認してください", "error");
        return;
      }
      if (response.status === 404) {
        setStatus("サーバー側の ANNOUNCEMENT_API_KEY が未設定です", "error");
        return;
      }
      if (!response.ok) {
        let detail = "保存に失敗しました (" + response.status + ")";
        try {
          const err = await response.json();
          if (err && err.detail) detail = err.detail;
        } catch {}
        setStatus(detail, "error");
        return;
      }

      const result = await response.json();
      if (result && result.announcement) {
        applyAnnouncement(result.announcement);
      }
      setStatus("保存しました（最大約60秒でサイトに反映）", "ok");
    };

    saveEl.addEventListener("click", () => {
      saveAnnouncement().catch((error) => {
        setStatus(error instanceof Error ? error.message : "保存に失敗しました", "error");
      });
    });
    reloadEl.addEventListener("click", () => {
      loadAnnouncement().catch((error) => {
        setStatus(error instanceof Error ? error.message : "読み込みに失敗しました", "error");
      });
    });
    clearKeyEl.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      refreshKeyState();
      setStatus("この端末の APIキーを削除しました", "ok");
    });

    ingestKeyFromHash();
    refreshKeyState();
    loadAnnouncement().catch((error) => {
      setStatus(error instanceof Error ? error.message : "読み込みに失敗しました", "error");
    });
  </script>
</body>
</html>
`;
