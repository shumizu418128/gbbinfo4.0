const COOLDOWN_MS = 15 * 60 * 1000;

let lastNotifiedAt = 0;

/**
 * クレジット切れを Slack Incoming Webhook へ通知する。
 * 15 分以内の再通知は送らない。
 *
 * Args:
 *   payload: 通知本文の材料。
 */
export const notifyCreditsExhausted = async (payload: {
  status?: number;
  message: string;
  query: string;
  requestId?: string;
}): Promise<void> => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[slack] SLACK_WEBHOOK_URL is not set");
    return;
  }

  const now = Date.now();
  if (now - lastNotifiedAt < COOLDOWN_MS) {
    return;
  }

  const queryPreview = payload.query.slice(0, 80);
  const text = [
    "TypeSafe credits may be exhausted.",
    `status: ${payload.status ?? "unknown"}`,
    `query: ${queryPreview}`,
    payload.requestId ? `requestId: ${payload.requestId}` : null,
    `error: ${payload.message.slice(0, 300)}`,
  ]
    .filter((line): line is string => line != null)
    .join("\n");

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    console.error(`[slack] webhook failed: ${response.status}`);
    return;
  }

  lastNotifiedAt = now;
};
