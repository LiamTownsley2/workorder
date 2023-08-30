import { Ticket } from "../../types";
import { collections } from "./database";

export async function getTicketFromDatabase(channel_id: string) {
    try {
        const res = await collections.tickets?.findOne({ channel_id });
        if (res) return res as Ticket;
        return undefined;
    } catch (err) {
        console.log('[database]', err);
        return undefined;
    }
}

export async function insertTicketToDatabase(ticket: Ticket) {
    try {
        const { channel_id } = ticket;
        const res = await collections.tickets?.replaceOne({ channel_id }, ticket, { upsert: true });
        return ((res?.modifiedCount ?? 0) > 0 || (res?.upsertedCount ?? 0) > 0);
    } catch (err) {
        console.log('[database]', err);
        return false;
    }
}