import { ButtonStyle, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command, generateActionRows, generateButton } from '../../utils'
import { CustomEmbeds } from '../../config/embeds';

const meta = new SlashCommandBuilder()
    .setName('sendticketembed')
    .setDescription('(ADMIN ONLY) Send the Ticket Embed for generation tickets.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default command(meta, {
    guild_command: true
}, async ({ interaction }) => {
    interaction.channel?.send({
        embeds: [CustomEmbeds.tickets.ticket_menu()],
        components: generateActionRows(
            [
                generateButton({ custom_id: 'create_plugin', style: ButtonStyle.Secondary, disabled: false, label: 'Create Plugin Ticket', emoji: '🎮' }),
                generateButton({ custom_id: 'create_bug', style: ButtonStyle.Secondary, disabled: false, label: 'Create Bug Ticket', emoji: '📋' })
            ]
        )
    })
    return await interaction.reply({
        content: 'Success!',
        ephemeral: true
    })
})