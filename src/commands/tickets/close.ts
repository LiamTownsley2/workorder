import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { askButtonQuestion, command } from '../../utils'
import { isTicket } from '../../utils/tickets'
import { CustomEmbeds } from '../../config/embeds'
import { getTicketFromDatabase } from '../../services'
import keys from '../../keys'

const meta = new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)

export default command(meta, {
    guild_command: false
}, async ({ interaction, client }) => {
    if (!interaction.guild || !interaction.channel) return;

    const ticket = await getTicketFromDatabase(interaction.channel.id);

    if (ticket) {
        const confirm = await askButtonQuestion('Are you sure you want to close this ticket?', interaction.channel as TextChannel, interaction.user.id, ['✅', '❌'])
        if (confirm == 1) {
            await (interaction.channel as TextChannel).delete(`Ticked closed by: ${interaction.user.username} (${interaction.user.id})`).catch(() => {});
        }
        
        if(ticket.message_id) {
            const freelancerChannel = await client.channels.fetch(keys.PENDING_ORDERS_CHANNEL) as TextChannel;
            await freelancerChannel.messages.delete(ticket.message_id).catch(() => {});
        }        
    } else {
        await interaction.channel.delete().catch(() => {});
    }

})