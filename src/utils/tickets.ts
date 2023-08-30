import { Guild, PermissionFlagsBits, TextChannel, User } from "discord.js";
import keys from "../keys";

export async function createTicket(guild: Guild, user: User, type: string): Promise<TextChannel | string | undefined> {
    let parentID;
    let prefix;
    switch (type) {
        case 'new_plugin': prefix = "work_order"; parentID = keys.PLUGIN_CATEGORY; break;
        case 'bug': prefix = "bug"; parentID = keys.BUG_CATEGORY; break;
    }

    const existing = await hasExistingTicket(guild, user, type);
    if (existing) return existing;

    return await guild.channels.create({
        name: `${prefix}-${user.username}`,
        topic: user.id,
        permissionOverwrites: [{ id: guild.id, deny: [PermissionFlagsBits.ViewChannel] }, { id: user.id, allow: [PermissionFlagsBits.ViewChannel] }],
        parent: parentID,
    });
}

export async function hasExistingTicket(guild: Guild, user: User, type: string): Promise<string | false> {
    let parentID: string;
    switch (type) {
        case 'new_plugin': parentID = keys.PLUGIN_CATEGORY; break;
        case 'bug': parentID = keys.BUG_CATEGORY; break;
    }


    const foundChannels = (await guild.channels.fetch()).filter(x => (x as TextChannel).topic == user.id && x?.parentId == parentID);
    if (foundChannels.size > 0) {
        return foundChannels.first()?.id ?? false;
    } else {
        return false;
    }
}

export function isTicket(channel: TextChannel): boolean {
    let ticket_prefixes = ['work_order', 'bug'];
    let parents = [keys.PLUGIN_CATEGORY, keys.BUG_CATEGORY];
    return ticket_prefixes.includes(channel.name.split('-')[0]) || parents.includes(channel.parentId!);
}