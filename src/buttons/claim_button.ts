import { ButtonStyle, TextChannel } from "discord.js";
import keys from "../keys";
import { button, generateActionRows, generateButton } from "../utils";
import { CustomEmbeds } from "../config/embeds";

export default button('claim_button', async ({ client, interaction }) => {
    try {
        const [_, _channel] = interaction.customId.split(':');
        const guild = await client.guilds.fetch(keys.GUILD_ID);
        const channel = await guild.channels.fetch(_channel) as TextChannel;

        await interaction.update({
            components: generateActionRows(
                [generateButton({ custom_id: 'claim_button', style: ButtonStyle.Secondary, label: 'Claim Ticket', disabled: true, emoji: '🔒' })]
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
        await interaction.update({
            components: generateActionRows(
                [generateButton({ custom_id: 'claim_button', style: ButtonStyle.Secondary, label: 'Claim Ticket', disabled: true, emoji: '🔒' })]
            )
        })
    }
})