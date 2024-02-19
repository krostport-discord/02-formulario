const Discord = require("discord.js")
const config = require("../../config.json")

module.exports = {
    name: "setup",
    description: "Envie a embed do formulario",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async(interaction, client) => {
        const { title, description, color } = config.embeds

        const embed = new Discord.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("form_modal")
            .setLabel("Formulario")
            .setStyle(Discord.ButtonStyle.Secondary)
        )

        interaction.reply({
            embeds: [embed],
            components: [row]
        })
    }
}