const Discord = require("discord.js");
const config = require("../config.json"); // Ruta al archivo de configuración

module.exports = (client) => {
    console.log('Módulo logs.js cargado.');

    // Verifica que el cliente sea una instancia válida
    if (!(client instanceof Discord.Client)) {
        console.error('El cliente no es una instancia válida');
        return;
    }

    // ID del canal de logs donde se enviarán los mensajes
    const LOG_CHANNEL_ID = "1341948863757422624";

    // Conjunto para evitar el registro de mensajes duplicados
    const processedMessages = new Set();

    // Función para enviar un embed al canal de logs
    async function sendLog({ title, description, color = 0x3498db }) {
        try {
            const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
            if (logChannel && logChannel.isTextBased()) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color)
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error al enviar el log:', error);
        }
    }

    // Evento: nuevo mensaje
    client.on('messageCreate', (message) => {
        if (!message.author.bot) { // Ignorar mensajes de bots
            sendLog({
                title: "📝 Nuevo Mensaje",
                description: `**Autor:** ${message.author.tag}\n**Canal:** <#${message.channel.id}>\n**Contenido:**\n\`\`\`${message.content || '*Sin contenido visible*'}\`\`\``,
                color: 0x3498db
            });
        }
    });

    // Evento: nuevo miembro
    client.on('guildMemberAdd', (member) => {
        sendLog({
            title: "📥 Nuevo Miembro",
            description: `**Usuario:** ${member.user.tag}\n**ID:** ${member.id}`,
            color: 0x2ecc71
        });
    });

    // Evento: miembro salió
    client.on('guildMemberRemove', (member) => {
        sendLog({
            title: "📤 Miembro Salió",
            description: `**Usuario:** ${member.user.tag}\n**ID:** ${member.id}`,
            color: 0xe74c3c
        });
    });

    // Evento: mensaje eliminado
    client.on('messageDelete', (message) => {
        if (!message.partial && message.guild && message.author) {
            sendLog({
                title: "🗑️ Mensaje Eliminado",
                description: `**Autor:** ${message.author.tag}\n**Canal:** <#${message.channel.id}>\n**Contenido:**\n\`\`\`${message.content || '*Sin contenido visible*'}\`\`\``,
                color: 0xf1c40f
            });
        }
    });

    // Evento: mensaje editado
    client.on('messageUpdate', (oldMessage, newMessage) => {
        if (!oldMessage.partial && !newMessage.partial && oldMessage.content !== newMessage.content) {
            // Verifica si ya se procesó este mensaje
            if (processedMessages.has(newMessage.id)) return; // Si ya se procesó, no lo enviamos nuevamente

            processedMessages.add(newMessage.id); // Marcamos el mensaje como procesado

            sendLog({
                title: "✏️ Mensaje Editado",
                description: `**Autor:** ${oldMessage.author.tag}\n**Canal:** <#${oldMessage.channel.id}>\n\n**Antes:**\n\`\`\`${oldMessage.content || '*Sin contenido*'}\`\`\`\n\n**Después:**\n\`\`\`${newMessage.content || '*Sin contenido*'}\`\`\``,
                color: 0xffa500
            });
        }
    });

    // Evento: canal creado
    client.on('channelCreate', (channel) => {
        sendLog({
            title: "📁 Canal Creado",
            description: `**Nombre:** ${channel.name}\n**Tipo:** ${channel.type}`,
            color: 0x1abc9c
        });
    });

    // Evento: canal eliminado
    client.on('channelDelete', (channel) => {
        sendLog({
            title: "🗂️ Canal Eliminado",
            description: `**Nombre:** ${channel.name}\n**Tipo:** ${channel.type}`,
            color: 0x95a5a6
        });
    });

    // Evento: usuario baneado
    client.on('guildBanAdd', (ban) => {
        sendLog({
            title: "🔨 Usuario Baneado",
            description: `**Usuario:** ${ban.user.tag}\n**ID:** ${ban.user.id}`,
            color: 0xc0392b
        });
    });

    // Evento: usuario desbaneado
    client.on('guildBanRemove', (ban) => {
        sendLog({
            title: "🚫 Usuario Desbaneado",
            description: `**Usuario:** ${ban.user.tag}\n**ID:** ${ban.user.id}`,
            color: 0x27ae60
        });
    });

    // Evento: rol creado
    client.on('roleCreate', (role) => {
        sendLog({
            title: "➕ Rol Creado",
            description: `**Nombre del rol:** ${role.name}\n**ID:** ${role.id}`,
            color: 0x9b59b6
        });
    });

    // Evento: rol eliminado
    client.on('roleDelete', (role) => {
        sendLog({
            title: "❌ Rol Eliminado",
            description: `**Nombre del rol:** ${role.name}\n**ID:** ${role.id}`,
            color: 0x7f8c8d
        });
    });

    // Evento: bot listo
    client.once('ready', () => {
        console.log(`✅ Bot listo como ${client.user.tag}`);
        sendLog({
            title: "✅ Bot Listo",
            description: `El bot se ha iniciado correctamente como **${client.user.tag}**.`,
            color: 0x00bfff
        });
    });
};
