const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "mp",
  description: "🔨 | Mensaje Mercado Pago",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const requiredRoleId = "1341949022809751622";
    const member = interaction.member;
    const hasRole = member.roles.cache.has(requiredRoleId);

    if (!hasRole) {
      return interaction.reply({
        content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.",
        ephemeral: true
      });
    }

    let bot = client.user.username;
    let avatar_bot = client.user.displayAvatarURL({ dynamic: true });

    let embed = new Discord.EmbedBuilder()
      .setTitle("**__Mercado Pago__**")
      .setColor(`${config.colorpredeterminado}`)
      .setTimestamp(new Date())
      .setThumbnail("https://media.discordapp.net/attachments/1089761197722710116/1194005532646846576/4757-mercadopago.png?ex=67fc15ce&is=67fac44e&hm=b59ad534de1c5f5908ae5744f0ac1b5aeeb69670f5f403ee15fd56f3d4b84ee7&=&format=webp&quality=lossless&width=192&height=192")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(`Mercado Pago es uno de nuestros métodos de pago, a continuación se le otorgara los datos para enviar el dinero.\n\n**- CVU:** \`0000013000032311605911\`\n- **Alias:** \`hostgg.prex\`\n\n**¿Cuál es el titular del CVU?**\n**- Titular:** \`Patricia Mamani\`\n- **Banco:** \`Prex\`\n\nUna vez enviado el dinero, recordá enviar comprobante, esto nos ayudará a comprobar tu pago de manera más rápida.`);

    const buttons = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("copiar_cvu")
        .setLabel("Copiar CVU")
        .setEmoji("1364463939617951795")
        .setStyle(Discord.ButtonStyle.Primary),
      new Discord.ButtonBuilder()
        .setCustomId("copiar_alias")
        .setLabel("Copiar ALIAS")
        .setEmoji("1364463939617951795")
        .setStyle(Discord.ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [buttons] });
  }
};
