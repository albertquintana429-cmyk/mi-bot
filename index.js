console.log("TOKEN:", process.env.TOKEN);

const fs = require("fs");
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// colección de comandos
client.slashCommands = new Collection();

// cargar comandos
const commandFiles = fs.readdirSync("./Comandos").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./Comandos/${file}`);
  client.slashCommands.set(command.name, command);
}

// ejecutar comandos
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "❌ Error en el comando", ephemeral: true });
  }
});

// ready
client.on('ready', () => {
  console.log(`🔥 Estoy online como ${client.user.tag}`);
});

client.login(process.env.TOKEN);
