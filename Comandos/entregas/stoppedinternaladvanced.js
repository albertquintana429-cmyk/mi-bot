const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const config = {
  eventas: process.env.EVENTAS,
  colorpredeterminado: process.env.COLOR,
  feedback: process.env.FEEDBACK
};

module.exports = {
  name: "stopped-internal-advanced",
  description: "📦​ | Entrega Stopped Internal Advanced",
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
    const member = interaction.member;

    if (!member.roles.cache.has(config.eventas)) {
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
      .setThumbnail("https://cdn.discordapp.com/attachments/1394073244323287212/1411607574557622352/image.png")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Stopped Internal Advanced <:stopped:1376273781001158756>\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** [Haz Click Aqui](https://discord.com/channels/1333382019211853854/1394928009399631972)\n` +
        `**•  Tutorial:** ||https://www.youtube.com/watch?v=QXq2BAWUMec||\n\n` +
        `Déjanos por favor un ${config.feedback} para poder seguir creciendo!`
      );

    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    await interaction.channel.send({ embeds: [embed] });
  }
};
