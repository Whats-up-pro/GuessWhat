# Telegram notification Worker

The booking page is hosted on GitHub Pages, so it cannot safely hold a Telegram bot token. The Cloudflare Worker in `worker/telegram.js` sends notifications while keeping the bot token in Cloudflare's encrypted secret store.

## Deploy

1. Revoke the bot token that was previously placed in browser code or chat, then create a replacement with BotFather.
2. Install Wrangler and authenticate with the Cloudflare account that will host this Worker (`npx wrangler login`).
3. From the repository root, add the replacement credentials as Worker secrets:

   ```powershell
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   ```

   Enter each value at Wrangler's prompt. Do not put them in `wrangler.jsonc`, `script.js`, GitHub Pages, or a committed file.

4. Deploy the Worker:

   ```powershell
   npx wrangler deploy
   ```

5. Wrangler prints the public Worker URL. Set `TELEGRAM_WORKER_URL` near the top of `script.js` to that URL, without a trailing slash, then publish the GitHub Pages change.

The Worker accepts requests only from `https://whats-up-pro.github.io`, limits each IP to four requests per minute, bounds request size, and sends plain text to Telegram so user-entered addresses cannot inject Telegram formatting. If the Pages site uses a different origin, update `ALLOWED_ORIGIN` in `wrangler.jsonc` before deployment.

## Rotate the exposed token

The old token appeared in browser JavaScript and Git history. Revoking it in BotFather is required; removing it from the latest source alone does not invalidate copies. If the repository is public and you also want the old value removed from Git history, that requires rewriting and force-pushing repository history as a separate coordinated action.
