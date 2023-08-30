import { TextChannel } from "discord.js";
import { askButtonQuestion, button } from "../utils";
import { getTicketFromDatabase } from "../services";
import keys from "../keys";

export default button('close_ticket', async ({ client, interaction }) => {
    if (!interaction.channel) return;
    await interaction.deferUpdate();
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
    }


})