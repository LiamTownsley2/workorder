import { ButtonStyle, TextChannel } from "discord.js";
import keys from "../keys";
import { button, generateActionRows, generateButton } from "../utils";
import { CustomEmbeds } from "../config/embeds";
import { createTicket } from "../utils/tickets";
import { handleTicket } from "../commands/tickets/ticket";

export default button('create_bug', async ({ client, interaction }) => {
    if (!interaction.guild) return;
    await interaction.deferReply({ ephemeral: true });

    const ticket = await createTicket(interaction.guild, interaction.user, 'bug');
    if (!ticket) return interaction.editReply({ embeds: [CustomEmbeds.tickets.ticket_not_created()] });
    if (typeof ticket == 'string') {
        return interaction.editReply({
            embeds: [CustomEmbeds.tickets.existing_ticket(ticket)]
        });
    }

    await interaction.editReply({
        embeds: [CustomEmbeds.tickets.ticket_created(ticket.id)]
    })

    await handleTicket(interaction.guild, ticket, interaction.user, 'bug');
})