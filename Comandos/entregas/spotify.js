const Discord = require("discord.js")

const config = require('../../config.json')

module.exports = {
  name: "spotify", // Coloque o nome do comando
  description: "📦 | Entrega Spotify", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
        {
            name: "account",
            description: "Ingrese la/s account(s).",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
                name: "webmail",
                description: "Ingrese el webmail.",
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
    let account = interaction.options.getString("account");
    let webmail = interaction.options.getString("webmail");

    let embed = new Discord.EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/1357892619262361841/1360789361989255379/SPOTIFY-PNG.png?ex=68b5a01a&is=68b44e9a&hm=f5ff5d42ee02ebc9de8e309c2c5499307d921bac9060417d041d762c51308fdc&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Spotify Account\n\n` +
        `**•  Account(s):** ||${account}||\n` +
        `**•  Webmail:** ||${webmail}||\n` +
        `**•  Login:** [Haz Click Aqui](https://accounts.spotify.com/en/login)\n\n` +
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