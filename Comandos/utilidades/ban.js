const {
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "🚫 | Banea a un usuario del servidor.",
  type: 1, // Chat input (slash command)
  options: [
    {
      name: "usuario",
      description: "Usuario que quieres banear",
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: "motivo",
      description: "Motivo del baneo",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "evidencia",
      description: "Link o descripción de la evidencia",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],

  run: async (client, interaction) => {
    const rolPermitido = "1498070538961027173"; // <-- Reemplaza con el ID real
    const canalLogsID = "1498084254293426186"; // Canal donde se mandarán los logs

    if (!interaction.member.roles.cache.has(rolPermitido)) {
      return interaction.reply({
        content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.",
        ephemeral: true
      });
    }

    const usuario = interaction.options.getUser("usuario");
    const miembro = interaction.guild.members.cache.get(usuario.id);
    const motivo = interaction.options.getString("motivo") || "No especificado.";
    const evidencia = interaction.options.getString("evidencia") || "No proporcionada.";

    if (!miembro) {
      return interaction.reply({
        content: "❌ No se pudo encontrar al usuario en el servidor.",
        ephemeral: true
      });
    }

    if (!miembro.bannable) {
      return interaction.reply({
        content: "❌ No puedo banear a ese usuario (puede que tenga un rol más alto o permisos especiales).",
        ephemeral: true
      });
    }

    try {
      // Enviar DM al usuario baneado
      await usuario.send(`Has sido baneado del servidor **${interaction.guild.name}**.\n**Motivo:** ${motivo}`);

      // Ejecutar el baneo
      await miembro.ban({ reason: motivo });

      // Crear embed de confirmación
      const embedConfirmacion = new EmbedBuilder()
        .setTitle("✅ Usuario baneado exitosamente")
        .setColor("Green")
        .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "👤 Usuario", value: `${usuario.tag} (${usuario.id})`, inline: false },
          { name: "🛠️ Moderador", value: `${interaction.user.tag}`, inline: false },
          { name: "📄 Motivo", value: motivo, inline: false },
          { name: "📎 Evidencia", value: evidencia, inline: false }
        )
        .setFooter({ 
  text: client.user.username, 
  iconURL: client.user.displayAvatarURL({ dynamic: true }) 
})
        .setTimestamp();

      await interaction.reply({ embeds: [embedConfirmacion] });

      // Crear embed de logs
      const embedLog = new EmbedBuilder()
        .setTitle("🚫 Usuario Baneado")
        .setColor("Red")
        .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "👤 Usuario", value: `${usuario.tag} (${usuario.id})`, inline: true },
          { name: "🛠️ Moderador", value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
          { name: "📄 Motivo", value: motivo, inline: false },
          { name: "📎 Evidencia", value: evidencia, inline: false }
        )
        .setFooter({ text: "Log de moderación | Baneo ejecutado" })
        .setTimestamp();

      const canalLogs = interaction.guild.channels.cache.get(canalLogsID);
      if (canalLogs && canalLogs.isTextBased()) {
        await canalLogs.send({ embeds: [embedLog] });
      } else {
        console.warn(`Canal de logs no encontrado o no es de texto: ${canalLogsID}`);
      }

    } catch (error) {
      console.error("Error al banear:", error);
      return interaction.reply({
        content: "❌ Ocurrió un error al intentar banear al usuario.",
        ephemeral: true
      });
    }
  }
};
