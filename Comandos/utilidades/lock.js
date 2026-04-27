const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "lock",
  description: "🔒 | Bloquea el canal para ciertos roles.",
  type: 1, // Chat input (slash command)

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.",
        ephemeral: true
      });
    }

    const canal = interaction.channel;
    const rolBloqueado = "1333382145292369942"; // ID del rol que no podrá escribir ni gestionar hilos

    try {
      // Bloquear visibilidad para @everyone
      await canal.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        ViewChannel: false
      });

      // Bloquear mensajes y gestión de hilos para el rol específico
      await canal.permissionOverwrites.edit(rolBloqueado, {
        SendMessages: false,
        CreatePublicThreads: false,
        CreatePrivateThreads: false,
        SendMessagesInThreads: false
      });

      await interaction.reply({
        content: `✅ Canal bloqueado correctamente:\n- \`@everyone\` ya no puede ver este canal.\n- <@&${rolBloqueado}> no puede enviar mensajes ni gestionar hilos.`
      });
    } catch (error) {
      console.error("Error al ejecutar /lock:", error);
      await interaction.reply({
        content: "❌ Hubo un error al bloquear el canal.",
        ephemeral: true
      });
    }
  }
};

