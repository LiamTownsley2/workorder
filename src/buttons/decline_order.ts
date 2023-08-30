import { ButtonStyle, TextChannel } from "discord.js";
import keys from "../keys";
import { button, generateActionRows, generateButton } from "../utils";
import { CustomEmbeds } from "../config/embeds";

export default button('decline_order', async ({ client, interaction }) => {
    const [_, _channel, freelancerID] = interaction.customId.split(':');
    if(freelancerID !== interaction.user.id) return;
    const guild = await client.guilds.fetch(keys.GUILD_ID);
    const channel = await guild.channels.fetch(_channel) as TextChannel;

    const embed = interaction.message.embeds[0];
    interaction.update({
        components: generateActionRows(
            [
                generateButton({ custom_id: `accept_order`, style: ButtonStyle.Success, label: 'Accept Ticket', disabled: true, emoji: '✅' }),
                generateButton({ custom_id: `decline_order`, style: ButtonStyle.Danger, label: 'Decline Ticket', disabled: true, emoji: '✖' })
            ]
        )
    })

    await channel.send({
        embeds: [CustomEmbeds.tickets.ticket_reassigned()]
    });

    const pendingOrdersChannel = await client.channels.fetch(keys.PENDING_ORDERS_CHANNEL) as TextChannel;
    pendingOrdersChannel.send({
        embeds: [embed],
        components: generateActionRows(
            [generateButton({ custom_id: `claim_button:${channel.id}`, style: ButtonStyle.Secondary, label: 'Claim Ticket', disabled: false, emoji: '🔗' })]
        )
    })
})