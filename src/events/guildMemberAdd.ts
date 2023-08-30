import { ButtonStyle, TextChannel } from "discord.js";
import keys from "../keys";
import { event, generateActionRows, generateButton } from "../utils";
import { CustomEmbeds } from "../config/embeds";

export default event('guildMemberAdd', async ({ client }, member) => {
    const requestChannel = await client.channels.fetch(keys.APPROVAL_CHANNEL_ID) as TextChannel;

    const request = await requestChannel.send({
        content: keys.APPROVAL_MENTION_USERS
            .split(',')
            .map(x => `<@${x}>`)
            .join(' '),
        embeds: [CustomEmbeds.member_join.needs_approval(member.user)],
        components: generateActionRows([
            generateButton({
                custom_id: `approve_member:${member.user.id}`,
                style: ButtonStyle.Success,
                emoji: '✅',
                label: 'Approve Member'
            }),
            generateButton({
                custom_id: `decline_member:${member.user.id}`,
                style: ButtonStyle.Secondary,
                emoji: '❌',
                label: 'Decline Member'
            }),
        ])
    })

    setTimeout(async () => {
        const guild = await client.guilds.fetch(keys.GUILD_ID);
        const refetched_member = await guild.members.fetch(member.user.id);

        if(!refetched_member.roles.cache.has(keys.APPROVED_MEMBER_ROLE)) {
            await member.kick('Automatically kicked, join request timed out.').catch(() => {});
            await request.delete().catch(() => {});
        }
    }, 600000)
})