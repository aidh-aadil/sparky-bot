# Sparky

- A discord bot programmed in Javascript using the [discord.js](https://discord.js.org/) library
- If you want to help build this bot and collaborate. Join [Sparky Support Server](https://discord.gg/SAqb5Dcfek)

## What can the bot do?

### Info commands

- `ping` : View bot latency
- `bot-info` : View some information about the bot
- `user-info` : Fetch some information about user
- `server-info` : View some information about that server
- `avatar` : Fetch user avatar
- `banner` : Fetch user banner if they have one

### Moderation commands

- `kick` : Kick user from that server
- `warn` : Warn user

### Economy system

- `daily` : Collect daily reward
- `work` : Get some bot-cash

## How you can use my code:

1. Clone my repository

```bash
git clone https://github.com/aidhaadil/sparky-bot
```

2. Install the dependencies (discord.js, dotenv, nodemon, mongoose...)

```bash
npm install discord.js dotenv nodemon mongoose
```

3. Create a .env file. Then, add your bot token and your mongodb connection string

- You will also have to set up a database. I used [MongoDB](https://www.mongodb.com/)

```py
BOT_TOKEN = "your-bot-token"
MONGODB_URI = "your-connection-string"

# Remember to replace the `<password>` to your cluster user password
```

4. Register the commands (globally)

- If you want your bot to only to work in a specific guild, you can see [Guild command registration](https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands)

```bash
node src/deployCommands.js
```

- Also remember to update `config.json` accordingly.

5. Run the bot

```bash
npm start
```

- There you go! If there is any bug or any suggestion, please open an issue or contact me in the support server. You can also open a PR if you have any new features to add to this bot.
