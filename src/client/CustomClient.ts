import { Client, GatewayIntentBits, Snowflake } from "discord.js";

export default class CustomClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    public async log(id:string, ...args:any[]) {
        console.log(`[${id}]`, ...args);
    }
}