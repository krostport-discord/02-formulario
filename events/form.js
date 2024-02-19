const Discord = require("discord.js")
const config = require("../config.json")
const client = require("..")

const { pergunta1, pergunta2, pergunta3 } = config.perguntas
const { logsId, roleId } = config.info

client.on("interactionCreate", async(interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "form_modal") {
            const modal = new Discord.ModalBuilder()
            .setTitle("Formulario De Inscrição")
            .setCustomId("modal_form")

            const p1 = new Discord.TextInputBuilder()
            .setCustomId("pergunta1")
            .setLabel(pergunta1.title)
            .setPlaceholder(pergunta1.placeholder)
            .setRequired(true)
            .setStyle(Discord.TextInputStyle.Short)

            const p2 = new Discord.TextInputBuilder()
            .setCustomId("pergunta2")
            .setLabel(pergunta2.title)
            .setPlaceholder(pergunta2.placeholder)
            .setRequired(true)
            .setStyle(Discord.TextInputStyle.Short)

            const p3 = new Discord.TextInputBuilder()
            .setCustomId("pergunta3")
            .setLabel(pergunta3.title)
            .setPlaceholder(pergunta3.placeholder)
            .setRequired(true)
            .setStyle(Discord.TextInputStyle.Short)

            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(p1),
                new Discord.ActionRowBuilder().addComponents(p2),
                new Discord.ActionRowBuilder().addComponents(p3)
            )

            await interaction.showModal(modal)
        } else if (interaction.customId === "accept") {
            const role = interaction.guild.roles.cache.get(roleId)
            const member = interaction.guild.members.cache.get(interaction.message.embeds[0].footer.text)
            if (!interaction.member.permissions.has("32")) return interaction.reply({ content: "Você não tem permissão para usar os botões!", ephemeral: true });

            if(interaction.guild.members.cache.get(client.user.id).roles.highest.comparePositionTo(role.id) <= 0 ) return interaction.reply({ content: "Não foi possivel atribuir o cargo ao usuario, coloque meu cargo no topo e tente novamente!", ephemeral: true });
            member.roles.add(role)

            const embedAccept = new Discord.EmbedBuilder()
            .setTitle("Você foi aceito | Sistema de Logs")
            .setDescription(`Parabéns, você foi aceito no servidor **${interaction.guild.name}**!`)
            .setColor('Green')

            member.send({
                content: `<@${member.id}>`,
                embeds: [embedAccept]
            })

            interaction.update({
                embeds:[
                    new Discord.EmbedBuilder()
                    .setTitle("Sistema de Logs | Novo Formulario")
                    .setDescription(`
                    O usuario ${member} fez o formulario de inscrição, e foi aceito por ${interaction.user}!
        
                    **Informações:**
                    > :timer: **Enviado <t:${Math.floor(Date.now() / 1000)}:R>**
                    > :gem: Aceito pelo ${interaction.user}
                    `)
                    .setFooter({ text: interaction.user.id })
                    .setColor("Green")
                ],

                components: [
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("accept")
                        .setLabel("Aceitar")
                        .setDisabled(true)
                        .setEmoji("✔")
                        .setStyle(Discord.ButtonStyle.Success),
        
                        new Discord.ButtonBuilder()
                        .setCustomId("reject")
                        .setLabel("Rejeitar")
                        .setDisabled(true)
                        .setEmoji("✖")
                        .setStyle(Discord.ButtonStyle.Danger)
                    )
                ]
            })
        } else if (interaction.customId === "reject") {
            const member = interaction.guild.members.cache.get(interaction.message.embeds[0].footer.text)
            if (!member.permissions.has("32")) return interaction.reply({ content: "Você não tem permissão para usar os botões!", ephemeral: true });

            const embedAccept = new Discord.EmbedBuilder()
            .setTitle("Formulario Recusado | Sistema de Logs")
            .setDescription(`Infelizmente você foi recusado no servidor **${interaction.guild.name}**, tente novamente mais tarde!`)
            .setColor('Green')

            member.send({
                content: `<@${member.id}>`,
                embeds: [embedAccept]
            })

            interaction.update({
                embeds:[
                    new Discord.EmbedBuilder()
                    .setTitle("Sistema de Logs | Novo Formulario")
                    .setDescription(`
                    O usuario ${member} fez o formulario de inscrição, e foi recusado por ${interaction.user}!
        
                    **Informações:**
                    > :timer: **Enviado <t:${Math.floor(Date.now() / 1000)}:R>**
                    > :gem: Recusado pelo ${interaction.user}
                    `)
                    .setFooter({ text: interaction.user.id })
                    .setColor("Red")
                ],

                components: [
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("accept")
                        .setLabel("Aceitar")
                        .setDisabled(true)
                        .setEmoji("✔")
                        .setStyle(Discord.ButtonStyle.Success),
        
                        new Discord.ButtonBuilder()
                        .setCustomId("reject")
                        .setLabel("Rejeitar")
                        .setDisabled(true)
                        .setEmoji("✖")
                        .setStyle(Discord.ButtonStyle.Danger)
                    )
                ]
            })
        }
    }
})

client.on("interactionCreate", async(interaction, client) => {
    if (interaction.isModalSubmit()) {
        if(interaction.customId === "modal_form") {
            const role = interaction.guild.roles.cache.get(roleId)
            const logsChannel = interaction.guild.channels.cache.get(logsId)

            const p1 = interaction.fields.getTextInputValue("pergunta1")
            const p2 = interaction.fields.getTextInputValue("pergunta2")
            const p3 = interaction.fields.getTextInputValue("pergunta3")

            interaction.reply({
                content: "O formulario foi enviado, você receberá uma reposta em breve! Aguarde...",
                ephemeral: true
            })

            const embedLogs = new Discord.EmbedBuilder()
            .setTitle("Sistema de Logs | Novo Formulario")
            .setDescription(`
            O usuario ${interaction.user} fez o formulario de inscrição, e aguarda ser chamado ou recusado!
            :identification_card: Para aceitar ou recusar o usuario, utilize os botões abaixo!

            **Informações:**
            > :timer: **Enviado <t:${Math.floor(Date.now() / 1000)}:R>**

            **Respostas:**
            > \`${pergunta1.title}\`: ${p1}
            > \`${pergunta2.title}\`: ${p2}
            > \`${pergunta3.title}\`: ${p3}
            `)
            .setFooter({ text: interaction.user.id })
            .setColor("Yellow")

            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setCustomId("accept")
                .setLabel("Aceitar")
                .setEmoji("✔")
                .setStyle(Discord.ButtonStyle.Success),

                new Discord.ButtonBuilder()
                .setCustomId("reject")
                .setLabel("Rejeitar")
                .setEmoji("✖")
                .setStyle(Discord.ButtonStyle.Danger)
            )

            logsChannel.send({
                embeds: [embedLogs],
                components: [row]
            })
        }
    }
})