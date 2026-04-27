console.log("TOKEN:", process.env.TOKEN);

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on('ready', () => {
  console.log(`🔥 Estoy online como ${client.user.tag}`);
});

client.login(process.env.TOKEN);
