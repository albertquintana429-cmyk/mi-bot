const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ping",
  description: "📡 | Muestra la latencia del bot",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const latency = Date.now() - interaction.createdTimestamp;
    const apiPing = client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setColor("#5865F2")
      .addFields(
        { name: "📶 Latencia del Bot", value: `\`${latency}ms\``, inline: true },
        { name: "💻 Ping de la API", value: `\`${apiPing}ms\``, inline: true }
      )
      .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
