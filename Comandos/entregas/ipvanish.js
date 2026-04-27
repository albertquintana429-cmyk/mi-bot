const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const config = {
  eventas: process.env.EVENTAS,
  colorpredeterminado: process.env.COLOR,
  feedback: process.env.FEEDBACK
};

module.exports = {
  name: "ipvanish",
  description: "📦​ | Entrega Ip Vanish",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "account",
      description: "Ingrese la/s account(s).",
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
    const account = interaction.options.getString("account");

    const embed = new EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://media.discordapp.net/attachments/1294464739006480385/1295097668946890813/ipvanish.png")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Ip Vanish Account\n\n` +
        `**•  Account(s):** ||${account}||\n` +
        `**•  Login:** [Haz Click Aqui](https://www.ipvanish.com/)\n\n` +
        `Déjanos por favor un ${config.feedback} para poder seguir creciendo!`
      );

    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    await interaction.channel.send({ embeds: [embed] });
  }
};
