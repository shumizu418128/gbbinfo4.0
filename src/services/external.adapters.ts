export async function searchBeatboxerWeb(keyword: string): Promise<{ title: string; url: string }[]> {
  if (!keyword.trim()) return [];
  return [
    { title: `${keyword} interview`, url: "https://example.com/interview" },
    { title: `${keyword} performance`, url: "https://example.com/performance" },
  ];
}

export async function translateAnswer(answer: string, targetLang: string): Promise<string> {
  if (!answer.trim()) return "";
  return `[${targetLang}] ${answer}`;
}

export async function fetchNotice(): Promise<string> {
  return "Latest venue advisory will be published 24h before doors open.";
}
