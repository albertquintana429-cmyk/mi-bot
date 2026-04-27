const { EmbedBuilder, Client, GatewayIntentBits, PermissionFlagsBits } = require("discord.js");
const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const { emoji } = require("../DataBaseJson");
const config = require("../config.json");

module.exports = (client) => {
  console.log('Módulo messageCreate.js cargado.');

  if (!(client instanceof Client)) {
    console.error('El cliente no es una instancia válida');
    return;
  }

  // Mapa para controlar cooldowns por usuario y canal
  const mensajesEnviados = new Map();
  const TIEMPO_ESPERA = 0;

client.on('messageCreate', async (message) => {
  if (!message.guild) return; // Solo mensajes en servidores
  const guild = message.guild;

  if (message.author.bot) return; // Ignorar bots

  // ID canal donde reaccionar con emoji
  const targetChannelId = '1333392708554985526';

  // Reaccionar con emoji si es el canal indicado
  if (message.channel.id === targetChannelId) {
    const firstEmoji = guild.emojis.cache.find(emoji => emoji.name === 'blackverify');
    const secondEmoji = guild.emojis.cache.find(emoji => emoji.name === 'rayo'); // ← Segundo emoji

    if (firstEmoji) {
      try {
        await message.react(firstEmoji);
      } catch (error) {
        console.error('Error al reaccionar con primer emoji:', error);
      }
    } else {
      console.log('Emoji blackverify no encontrado en el servidor.');
    }

    if (secondEmoji) {
      try {
        await message.react(secondEmoji);
      } catch (error) {
        console.error('Error al reaccionar con segundo emoji:', error);
      }
    } else {
      console.log('Emoji rayo no encontrado en el servidor.');
    }
  }

    // Verificar rol requerido para comandos restrictivos
    const requiredRoleId = config.clientes;
    const member = await guild.members.fetch(message.author.id);
    const hasRole = member.roles.cache.has(requiredRoleId);

    // Detectar menciones directas al bot
    const mencoes = [`<@${client.user.id}>`, `<@!${client.user.id}>`];
    if (mencoes.includes(message.content.trim())) {
      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 16777215).toString(16))
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${message.author}, ¡Gracias por mencionar al bot! ¿En qué puedo ayudarte?`);
      message.reply({ embeds: [embed] });
      return;
    }

// Comando !customer
if (message.content.startsWith('!customer')) {
  if (
    message.author.id !== config.ownerId &&
    !message.member.roles.cache.has(config.staffsoporte)
  ) {
    return message.reply({
      content: '❌ No tienes permiso para usar este comando.'
    });
  }

  const args = message.content.split(' ');
  const targetMember = message.mentions.members.first();

  if (!targetMember) {
    return message.reply('Por favor, menciona al usuario que deseas agregar como customer.');
  }
  const newNickname = `Customer | ${targetMember.user.username}`;

  try {
    // Cambiar apodo
    try {
      await targetMember.setNickname(newNickname);
    } catch (error) {
      console.error('❌ Error capturado al cambiar apodo:', error);
    }

    // Otorgar el rol "1333390401502969931"
    const roleToAdd = message.guild.roles.cache.get('1333390401502969931');
    if (roleToAdd) {
      try {
        await targetMember.roles.add(roleToAdd);
      } catch (error) {
        console.error('❌ Error capturado al agregar rol:', error);
      }
    } else {
      return message.reply(`❌ | No se pudo encontrar el rol "1333390401502969931".`);
    }

    // Mensaje único de confirmación
    return message.reply(`✅ | Customer seteado exitosamente.`);
    
  } catch (error) {
    console.error('Error al cambiar el apodo o asignar rol:', error);
    message.reply(`❌ | No se pudo cambiar el apodo o asignar el rol. Asegúrate de que tenga los permisos necesarios.`);
  }
}


    // Comando !rename
    if (message.content.startsWith('!rename')) {
      if (!hasRole) {
        return message.reply({ content: 'No tienes permiso para usar este comando.', flags: 64 });
      }

      const args = message.content.split(' ').slice(1);
      const newName = args.join(' ');
      if (!newName) return message.reply('Por favor, proporciona un nuevo nombre para el canal.');

      try {
        await message.channel.setName(newName);
        const embed = new EmbedBuilder()
          .setColor(`${config.colorpredeterminado}`)
          .setTitle(`**✏️ __Canal Renombrado__**`)
          .setDescription(`El canal ha sido renombrado a: **\`${newName}\`**`)
          .setTimestamp();

        message.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        message.reply('No se pudo cambiar el nombre del canal. Asegúrate de que tenga los permisos necesarios.');
      }
      return;
    }

    // Comando !role add
    if (message.content.startsWith('!role add')) {
      if (!hasRole) {
        return message.reply({ content: 'No tienes permiso para usar este comando.', flags: 64 });
      }

      const args = message.content.split(' ').slice(3);
      const userId = message.content.split(' ')[2];
      const roleName = args.join(' ');

      if (!userId || !roleName) {
        return message.reply('Por favor, proporciona un ID de usuario y un nombre de rol.');
      }

      try {
        const memberToAdd = await guild.members.fetch(userId);
        if (!memberToAdd) {
          return message.reply(`${emoji.get(`errora`)} | No se pudo encontrar el usuario. Asegúrate de que el ID sea correcto.`);
        }

        const role = guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
          return message.reply(`${emoji.get(`errora`)} | Rol no encontrado. Asegúrate de que el nombre sea correcto.`);
        }

        await memberToAdd.roles.add(role);
        message.reply(`${emoji.get(`check`)} | Se ha otorgado el rol **${roleName}** a <@${userId}>.`);
      } catch (error) {
        console.error('Error al agregar el rol:', error);
        message.reply(`${emoji.get(`errora`)} | No se pudo otorgar el rol. Asegúrate de que tenga los permisos necesarios.`);
      }
      return;
    }

    // Comando !reglas
    if (message.content === '!reglas') {
      if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply({
          content: '❌ No tienes permisos para usar este comando. Solo administradores pueden ejecutarlo.',
          allowedMentions: { repliedUser: false }
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('Términos y Condiciones - Host')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(
          "**🇪🇸 Español**\n" +
          "Los Términos y Condiciones describen tus responsabilidades y derechos como parte de RPTM SHOP. Al participar, aceptas seguir estas reglas para mantener un ambiente seguro y respetuoso para todos los miembros.\n\n" +
          "**🇺🇸 English**\n" +
          "The Terms and Conditions outline your responsibilities and rights as a member of the RPTM SHOP. By participating, you agree to follow these rules to maintain a safe and respectful environment for all members."
        )
        .setColor(`${config.colorpredeterminado}`);

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setEmoji('🇪🇸')
            .setURL('https://docs.google.com/document/d/1JI2i-qk0KTI9D6HZxTDMZ3uET_lBwZx4/edit?usp=sharing&ouid=117476836733855533987&rtpof=true&sd=true'),
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setEmoji('🇺🇸')
            .setURL('https://docs.google.com/document/d/12G6MbkuUIf6ebvqpqFvRV7xZUqEfncG3/edit?usp=sharing&ouid=117476836733855533987&rtpof=true&sd=true')
        );

      await message.channel.send({
        embeds: [embed],
        components: [row]
      });
      return;
    }

    // Comando !verification
    if (message.content === '!verification') {
      if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply({
          content: '❌ No tienes permisos para usar este comando. Solo administradores pueden ejecutarlo.',
          allowedMentions: { repliedUser: false }
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('Verification - Host')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(
          "**🇪🇸 Español**\nPara obtener acceso completo a todas las áreas del servidor y desbloquear contenido exclusivo, por favor, haz clic en el botón de abajo para verificarte. Esta acción te otorgará el rol especial que te permitirá acceder a las secciones restringidas y disfrutar de todas las ventajas que ofrecemos.\n\n**🇺🇸 English**\nTo gain full access to all areas of the server and unlock exclusive content, please click the button below to verify yourself. This action will grant you the special role that will allow you to access restricted sections and enjoy all the benefits we offer."
        )
        .setColor(`${config.colorpredeterminado}`)
          .setFooter({
    text: `Host | Verification • ${new Date().toLocaleDateString('es-ES')}`,
    iconURL: message.guild.iconURL({ dynamic: true }),
  });

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel('Verify')
            .setURL('https://discord.com/oauth2/authorize?client_id=1333426334021714024&redirect_uri=https%3A%2F%2Frestorecord.com%2Fapi%2Fcallback&response_type=code&scope=identify+guilds.join&state=1333382019211853854&prompt=none')
        );

      await message.channel.send({
        embeds: [embed],
        components: [row]
      });
      return;
    }

    // Comando !payments
    if (message.content === '!payments') {
      if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply({
          content: '❌ No tienes permisos para usar este comando. Solo administradores pueden ejecutarlo.',
          allowedMentions: { repliedUser: false }
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('**__Métodos de Pago__**')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(
          "**🇪🇸 En algunos tipos de medios de pago se puede agregar una comisión por envío de dinero.\n\n🇺🇸 For some types of payment methods, a fee may be added for remittance of money.**\n\n<:mp:1364463939617951795> Mercado Pago [ARG]\n\n🏦 Transferencia Bancaria [ARG]\n\n<:belo:1404660470656405524> Belo\n\n<:prex:1404314146245185538> Prex [ARG/URU/CHL/PERÚ]\n\n<:cryptos:1403109664555794530> All Cryptos\n\n<:binance:1403109740573233174> Binance Giftcard\n\n<:pix:1404549713906237531> Pix"
        )
        .setColor(`${config.colorpredeterminado}`)
          .setFooter({
    text: `Host | Payments • ${new Date().toLocaleDateString('es-ES')}`,
    iconURL: message.guild.iconURL({ dynamic: true }),
  });

      await message.channel.send({
        embeds: [embed]
      });
      return;
    }



// -------------------- Lógica para mensajes en canales de tickets --------------------
  const nombreCanal = message.channel.name;
  const esCanalTicket = nombreCanal.startsWith("🛒・buyasd-");

  if (!esCanalTicket) return;

  const rolRestringido = "1341948975024046090";
  const miembro = message.guild.members.cache.get(message.author.id);
  if (miembro && miembro.roles.cache.has(rolRestringido)) return;

  const canalID = message.channel.id;
  const ahora = Date.now();

  const contenido = message.content
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Keys para cada mensaje
  const keySaludo = `saludo_${message.author.id}_${canalID}`;
  const keyCompra = `compra_${message.author.id}_${canalID}`;
  const keyMP = `mp_${message.author.id}_${canalID}`;

  // Saludo
  if (
    /(hola|buenas|onda|hello|buenos|olá)/i.test(contenido) &&
    !mensajesEnviados.has(keySaludo)
  ) {
    mensajesEnviados.set(keySaludo, ahora);
    return message.reply(
      `👋 ¡Hola, ${message.author}! Estoy aquí para ayudarte a completar tu compra de manera rápida y sencilla. Por favor, escribe el nombre del producto o servicio que te interesa y te brindaré asistencia inmediata. 🛍️`
    );
  }

  // Intención de compra
  if (
    /(comprar|quisiera|interesa|quiero|queria|necesito|want|buy)/i.test(contenido) &&
    !mensajesEnviados.has(keyCompra)
  ) {
    mensajesEnviados.set(keyCompra, ahora);
    return message.reply(
      `💳 ¡Perfecto! Veo que estás interesado en comprar. Por favor, escribe el método de pago que prefieres para ayudarte rápidamente.`
    );
  }

  // Mercado Pago
  if (
    /(mercado pago|mp)/i.test(contenido) &&
    !mensajesEnviados.has(keyMP)
  ) {
    mensajesEnviados.set(keyMP, ahora);

    const Discord = require("discord.js");
    const bot = message.client.user.username;
    const avatar_bot = message.client.user.displayAvatarURL({ dynamic: true });

    const embed = new Discord.EmbedBuilder()
      .setTitle("**__Mercado Pago__**")
      .setColor(`${config.colorpredeterminado}`)
      .setTimestamp(new Date())
      .setThumbnail(
        "https://media.discordapp.net/attachments/1089761197722710116/1194005532646846576/4757-mercadopago.png"
      )
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `*Mercado Pago es uno de nuestros métodos de pago. A continuación se te brindan los datos para enviar el dinero:*\n\n` +
          `**CVU:** \`0000013000032311605911\`\n` +
          `**Alias:** \`hostgg.prex\`\n\n` +
          `**Titular:** \`Patricia Mamani\`\n` +
          `**Banco:** \`Prex\`\n\n` +
          `*Una vez enviado el dinero, recordá enviar el comprobante. Esto nos ayudará a comprobar tu pago más rápidamente.*`
      );

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

    return message.channel.send({ embeds: [embed], components: [buttons] });
  }
  }
)};
