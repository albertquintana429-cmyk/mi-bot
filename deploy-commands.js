const { REST, Routes } = require('discord.js');
const fs = require('fs');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];

const folders = fs.readdirSync('./Comandos');

for (const folder of folders) {
  const files = fs.readdirSync(`./Comandos/${folder}`).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const command = require(`./Comandos/${folder}/${file}`);

    commands.push({
      name: command.name,
      description: command.description,
      options: command.options || []
    });
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log("🔄 Registrando comandos...");

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log("✅ Comandos registrados");
  } catch (err) {
    console.error(err);
  }
})();
