const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const fetch = require('node-fetch'); // En Node 18+ puedes usar el fetch global

// ----------------- Utilidades -----------------
const TZ = 'America/Argentina/Buenos_Aires';
const LOCALE = 'es-AR';
const fmt = (n, max = 2) => Number(n).toLocaleString(LOCALE, { maximumFractionDigits: max });
const fmtPct = (n) => `${(n >= 0 ? '+' : '')}${(n * 100).toFixed(2)}%`;
const hoy = () => new Date().toLocaleString(LOCALE, { timeZone: TZ });
const toISODate = (d) => d.toISOString().slice(0,10);

// ----------------- APIs -----------------
// Argentina: dolarapi.com (oficial/blue/mep/ccl)
async function obtenerCotizacionArgentina() {
  try {
    const res = await fetch('https://dolarapi.com/v1/dolares', { timeout: 10000 });
    const data = await res.json();

    const pick = (casaId) => data.find(d => d.casa === casaId);
    const oficial = pick('oficial');
    const blue   = pick('blue');
    const mep    = pick('bolsa');
    const ccl    = pick('contadoconliqui');
    if (!oficial || !blue || !mep || !ccl) throw new Error('Faltan cotizaciones');

    return {
      ok: true,
      fuente: 'dolarapi.com',
      actualizacion: hoy(),
      valores: {
        oficial: { compra: oficial.compra, venta: oficial.venta },
        blue:   { compra: blue.compra,   venta: blue.venta   },
        mep:    { compra: mep.compra,    venta: mep.venta    },
        ccl:    { compra: ccl.compra,    venta: ccl.venta    },
      }
    };
  } catch (e) {
    console.error('[AR API]', e);
    return { ok: false, error: 'No se pudo obtener la cotización argentina.' };
  }
}

// Chile/Uruguay: open.er-api.com (oficial)
async function obtenerCotizacionGeneral(pais) {
  try {
    const codigo = pais === 'uruguay' ? 'UYU' :
                   pais === 'chile'   ? 'CLP' : null;
    if (!codigo) throw new Error('País no soportado');

    const url = `https://open.er-api.com/v6/latest/USD`;
    const res = await fetch(url, { timeout: 10000 });
    const data = await res.json();

    if (!data?.rates?.[codigo]) throw new Error('Sin tasa');

    return {
      ok: true,
      codigo,
      cotizacion: data.rates[codigo], // 1 USD = X moneda local
      fuente: 'open.er-api.com',
      actualizacion: hoy()
    };
  } catch (e) {
    console.error('[GENERAL API]', e);
    return { ok: false, error: 'No se pudo obtener la cotización.' };
  }
}

// Histórico (oficial diario) con Frankfurter API
async function obtenerHistoricoOficial(codigo) {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const url = `https://api.frankfurter.app/${toISODate(start)}..${toISODate(end)}?from=USD&to=${codigo}`;
    const res = await fetch(url, { timeout: 10000 });
    const data = await res.json();

    if (!data?.rates) throw new Error('Sin datos históricos');

    const fechas = Object.keys(data.rates).sort(); // asc
    const lastDate = fechas[fechas.length - 1];
    const last = data.rates[lastDate][codigo];

    const getDaysAgo = (d) => {
      const target = new Date(end);
      target.setDate(end.getDate() - d);
      let key = toISODate(target);
      for (let i = 0; i < 7; i++) {
        if (data.rates[key]?.[codigo]) return data.rates[key][codigo];
        target.setDate(target.getDate() - 1);
        key = toISODate(target);
      }
      return null;
    };

    const d1  = getDaysAgo(1);
    const d7  = getDaysAgo(7);
    const d30 = getDaysAgo(30);

    return {
      ok: true,
      codigo,
      actual: last,
      d1, d7, d30,
      fuente: 'frankfurter.app',
      actualizado: hoy()
    };
  } catch (e) {
    console.error('[HIST API]', e);
    return { ok: false };
  }
}

// ----------------- Componentes UI -----------------
function crearMenu(disabled = false) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('seleccionar_pais')
      .setPlaceholder('Selecciona un país')
      .setDisabled(disabled)
      .addOptions([
        { label: 'Argentina', value: 'argentina', emoji: '🇦🇷' },
        { label: 'Chile', value: 'chile', emoji: '🇨🇱' },
        { label: 'Uruguay', value: 'uruguay', emoji: '🇺🇾' }
      ])
  );
}

function crearBotones(disabled = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('btn_calc')
      .setLabel('Calculadora')
      .setEmoji('🧮')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId('btn_compare')
      .setLabel('Comparar')
      .setEmoji('📊')
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
  );
}

// ----------------- Embeds -----------------
function embedArgentina(ar) {
  const e = new EmbedBuilder()
    .setColor('#74ACDF')
    .setTitle('🇦🇷 COTIZACIÓN DÓLAR ARGENTINA')
    .setThumbnail('https://cdn.discordapp.com/attachments/1406489175414542387/1406489190685868113/image.png')
    .setTimestamp();

  if (ar.ok) {
    e.addFields(
      { name: '💰 Oficial (venta)', value: `\`\`\`ini\n1 USD = ${fmt(ar.valores.oficial.venta)} ARS\`\`\``, inline: true },
      { name: '💵 Blue (venta)',   value: `\`\`\`ini\n1 USD = ${fmt(ar.valores.blue.venta)} ARS\`\`\``,   inline: true },
      { name: '📈 MEP  (venta)',   value: `\`\`\`ini\n1 USD = ${fmt(ar.valores.mep.venta)} ARS\`\`\``,    inline: true },
      { name: '🌍 CCL  (venta)',   value: `\`\`\`ini\n1 USD = ${fmt(ar.valores.ccl.venta)} ARS\`\`\``,    inline: true },
      { name: '🏦 Fuente', value: `\`\`\`${ar.fuente}\`\`\``, inline: true },
      { name: '📅 Última actualización', value: `\`\`\`${ar.actualizacion}\`\`\``, inline: false }
    );
  } else {
    e.setDescription('⚠️ No se pudo obtener la cotización argentina ahora mismo.');
  }
  return e;
}

function embedGeneralPais(pais, g) {
  const colores = { chile: '#D72631', uruguay: '#222F8C' };
  const presidentes = {
    chile: 'https://cdn.discordapp.com/attachments/1406489175414542387/1406489259992678670/Retrato_Oficial_Presidente_Boric_Font.png',
    uruguay: 'https://cdn.discordapp.com/attachments/1406489175414542387/1406489400015192064/Yamandu-Orsi-Presidente-de-Uruguay.png'
  };
  const cod = pais === 'chile' ? 'CLP' : 'UYU';

  const e = new EmbedBuilder()
    .setColor(colores[pais])
    .setTitle(`COTIZACIÓN DÓLAR ${pais.toUpperCase()}`)
    .setThumbnail(presidentes[pais])
    .setTimestamp();

  if (g.ok) {
    e.addFields(
      { name: '💰 Tipo de Cambio (oficial)', value: `\`\`\`ini\n1 USD = ${fmt(g.cotizacion)} ${cod}\`\`\``, inline: true },
      { name: '🏦 Fuente', value: `\`\`\`${g.fuente}\`\`\``, inline: true },
      { name: '📅 Última actualización', value: `\`\`\`${g.actualizacion}\`\`\``, inline: false }
    );
  } else {
    e.setDescription('⚠️ No se pudo obtener la cotización en este momento.');
  }
  return e;
}

function embedComparacion(ar, cl, uy, solicitanteTag) {
  const arRate = ar.ok ? ar.valores.blue.venta : null; // AR usa blue
  const clRate = cl.ok ? cl.cotizacion : null;
  const uyRate = uy.ok ? uy.cotizacion : null;

  const items = [
    { nombre: 'Argentina', flag: '🇦🇷', codigo: 'ARS', tasa: arRate },
    { nombre: 'Chile',     flag: '🇨🇱', codigo: 'CLP', tasa: clRate },
    { nombre: 'Uruguay',   flag: '🇺🇾', codigo: 'UYU', tasa: uyRate },
  ].filter(x => typeof x.tasa === 'number');

  const e = new EmbedBuilder()
    .setColor('Gold')
    .setTitle('🏁 COMPARACIÓN COMPLETA DE COTIZACIONES')
    .setDescription(`${solicitanteTag} compara **1 USD** entre todos los países disponibles:`)
    .setTimestamp();

  if (items.length === 0) {
    e.setDescription('⚠️ No hay datos para comparar ahora mismo.');
    return e;
  }

  for (const it of items) {
    e.addFields({
      name: `${it.flag} ${it.nombre}`,
      value: [
        `**Tasa:** ${fmt(it.tasa)} ${it.codigo}`,
        `**Total:** ${fmt(it.tasa)} ${it.codigo}`,
        `**Fuente:** ${it.nombre === 'Argentina' ? 'Dólar Blue' : 'Dólar Oficial'}`,
        `**Actualizado:** ahora`
      ].join('\n'),
      inline: true
    });
  }

  const best = items.reduce((a,b)=> (a.tasa > b.tasa ? a : b));
  const worst = items.reduce((a,b)=> (a.tasa < b.tasa ? a : b));
  const diff = best.tasa - worst.tasa;
  const varPct = (best.tasa / worst.tasa) - 1;

  e.addFields(
    { name: '🔎 Análisis de Diferencias', value: '\u200B', inline: false },
    { name: '🥇 Mejor cotización:', value: `${best.flag} ${best.nombre}`, inline: true },
    { name: '🥉 Peor cotización:', value: `${worst.flag} ${worst.nombre}`, inline: true },
    { name: '📏 Diferencia:', value: `${fmt(diff)} ${best.codigo}`, inline: true },
    { name: '📈 Variación:', value: `${(varPct*100).toFixed(2)}%`, inline: true },
  ).setFooter({ text: `Comparación actualizada • ${hoy()}` });

  return e;
}

// ----------------- Comando -----------------
module.exports = {
  name: 'dolar',
  description: '💵 | Obtén la cotización del dólar para Argentina, Chile y Uruguay',
  type: 1,
  run: async (client, interaction) => {
    const ar = await obtenerCotizacionArgentina();
    const embedInicial = embedArgentina(ar);

    const replyMsg = await interaction.reply({ 
      embeds: [embedInicial], 
      components: [crearMenu(false), crearBotones(false)]
    });

    // Estado por mensaje
    let selectedCountry = 'argentina';

    // --- Collector del menú (sin expiración)
    const menuCollector = replyMsg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: i => i.customId === 'seleccionar_pais'
    });

    menuCollector.on('collect', async i => {
      const pais = i.values[0];
      selectedCountry = pais;

      if (pais === 'argentina') {
        const a = await obtenerCotizacionArgentina();
        await i.update({ embeds: [embedArgentina(a)], components: [crearMenu(false), crearBotones(false)] });
        return;
      }

      const g = await obtenerCotizacionGeneral(pais);
      await i.update({ embeds: [embedGeneralPais(pais, g)], components: [crearMenu(false), crearBotones(false)] });
    });

    // --- Collector de botones (sin expiración)
    const buttonCollector = replyMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: i => ['btn_calc','btn_compare','btn_hist'].includes(i.customId)
    });

    // CALCULADORA (modal)
    buttonCollector.on('collect', async i => {
      if (i.customId === 'btn_calc') {
        const modal = new ModalBuilder()
          .setCustomId('modal_calc_usd')
          .setTitle('🧮 Calculadora de USD');

        const input = new TextInputBuilder()
          .setCustomId('usd_amount')
          .setLabel('Cantidad en USD')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Ej: 50')
          .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(input));
        await i.showModal(modal);

        try {
          const submit = await i.awaitModalSubmit({
            time: 60_000,
            filter: (m) => m.customId === 'modal_calc_usd' && m.user.id === i.user.id
          });

          const raw = submit.fields.getTextInputValue('usd_amount');
          const amount = Number(String(raw).replace(',', '.'));
          if (!amount || amount <= 0) {
            return submit.reply({ content: '❌ Ingresa un número válido mayor a 0.', ephemeral: true });
          }

          let rate, code, fuente;
          if (selectedCountry === 'argentina') {
            const a = await obtenerCotizacionArgentina();
            if (!a.ok) return submit.reply({ content: '⚠️ No se pudo obtener la cotización.', ephemeral: true });
            rate = a.valores.blue.venta; // calculadora usa Blue por defecto
            code = 'ARS';
            fuente = 'dolarapi.com (Blue)';
          } else {
            const g = await obtenerCotizacionGeneral(selectedCountry);
            if (!g.ok) return submit.reply({ content: '⚠️ No se pudo obtener la cotización.', ephemeral: true });
            rate = g.cotizacion;
            code = g.codigo;
            fuente = g.fuente;
          }

          const total = rate * amount;
          const emb = new EmbedBuilder()
            .setColor('#000001')
            .setTitle('🧮 Calculadora de USD')
            .setDescription(`País: **${selectedCountry}**`)
            .addFields(
              { name: 'Cantidad', value: `\`\`\`\n${fmt(amount, 2)} USD\`\`\``, inline: true },
              { name: 'Tasa', value: `\`\`\`\n1 USD = ${fmt(rate)} ${code}\`\`\``, inline: true },
              { name: 'Total', value: `\`\`\`\n${fmt(total)} ${code}\`\`\``, inline: false },
              { name: 'Fuente', value: `\`\`\`${fuente}\`\`\`` }
            )
            .setFooter({ text: `Calculado • ${hoy()}` });

          await submit.reply({ embeds: [emb], ephemeral: true });
        } catch (err) {
          console.error('[MODAL CALC]', err?.message || err);
        }
      }

      // COMPARAR
      if (i.customId === 'btn_compare') {
        const a = await obtenerCotizacionArgentina();
        const c = await obtenerCotizacionGeneral('chile');
        const u = await obtenerCotizacionGeneral('uruguay');
        const emb = embedComparacion(a, c, u, `<@${i.user.id}>`);
        await i.reply({ embeds: [emb], ephemeral: true });
      }
      }
    )}
};