const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = (client) => {
    if (!(client instanceof Client)) {
        console.error('El cliente no es una instancia válida');
        return;
    }

    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        try {
            // Verifica si hay cambio en el estado de boost
            const wasBooster = !!oldMember?.premiumSince;
            const isBooster = !!newMember?.premiumSince;

            // Debug para saber si el evento se ejecuta
            console.log('Detectando cambio de boost:', { wasBooster, isBooster, user: newMember.user.tag });

            // Si el usuario acaba de boostear
            if (!wasBooster && isBooster) {
                const guild = newMember.guild;
                const boostChannel = await guild.channels.fetch('1333388729657856030').catch(() => null);

                if (!boostChannel) {
                    console.warn('Canal de boost no encontrado.');
                    return;
                }

                if (!boostChannel.permissionsFor(guild.members.me).has('SendMessages')) {
                    console.warn('El bot no tiene permisos para enviar mensajes en el canal de boosts.');
                    return;
                }

                // Embed de agradecimiento
                const embedBoost = new EmbedBuilder()
                    .setTitle('🚀 ¡Gracias por apoyar el servidor!')
                    .setDescription(`¡Gracias <@${newMember.user.id}>! Tu apoyo nos ayuda a seguir creciendo y mejorando esta comunidad.\n\n**Beneficios exclusivos para boosters:**\n- <a:boost:1384359597837385799> Rango especial en el servidor.\n- 🚀 Acceso a +30 canales privados.\n- 📁 Carpeta exclusiva.\n\nHaz click en el botón de abajo para abrir un ticket de soporte y reclamar tus recompensas.`)
                    .setColor('#000001')
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                // Botón con enlace
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Reclamar Recompensas')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/channels/1333382019211853854/1333390212121886741')
                );

                // Enviar mensaje
                await boostChannel.send({ embeds: [embedBoost], components: [row] });
                console.log(`Mensaje de boost enviado correctamente a ${newMember.user.tag}`);
            }
        } catch (err) {
            console.error('Error al procesar guildMemberUpdate:', err);
        }
    });
};

