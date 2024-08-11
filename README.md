# daily_praise_discord_bot

This project is a service to track and report LeetCode and AtCoder submissions for specified users. It fetches recent submissions, filters by successful attempts, and sends a summary to a Discord webhook.

## Features

-  Fetch recent LeetCode & AtCoder submissions for specified users.
-  Filter submissions made within the last 24 hours.
-  Send a summary of successful submissions to a Discord webhook.

## Usage in Your Local Environment

-  install [Deno](https://docs.deno.com/runtime/manual) on your local machine.

- Create a `.env` file in the root directory and configure the following variables:

```plaintext
ATCODER_USERNAMES=user1,user2,user3
LEETCODE_USERNAMES=userA,userB,userC
WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-id
```

## Usage

```sh
deno task cron
```