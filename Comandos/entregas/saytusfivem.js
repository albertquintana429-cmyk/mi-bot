const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const config = {
  eventas: process.env.EVENTAS,
  colorpredeterminado: process.env.COLOR,
  feedback: process.env.FEEDBACK
};

module.exports = {
  name: "saytusfivem",
  description: "📦​ | Entrega Saytus Fivem Unban",
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
      .setThumbnail("https://cdn.discordapp.com/attachments/1399443054535901235/1403975119033860106/saytus-removebg-preview_2.png")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Saytus Fivem Unban <:st21:1403963874352300082>\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** [Haz Click Aqui](https://discord.com/channels/1333382019211853854/1394928009399631972)\n` +
        `**•  Tutorial:** ||https://youtu.be/mDSyIsJiC7g?si=IBFHp8jo84BLgEEe||\n\n` +
        `Déjanos por favor un ${config.feedback} para poder seguir creciendo!`
      );

    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    await interaction.channel.send({ embeds: [embed] });
  }
};
