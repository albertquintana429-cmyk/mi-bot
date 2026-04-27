const Discord = require("discord.js")

const config = require('../../config.json')

module.exports = {
  name: "inimuwoofer", // Coloque o nome do comando
  description: "📦​ | Entrega Inimu Woofer", // Coloque a descrição do comando
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
      .setThumbnail("https://cdn.discordapp.com/attachments/1357892619262361841/1360818889906454579/inimu.png?ex=68b5bb9a&is=68b46a1a&hm=01e54937d448d6a55f749a289cb048e0d9e4d1cf94bdf9983fcec4e4c772d2db&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Inimu Woofer <:inimu:1411747582870556672>\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** [Haz Click Aqui](https://inimuspoofer.xyz/files/InimuPerm.exe)\n` +
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