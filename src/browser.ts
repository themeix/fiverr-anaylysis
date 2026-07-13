import { BrowserRun } from "wrangler";

export async function browser(env: { MYBROWSER: BrowserRun }) {
  return env.MYBROWSER;
}