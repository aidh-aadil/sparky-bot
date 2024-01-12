# What is Sparky?

Sparky is a versatile Discord bot developed in JavaScript using the [discord.js](https://discord.js.org/) library. If you're interested in contributing or collaborating, feel free to join the [Sparky Support Server](https://discord.gg/TNE72AtH7y).

## What can the bot do?

### Integrated AI

Sparky uses [Gemini](https://deepmind.google/technologies/gemini/#introduction) (Google's 'most capable' AI model) as a chatbot.<br>
To chat, start by pinging the bot and follow it up with your prompt:

```
@Sparky Bot {your-prompt}
```

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
- `lock` : Lock a channel in the current server.
- `unlock` : Unlock a locked channel.

### Fun commands

_Note: Some of these image manipulation commands might not work due to API errors._

- `drake-meme` : Generates a drake meme based on your input
- `oogway-quote` : Generate a quote by master oogway based on your input
- `pooh-meme` : Generate a pooh and pooh in tuxedo meme based on your input
- `dictionary` : Search for a word in the dictionary
- `rps` : Play a game of rock paper scissors against your friend
- `8ball` : Ask magic 8ball a yes/no answer and get a randomly generated answer
- `pet` : Generates a pet gif based on the user's avatar

### Economy system

- `daily` : Collect daily reward
- `work` : Get some bot-cash
- `balance`: View user balance

## How you can use my code:

1. **Clone my repository**

```bash
git clone https://github.com/aidhaadil/sparky-bot
```

2. **Install the dependencies**

```bash
npm install discord.js dotenv nodemon mongoose
```

3. **Setting up environment variables**

Create a `.env` file. Then, add your bot token and your mongodb connection string.
You will also have to set up a database. I used [MongoDB](https://www.mongodb.com/).

```py
BOT_TOKEN = "your-bot-token"
MONGODB_URI = "your-connection-string"

# Remember to replace the `<password>` to your cluster user password
```

4. **Command registration**

If you want your bot to only to work in a specific guild, you can see [Guild command registration](https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands)

```bash
node src/deployCommands.js
```

Remember to update `config.json` accordingly.

5. **Run the bot**

```bash
npm start
```

## Contributing

There you go! If there is any bug or any suggestion, please open an issue or contact me in the support server. You can also open a PR if you have any new features to add to this bot.
