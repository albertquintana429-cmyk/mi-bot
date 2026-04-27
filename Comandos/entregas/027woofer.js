const Discord = require("discord.js")

const config = require('../../config.json')

module.exports = {
  name: "027woofer", // Coloque o nome do comando
  description: "📦​ | Entrega 027 Woofer", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
        {
            name: "key",
            description: "Ingrese la/s key(s).",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

  run: async (client, interaction) => {

                // ID del rol requerido
                const requiredRoleId = `${config.eventas}`;

                // Verificar si el usuario tiene el rol
        const member = interaction.member;
        const hasRole = member.roles.cache.has(requiredRoleId);
    
        if (!hasRole) {
          return interaction.reply({ content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.", ephemeral: true });
        }

    let bot = client.user.username;
    let avatar_bot = client.user.displayAvatarURL({ dynamic: true });
    let key = interaction.options.getString("key");

    let embed = new Discord.EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/1359569148614541532/1382624268830900285/image.png?ex=68b54cb1&is=68b3fb31&hm=5daead0062ae5378c1da0f718870125c7e97f1e5f0149ddd82995216c0160315&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** 027 Woofer\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** ||https://mtds-organization.gitbook.io/tutorial-spoofer-fivem-1-click/||\n\n` +
        `Déjanos por favor un ${config.feedback} para poder seguir creciendo! <a:blackverify:1360058374456348846><:coramanos:1387181348069838942>`
      );

    // 1. Enviar mensaje ephemeral al usuario
    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    // 2. Enviar embed públicamente al canal
    await interaction.channel.send({ embeds: [embed] });
  }
}