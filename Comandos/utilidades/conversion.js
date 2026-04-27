const Discord = require("discord.js");
const axios = require("axios");
const config = require('../../config.json');

module.exports = {
  name: "conversion",
  description: "🔨 | Convierte entre distintas monedas (USD, BRL, EUR, CLP, UYU, ARS).",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "cantidad",
      description: "Cantidad de dinero a convertir.",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "moneda",
      description: "Moneda de origen.",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "🇦🇷 Peso Argentino (ARS)", value: "ars" },
        { name: "🇺🇸 Dólar (USD)", value: "usd" },
        { name: "🇧🇷 Real (BRL)", value: "brl" },
        { name: "🇪🇺 Euro (EUR)", value: "eur" },
        { name: "🇨🇱 Peso Chileno (CLP)", value: "clp" },
        { name: "🇺🇾 Peso Uruguayo (UYU)", value: "uyu" },
      ],
    },
    {
      name: "hacia",
      description: "Moneda destino.",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "🇦🇷 Peso Argentino (ARS)", value: "ars" },
        { name: "🇺🇸 Dólar (USD)", value: "usd" },
        { name: "🇧🇷 Real (BRL)", value: "brl" },
        { name: "🇪🇺 Euro (EUR)", value: "eur" },
        { name: "🇨🇱 Peso Chileno (CLP)", value: "clp" },
        { name: "🇺🇾 Peso Uruguayo (UYU)", value: "uyu" },
      ],
    },
  ],

  run: async (client, interaction) => {
    const cantidad = interaction.options.getNumber("cantidad");
    const monedaOrigen = interaction.options.getString("moneda");
    const monedaDestino = interaction.options.getString("hacia");

    if (monedaOrigen === monedaDestino) {
      return interaction.reply({
        content: "⚠️ | No puedes convertir a la misma moneda.",
        ephemeral: true,
      });
    }

    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/6d207d967c74439569e4b67a/latest/USD`
      );
      const rates = response.data.conversion_rates;

      // Información de cada moneda
      const infoMoneda = {
        ars: { simbolo: "$", nombre: "Pesos Argentinos (ARS)", bandera: "🇦🇷" },
        usd: { simbolo: "USD$", nombre: "Dólares (USD)", bandera: "🇺🇸" },
        brl: { simbolo: "R$", nombre: "Reales (BRL)", bandera: "🇧🇷" },
        eur: { simbolo: "€", nombre: "Euros (EUR)", bandera: "🇪🇺" },
        clp: { simbolo: "CLP$", nombre: "Pesos Chilenos (CLP)", bandera: "🇨🇱" },
        uyu: { simbolo: "$U", nombre: "Pesos Uruguayos (UYU)", bandera: "🇺🇾" },
      };

      // Tasas relativas a ARS
      const tasas = {
        usd: rates.ARS,               // 1 USD -> ARS
        brl: rates.ARS / rates.BRL,   // 1 BRL -> ARS
        eur: rates.ARS / rates.EUR,   // 1 EUR -> ARS
        clp: rates.ARS / rates.CLP,   // 1 CLP -> ARS
        uyu: rates.ARS / rates.UYU,   // 1 UYU -> ARS
        ars: 1,                       // base
      };

      let resultado, tipoCambio;

      if (monedaDestino === "ars") {
        // cualquier moneda -> ARS
        resultado = cantidad * tasas[monedaOrigen];
        tipoCambio = `1 ${infoMoneda[monedaOrigen].simbolo} = ${new Intl.NumberFormat("es-AR", {
          minimumFractionDigits: 2
        }).format(tasas[monedaOrigen])} ARS`;
      } else if (monedaOrigen === "ars") {
        // ARS -> cualquier moneda
        resultado = cantidad / tasas[monedaDestino];
        tipoCambio = `1 ARS = ${(1 / tasas[monedaDestino]).toFixed(4)} ${infoMoneda[monedaDestino].simbolo}`;
      } else {
        // conversión cruzada (ej: USD -> EUR)
        const enArs = cantidad * tasas[monedaOrigen];
        resultado = enArs / tasas[monedaDestino];
        tipoCambio = `1 ${infoMoneda[monedaOrigen].simbolo} = ${(tasas[monedaOrigen] / tasas[monedaDestino]).toFixed(4)} ${infoMoneda[monedaDestino].simbolo}`;
      }

      const formato = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

      // Embed
      const embed = new Discord.EmbedBuilder()
        .setColor("#000001") // color fijo
        .setTitle(`**🔄 __Conversión de Divisas__**`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `**${infoMoneda[monedaOrigen].bandera} ${infoMoneda[monedaOrigen].nombre}** ➝ **${infoMoneda[monedaDestino].bandera} ${infoMoneda[monedaDestino].nombre}**`)
        .addFields(
          { name: "• Cantidad:", value: `\`${infoMoneda[monedaOrigen].simbolo}${formato.format(cantidad)}\``, inline: true },
          { name: "• A convertir:", value: `${infoMoneda[monedaDestino].bandera} ${infoMoneda[monedaDestino].simbolo}`, inline: true },
          { name: "• Resultado Final:", value: `\`\`\`${infoMoneda[monedaDestino].simbolo}${formato.format(resultado)}\`\`\``, inline: false }
        )
        .setFooter({
          text: "Powered by ExchangeRate API",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error al obtener la cotización:", error);
      await interaction.reply({
        content: "⚠️ | No se pudo obtener la cotización en este momento. Intenta nuevamente más tarde.",
        ephemeral: true,
      });
    }
  },
};
