import { Keys } from "./types";

const keys: Keys = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN ?? 'nd',
    DB_CONN_STRING: process.env.DB_CONN_STRING ?? 'nd',
    DB_NAME: process.env.DB_NAME ?? 'nd',
    CLIENT_ID: process.env.CLIENT_ID ?? 'nd',
    GUILD_ID: process.env.GUILD_ID ?? 'nd',
    PLUGIN_CATEGORY: process.env.PLUGIN_CATEGORY ?? 'nd',
    BUG_CATEGORY: process.env.BUG_CATEGORY ?? 'nd',
    PENDING_ORDERS_CHANNEL: process.env.PENDING_ORDERS_CHANNEL ?? 'nd',
    APPROVED_MEMBER_ROLE: process.env.APPROVED_MEMBER_ROLE ?? 'nd',
    APPROVAL_CHANNEL_ID: process.env.APPROVAL_CHANNEL_ID ?? 'nd',
    APPROVAL_MENTION_USERS: process.env.APPROVAL_MENTION_USERS ?? 'nd',
    FREELANCER_ROLE_IDS: process.env.FREELANCER_ROLE_IDS ?? 'nd',
}

for (const [k, v] of Object.entries(keys)) {
    if(v as string == 'nd') {
        throw new Error(`[Environment Variable Error] Missing data within Environment Variable ${k}.`);        
    }
}

export default keys