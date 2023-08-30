import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface DatabaseMember {
    name: string;
    nickname: string | undefined;
    id: Snowflake;
}

export interface DatabaseLounge {
    guild_id: Snowflake;
    category_id: Snowflake;
    owner_id: Snowflake;
    manage_lounge_message: Snowflake;
    administrators: DatabaseMember[];
    members: DatabaseMember[];
    expires_at: Date;
    _id?: ObjectId;
}