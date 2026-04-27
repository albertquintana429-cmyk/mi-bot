const {
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType
} = require("discord.js");

const ms = require("ms"); // Asegúrate de tener esta librería instalada

module.exports = {
  name: "aislar",
  description: "🚫 | Aísla temporalmente a un usuario.",
  type: 1,
  options: [
    {
      name: "usuario",
      description: "Usuario que quieres aislar",
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: "duracion",
      description: "Duración del aislamiento (ej: 10m, 1h, 1d)",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: "motivo",
      description: "Motivo del aislamiento",
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
    const rolPermitido = "1498070538961027173"; // Reemplaza con el rol de staff/moderador autorizado
    const canalLogsID = "1498084254293426186"; // Canal de logs

    if (!interaction.member.roles.cache.has(rolPermitido)) {
      return interaction.reply({
        content: "❌ No tienes permiso para usar este comando.",
        ephemeral: true
      });
    }

    const usuario = interaction.options.getUser("usuario");
    const miembro = interaction.guild.members.cache.get(usuario.id);
    const duracionTexto = interaction.options.getString("duracion");
    const duracionMs = ms(duracionTexto);
    const motivo = interaction.options.getString("motivo") || "No especificado.";
    const evidencia = interaction.options.getString("evidencia") || "No proporcionada.";

    if (!miembro) {
      return interaction.reply({
        content: "❌ No se pudo encontrar al usuario en el servidor.",
        ephemeral: true
      });
    }

    if (!duracionMs || duracionMs < 1000 || duracionMs > ms("28d")) {
      return interaction.reply({
        content: "⏱️ Ingresa una duración válida entre 1s y 28d. Ej: `10m`, `2h`, `1d`.",
        ephemeral: true
      });
    }

    if (miembro.isCommunicationDisabled()) {
      return interaction.reply({
        content: "⚠️ Ese usuario ya está aislado.",
        ephemeral: true
      });
    }

    try {
      // Enviar DM al usuario
      try {
        await usuario.send(`🚫 Has sido aislado en **${interaction.guild.name}** por **${ms(duracionMs, { long: true })}**.\n**Motivo:** ${motivo}`);
      } catch (err) {
        console.warn(`No se pudo enviar DM al usuario: ${usuario.tag}`);
      }

      // Aplicar timeout
      await miembro.timeout(duracionMs, motivo);

      // Embed de confirmación
      const embedConfirmacion = new EmbedBuilder()
        .setTitle("⏳ Usuario aislado temporalmente")
        .setColor("Orange")
        .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "👤 Usuario", value: `${usuario.tag} (${usuario.id})`, inline: false },
          { name: "🕒 Duración", value: ms(duracionMs, { long: true }), inline: false },
          { name: "🛠️ Moderador", value: `${interaction.user.tag}`, inline: false },
          { name: "📄 Motivo", value: motivo, inline: false },
          { name: "📎 Evidencia", value: evidencia, inline: false }
        )
        .setFooter({ 
  text: client.user.username, 
  iconURL: client.user.displayAvatarURL({ dynamic: true }) 
})
        .setTimestamp();

        // Si la evidencia es una URL válida de imagen, se agrega al embed
if (evidencia.startsWith("http") && /\.(png|jpe?g|gif|webp)$/.test(evidencia)) {
  embedConfirmacion.setImage(evidencia);
}

      await interaction.reply({ embeds: [embedConfirmacion] });

      // Log embed
      const embedLog = new EmbedBuilder()
        .setTitle("🚫 Usuario Aislado (Timeout)")
        .setColor("Red")
        .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "👤 Usuario", value: `${usuario.tag} (${usuario.id})`, inline: true },
          { name: "🕒 Duración", value: ms(duracionMs, { long: true }), inline: true },
          { name: "🛠️ Moderador", value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
          { name: "📄 Motivo", value: motivo, inline: false },
          { name: "📎 Evidencia", value: evidencia, inline: false }
        )
        .setFooter({ text: "Log de moderación | Aislamiento temporal" })
        .setTimestamp();

        
if (evidencia.startsWith("http") && /\.(png|jpe?g|gif|webp)$/.test(evidencia)) {
  embedLog.setImage(evidencia);
}

      const canalLogs = interaction.guild.channels.cache.get(canalLogsID);
      if (canalLogs && canalLogs.isTextBased()) {
        await canalLogs.send({ embeds: [embedLog] });
      }

      // Notificar desaislamiento cuando termine el timeout
      setTimeout(async () => {
        const miembroActualizado = await interaction.guild.members.fetch(usuario.id).catch(() => null);
        if (miembroActualizado && !miembroActualizado.isCommunicationDisabled()) {
          try {
            await usuario.send(`🔊 Has sido desaislado en **${interaction.guild.name}**.\nTu aislamiento ha finalizado automáticamente.`);
          } catch (err) {
            console.warn(`No se pudo enviar DM al usuario desaislado: ${usuario.tag}`);
          }

          const embedFin = new EmbedBuilder()
            .setTitle("🔊 Usuario Desaislado")
            .setColor("Green")
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: "👤 Usuario", value: `${usuario.tag} (${usuario.id})`, inline: true },
              { name: "⏱️ Motivo", value: "Finalizó el tiempo de aislamiento.", inline: true }
            )
            .setFooter({ text: "Log de moderación | Timeout finalizado" })
            .setTimestamp();

          if (canalLogs && canalLogs.isTextBased()) {
            await canalLogs.send({ embeds: [embedFin] });
          }
        }
      }, duracionMs);

    } catch (error) {
      console.error("Error al aislar:", error);
      return interaction.reply({
        content: "❌ Ocurrió un error al intentar aislar al usuario.",
        ephemeral: true
      });
    }
  }
};