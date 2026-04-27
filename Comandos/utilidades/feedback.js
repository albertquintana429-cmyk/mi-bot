const {
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "feedback",
  description: "🔨 | Mensaje Feedback",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const requiredRoleId = config.clientes;
    const member = interaction.member;

    if (
  interaction.user.id !== config.ownerId &&
  !member.roles.cache.has(requiredRoleId)
) {
      return interaction.reply({
        content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.",
        ephemeral: true
      });
    }

    const botName = client.user.username;
    const botAvatar = client.user.displayAvatarURL({ dynamic: true });
    const guildIcon = interaction.guild.iconURL({ dynamic: true });

    const feedbackChannelId = config.feedback;
    const feedbackChannelLink = `https://discord.com/channels/${interaction.guild.id}/${feedbackChannelId}`;

    const embed = new EmbedBuilder()
      .setColor(`${config.colorpredeterminado}`)
      .setTitle("**__Feedback__**")
      .setThumbnail(guildIcon)
      .setDescription(
        `**📢 ¡Gracias por tu compra!**\n` +
        `Tu compra ha sido completada correctamente.\n\n` +

        `**💬 Deja tu opinión**\n` +
        `> Si disfrutaste de tu experiencia, te invitamos a dejar una reacción positiva en <#${feedbackChannelId}>.\n` +
        `> Tu opinión nos ayuda a seguir mejorando nuestros servicios.\n\n` +

        `**🛠️ Soporte**\n` +
        `> Si necesitas ayuda o tienes alguna duda, no dudes en contactar a nuestro equipo. ¡Estamos aquí para ti!\n\n` +

        `─────────────────────────\n\n` +

        `**📢 Thank you for your purchase!**\n` +
        `Your purchase has been successfully processed.\n\n` +

        `**💬 Leave your feedback**\n` +
        `> If you enjoyed your experience, feel free to leave a positive reaction in <#${feedbackChannelId}>.\n` +
        `> Your feedback helps us grow and improve.\n\n` +

        `**🛠️ Support**\n` +
        `> If you have any questions or need assistance, don’t hesitate to reach out — we're here to help!`
      )
      .setFooter({ text: botName, iconURL: botAvatar })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("💌 Dejar Feedback")
        .setStyle(ButtonStyle.Link)
        .setURL(feedbackChannelLink)
    );

    await interaction.reply({ embeds: [embed], components: [button] });
  }
}

