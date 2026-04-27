const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const config = {
  eventas: process.env.EVENTAS,
  colorpredeterminado: process.env.COLOR,
  feedback: process.env.FEEDBACK
};

module.exports = {
  name: "inimutemp",
  description: "📦​ | Entrega Inimu Temp",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Ingrese la/s key(s).",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  execute: async (interaction) => {

    const requiredRoleId = `${config.eventas}`;
    const member = interaction.member;
    const hasRole = member.roles.cache.has(requiredRoleId);

    if (!hasRole) {
      return interaction.reply({
        content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.",
        ephemeral: true
      });
    }

    const bot = interaction.client.user.username;
    const avatar_bot = interaction.client.user.displayAvatarURL();
    const key = interaction.options.getString("key");

    const embed = new EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/1357892619262361841/1360818889906454579/inimu.png")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Inimu Temp <:inimu:1411747582870556672>\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** [Haz Click Aqui](https://inimuspoofer.xyz/files/InimuTemp.exe)\n` +
        `**•  Tutorial:** ||https://inimu.gitbook.io/inimu-temporary-virtualizer/||\n\n` +
        `Déjanos por favor un ${config.feedback} para poder seguir creciendo!`
      );

    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    await interaction.channel.send({ embeds: [embed] });
  }
};
