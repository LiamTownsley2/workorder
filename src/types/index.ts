import { ActivityType, Snowflake } from 'discord.js';
import { ObjectId } from 'mongodb';

export * from './commands';
export * from './keys';
export * from './events';
export * from './buttons';
export * from './buttons';

export type RestrictedActivityType = ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing | undefined;

export type UserQuestionType = "boolean" | "string";

export interface UserQuestion {
    question: string;
    type: UserQuestionType;
    answer?: string;
}

export interface UserQuestionGroup {
    name: string;
    questions: UserQuestion[];
}

export interface Ticket {
    channel_id: Snowflake;
    message_id: Snowflake;
    _id?: ObjectId;
}