const Discord = require("discord.js")

const config = require('../../config.json')

module.exports = {
  name: "primevideo", // Coloque o nome do comando
  description: "📦 | Entrega Prime Video", // Coloque a descrição do comando
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
      .setThumbnail("https://cdn.discordapp.com/attachments/1337713438813716480/1396913014279503882/images.png?ex=68b534df&is=68b3e35f&hm=67483f81d9cd35978e2bd0cd440ccb1532f9ed9242c4ba1eaf74aed797c42b6f&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Prime Video Account\n\n` +
        `**•  Account(s):** ||${account}||\n` +
        `**•  Webmail:** ||${webmail}||\n` +
        `**•  Login:** [Haz Click Aqui](https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fna.primevideo.com%2Fregion%2Fna%2Fauth%2Freturn%2Fref%3Dav_auth_ap%3F_t%3D1sg9VtPAk9zna9CbRWXI1Xpae0T5awOn2eGhx7HscONh60AAAAAQAAAABotHLXcmF3AAAAAPgWC9WfHH8iB-olH_E9xQ%26location%3D%2Fregion%2Fna%2Foffers%2Fnonprimehomepage%3Fref_%253Ddv_web_force_root&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=amzn_prime_video_sso_us&openid.mode=checkid_setup&countryCode=AR&siteState=132-1265624-6674405&language=en_US&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0)\n\n` +
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