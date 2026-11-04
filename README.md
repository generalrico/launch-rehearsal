# Launch Rehearsal

Practice reviewing a token sale before simulating it. This project uses mock credits and runs the simulation in the browser. Switch connects a Codex reviewer to a Telegram group so a human can approve the setup or ask for changes.

## Run the simulator

Open index.html in a browser. There is no build step. Click Load example, then Next and Review setup. Copy for Telegram copies the setup or shows text you can copy manually.

## Connect the reviewer

1. Start Docker Desktop and Switch Console. Run a local Switch server and check that Codex shows Signed in under Settings → Agent providers.
2. In Your Agents, add an agent named launch-reviewer. Select Codex and This computer. Choose an empty working directory and paste the instructions from reviewer-instructions.txt into Agent instructions.
3. Create a Telegram bot with @BotFather using /newbot. Turn off Group Privacy before adding it to a private test group. In Switch server Home → Messaging apps → Connect → Telegram, enter your bot username and token. Keep your token private.
4. Add the bot to the group and post a message. On the Switch server Home page, link your personal Telegram username. In the Telegram group, send `/invite_agent @launch-reviewer`. Keep Switch Console running.

[Switch quickstart](https://docs.switchagents.ai/switch-rooms/getting-started) · [Telegram setup](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/telegram)

## Reproduce the demo

Paste the copied setup into Telegram with `@launch-reviewer please review this setup`. The sample offers 3,000 tokens at 0.25 mock credits each and has demand for 4,200. Expect a review of 3,000 tokens sold for 750 mock credits. Reply with your decision, return to the browser, and click Simulate launch. Expect the same result and zero offered tokens left unsold.

Copying to Telegram, approving in chat, and running the simulator are manual steps. The site does not receive Telegram approval or execute blockchain transactions.
