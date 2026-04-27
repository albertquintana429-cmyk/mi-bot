const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const config = {
  eventas: process.env.EVENTAS,
  colorpredeterminado: process.env.COLOR,
  feedback: process.env.FEEDBACK
};

module.exports = {
  name: "nordvpn",
  description: "📦​ | Entrega Nord Vpn",
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
      .setThumbnail("https://pbs.twimg.com/profile_images/1618629073969750018/_J6Qi3VW_400x400.jpg")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Nord Vpn Account\n\n` +
        `**•  Account(s):** ||${account}||\n` +
        `**•  Login:** [Haz Click Aqui](https://nordaccount.com/login/identifier)\n\n` +
        `Déjanos por favor un ${config.feedback} para poder seguir creciendo!`
      );

    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    await interaction.channel.send({ embeds: [embed] });
  }
};
