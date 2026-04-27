const Discord = require("discord.js")

const config = require('../../config.json')

module.exports = {
  name: "saytuswoofer", // Coloque o nome do comando
  description: "📦​ | Entrega Saytus Woofer", // Coloque a descrição do comando
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
      .setThumbnail("https://cdn.discordapp.com/attachments/1399443054535901235/1403975119033860106/saytus-removebg-preview_2.png?ex=68b530b8&is=68b3df38&hm=a329c620d574eee6f807b2ef52509e3b52441c22d22b902b8f257f4efac8ed24&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Saytus Woofer <:st21:1403963874352300082>\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** [Haz Click Aqui](https://discord.com/channels/1333382019211853854/1394928009399631972)\n` +
        `**•  Tutorial:** ||https://inimu.gitbook.io/inimu-woofer||\n\n` +
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