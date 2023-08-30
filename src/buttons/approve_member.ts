import { ButtonStyle, TextChannel } from "discord.js";
import keys from "../keys";
import { button, generateActionRows, generateButton } from "../utils";
import { CustomEmbeds } from "../config/embeds";

export default button('approve_member', async ({ client, interaction }) => {
    if (!interaction.guild) return;
    const [_, memberID] = interaction.customId.split(':');
    await interaction.deferUpdate();
    
    try {
        const member = await interaction.guild.members.fetch({ user: memberID });
        await member.roles.add(keys.APPROVED_MEMBER_ROLE);
        await interaction.message.delete();
    } catch (err) {

    }
})