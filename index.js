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

// comandos
client.slashCommands = new Collection();

// cargar comandos de subcarpetas
const folders = fs.readdirSync("./Comandos");

for (const folder of folders) {
  const files = fs.readdirSync(`./Comandos/${folder}`).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const command = require(`./Comandos/${folder}/${file}`);
    if (command.name) client.slashCommands.set(command.name, command);
  }
}

// interacción comandos
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

// login
client.login(process.env.TOKEN);
