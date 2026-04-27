const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "sugerencia",
  description: "💡 | Envía una sugerencia al servidor",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "contenido",
      description: "Contenido de la sugerencia",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const suggestion = interaction.options.getString("contenido");
    const user = interaction.user;
    const guild = interaction.guild;

    const suggestionChannelId = "1368052617032368138"; // Reemplaza con tu ID real
    const channel = client.channels.cache.get(suggestionChannelId);

    if (!channel || channel.type !== Discord.ChannelType.GuildText) {
      return interaction.reply({
        content: "❌ | No se pudo encontrar el canal de sugerencias o no es un canal de texto.",
        ephemeral: true,
      });
    }

    const embed = new Discord.EmbedBuilder()
      .setColor(`${config.colorpredeterminado}`)
      .setTitle("📢 **¡__Nueva sugerencia__!**")
      .setDescription(`\`\`\`${suggestion}\`\`\``)
      .setThumbnail(user.displayAvatarURL({ dynamic: true })) // Avatar del usuario como thumbnail
      .setFooter({
        text: "Host | Sistema de Sugerencias",
        iconURL: guild.iconURL({ dynamic: true }) || user.displayAvatarURL({ dynamic: true }) // Icono del servidor o fallback
      })
      .setTimestamp();

    try {
      const msg = await channel.send({ embeds: [embed] });

      // Reacciones
      await msg.react("✅");
      await msg.react("❌");

      // Crear hilo debajo del mensaje
      const thread = await msg.startThread({
        name: `Debate: ${user.username}`,
        autoArchiveDuration: 1440, // 24 horas
        reason: "Hilo creado para debatir la sugerencia.",
      });

      await thread.send(`💬 ¡Discute aquí la sugerencia enviada por **${user.username}**!`);

      await interaction.reply({
        content: "<:checkwhite:1374234754366570576> | ¡Tu sugerencia ha sido enviada!",
        ephemeral: true,
      });
    } catch (err) {
      console.error("Error al enviar sugerencia:", err);
      return interaction.reply({
        content: "<:crosshost2:1384349772386664550> | Hubo un error al enviar la sugerencia.",
        ephemeral: true,
      });
    }
  }
};
