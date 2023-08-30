import { ButtonStyle, TextChannel } from "discord.js";
import keys from "../keys";
import { button, generateActionRows, generateButton } from "../utils";
import { CustomEmbeds } from "../config/embeds";

export default button('accept_order', async ({ client, interaction }) => {
    try {
        const [_, _channel, freelancerID] = interaction.customId.split(':');
        if (freelancerID !== interaction.user.id) return;
        const guild = await client.guilds.fetch(keys.GUILD_ID);
        const channel = await guild.channels.fetch(_channel) as TextChannel;

        interaction.update({
            components: generateActionRows(
                [
                    generateButton({ custom_id: `accept_order`, style: ButtonStyle.Success, label: 'Accept Ticket', disabled: true, emoji: '✅' }),
                    generateButton({ custom_id: `decline_order`, style: ButtonStyle.Danger, label: 'Decline Ticket', disabled: true, emoji: '✖' })
                ]
            )
        })

        await channel.permissionOverwrites.create(interaction.user, {
            ViewChannel: true
        });

        await channel.send({
            content: interaction.user.toString(),
            embeds: [CustomEmbeds.tickets.ticket_claimed(interaction.user)]
        });
    } catch (error) {
        interaction.update({
            components: generateActionRows(
                [
                    generateButton({ custom_id: `accept_order`, style: ButtonStyle.Success, label: 'Accept Ticket', disabled: true, emoji: '✅' }),
                    generateButton({ custom_id: `decline_order`, style: ButtonStyle.Danger, label: 'Decline Ticket', disabled: true, emoji: '✖' })
                ]
            )
        })
    }
})