import { APIResponse } from '@playwright/test';

export async function postWithRetry(
  send: () => Promise<APIResponse>,
  maxAttempts = 3,
  delayMs = 2000
): Promise<APIResponse> {
  let response = await send();
  for (let attempt = 2; attempt <= maxAttempts && response.status() === 503; attempt++) {
    console.log(`503 received, retrying (attempt ${attempt}/${maxAttempts})`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    response = await send();
  }
  return response;
}

