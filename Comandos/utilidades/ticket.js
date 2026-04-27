const Discord = require("discord.js")
const config = require('../../config.json')

module.exports = {
  name: "ticket",
  description: "🔨 | Abre el panel de tickets.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ 
        content: `❌ | No tienes permiso para usar este comando.`, 
        ephemeral: true 
      })
    }

    let embed = new Discord.EmbedBuilder()
.setColor(`${config.colorpredeterminado}`)
.setTitle(`Tickets System`)
.setDescription(
  `🇪🇸 · **Hola!** para abrir un ticket, debes presionar uno de los siguientes botones.\n\n` +
  `🇺🇸 · **Hello!** To open a ticket, you must press one of the following buttons.\n\n` +
  `🇧🇷 · **Olá!** Para abrir um ticket, você deve pressionar um dos botões abaixo.`
)
.setAuthor({
  name: client.user.username,
  iconURL: client.user.displayAvatarURL()
})
.setFooter({
  text: '©️ Host - Todos los derechos reservados.'
});


    // Botones grises
    let painel = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("opc1")
        .setLabel("Compra")
        .setEmoji("1415071860131102841")
        .setStyle(Discord.ButtonStyle.Secondary),

      new Discord.ButtonBuilder()
        .setCustomId("opc2")
        .setLabel("Soporte")
        .setEmoji("1415072399942090883")
        .setStyle(Discord.ButtonStyle.Secondary),

      new Discord.ButtonBuilder()
        .setCustomId("opc3")
        .setLabel("Partner")
        .setEmoji("1415072383517196318")
        .setStyle(Discord.ButtonStyle.Secondary)
    );

    await interaction.reply({ content: `✅ ¡Mensaje enviado!`, ephemeral: true })
    await interaction.channel.send({ embeds: [embed], components: [painel] })
  }
}