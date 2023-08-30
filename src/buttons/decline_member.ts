import { ButtonStyle, TextChannel } from "discord.js";
import keys from "../keys";
import { button, generateActionRows, generateButton } from "../utils";
import { CustomEmbeds } from "../config/embeds";

export default button('decline_member', async ({ client, interaction }) => {
    const [_, memberID] = interaction.customId.split(':');
    if(!interaction.guild) return;
    try {
        const member = await interaction.guild.members.fetch({ user: memberID });
        await member.kick(`Member declined by ${interaction.member?.user.username}`);
        await interaction.message.delete();
    } catch (err) {

    }
})