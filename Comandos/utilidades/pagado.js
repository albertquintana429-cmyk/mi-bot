const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "pagado", // Coloque o nome do comando
  description: "🔨 | Mensaje Pagado", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    // ID del rol requerido
    const requiredRoleId = "1498391254868693164";

    // Verificar si el usuario tiene el rol
    const member = interaction.member;
    const hasRole = member.roles.cache.has(requiredRoleId);

    if (!hasRole) {
      return interaction.reply({ content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.", ephemeral: true });
    }

    let bot = client.user.username;
    let avatar_bot = client.user.displayAvatarURL({ dynamic: true });

    let embed = new Discord.EmbedBuilder()
      .setTitle("**__Pago Confirmado__**")
      .setColor(`${config.colorpredeterminado}`)
      .setTimestamp(new Date())
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
  `**✅ ¡Pago confirmado correctamente!**\n` +
  `Tu transacción ha sido registrada y tu pedido está en curso.\n\n` +

  `**🚚 Entrega en proceso**\n` +
  `> Un miembro de nuestro equipo <@&1341948975024046090> se encargará de entregarte tu producto en breve.\n` +
  `> **Por favor, evita mencionar al staff innecesariamente mientras se gestiona tu entrega.**\n\n` +

  `**🛠️ Soporte**\n` +
  `> Si tienes alguna duda o problema, contacta a nuestro equipo de soporte.\n` +
  `> Estamos disponibles para ayudarte en todo momento.\n\n` +

  `─────────────────────────\n\n` +

  `**✅ Payment successfully confirmed!**\n` +
  `Your transaction has been received and your order is being processed.\n\n` +

  `**🚚 Delivery in progress**\n` +
  `> A staff member <@&1341948975024046090> will handle the delivery shortly.\n` +
  `> **Please avoid tagging staff unnecessarily while your order is being fulfilled.**\n\n` +

  `**🛠️ Support**\n` +
  `> If you need any help or have questions, feel free to reach out to our support team.\n` +
  `> We’re here to assist you at any time.`
);

    interaction.reply({ embeds: [embed] });
  }
}