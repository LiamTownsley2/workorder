import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { command } from '../../utils'
import { isTicket } from '../../utils/tickets'
import { CustomEmbeds } from '../../config/embeds'

const meta = new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)

export default command(meta, {
    guild_command: false
}, async ({ interaction, client }) => {
    if (!interaction.guild || !interaction.channel) return;

    if (!isTicket(interaction.channel as TextChannel)) return interaction.reply({
        embeds: [CustomEmbeds.tickets.ticket_not_deleted('This is not a Ticket Channel. You cannot execute this command here.')],
        ephemeral: true
    })

    await interaction.deferReply({ ephemeral: true });
    await interaction.channel.delete();
})