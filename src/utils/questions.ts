import {  User, Message, ButtonBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, MessageComponentInteraction, StringSelectMenuBuilder, ComponentType, APISelectMenuOption, TextBasedChannel, TextChannel, ButtonStyle, ChannelType } from 'discord.js';
import { CustomEmbeds } from '../config/embeds';

export async function askStringQuestion(question: string, channel: TextChannel, user_id: string): Promise<string | undefined> {
    const questionFilter = (m: Message) => {
        return m.author.id == user_id;
    }

    try {
        const _question = await channel.send({
            embeds: [CustomEmbeds.tickets.question(question)]
        });

        const _reply = await channel.awaitMessages({
            filter: questionFilter,
            max: 1,
            time: 600000,
            errors: ['time']
        });

        const content = _reply.first()?.content ?? undefined;
        await _question.delete().catch(() => { });
        await _reply.first()?.delete().catch(() => { });

        return Promise.resolve(content);
    } catch (error) {
    }
}

export async function askButtonQuestion(question: string, channel: TextChannel, author: string, emojis: string[]): Promise<number | undefined> {
    let buttons = emojis.map((x, i) => new ButtonBuilder()
        .setCustomId(`question_answer:${i}`)
        .setEmoji(x)
        .setStyle(ButtonStyle.Secondary)
    );
    const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(...buttons);

    const questionFilter = async (i: MessageComponentInteraction) => {
        await i.deferUpdate()
        return (i.user.id === author && i.customId.startsWith('question_answer'));
    }

    try {
        const _question = await channel.send({
            embeds: [CustomEmbeds.tickets.question(question)],
            components: [actionRow]
        });

        const _reply = await channel.awaitMessageComponent({
            filter: questionFilter,
            componentType: ComponentType.Button,
            time: 600_000 // 600_000 = 10 minutes
        });

        const [_, answer] = _reply.customId.split(':');

        await _question.delete().catch(() => { });
        await _reply.message.delete().catch(() => { });

        return Promise.resolve(parseInt(answer) + 1);
    } catch (error) {
        console.log(error);
        return Promise.resolve(undefined);
    }
}

export async function askTextButtonQuestion(question: string, channel: TextChannel, author: string, labels: string[]): Promise<number | undefined> {
    let buttons = labels.map((x, i) => new ButtonBuilder()
        .setCustomId(`text_button:${x}`)
        .setLabel(x)
        .setStyle(ButtonStyle.Secondary)
    );
    const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(...buttons);

    try {
        const _question = await channel.send({
            embeds: [CustomEmbeds.tickets.question(question)],
            components: [actionRow]
        });

    } catch (error) {
        console.log(error);
        return Promise.resolve(undefined);
    }
}

export async function askTextChannelQuestion(question: string, channel: TextChannel, author: User): Promise<string | undefined> {
    const questionFilter = async (i: MessageComponentInteraction) => {
        await i.deferUpdate()
        return i.user.id === author.id;
    }
    const _types:ChannelType[] = [ChannelType.GuildAnnouncement, ChannelType.GuildText, ChannelType.PrivateThread, ChannelType.PublicThread];

    const select_menu = new ActionRowBuilder<ChannelSelectMenuBuilder>()
        .addComponents(new ChannelSelectMenuBuilder()
            .setCustomId('channel_select')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder('Select a channel!')
            // .setChannelTypes()
            .setChannelTypes(_types)
        )

    try {
        const _question = await channel.send({
            embeds: [CustomEmbeds.tickets.question(question)],
            components: [select_menu]
        });

        const _reply = await channel.awaitMessageComponent({
            filter: questionFilter,
            componentType: ComponentType.ChannelSelect,
            time: 600_000 // 600_000 = 10 minutes
        });

        const content = _reply.values[0] ?? undefined;
        await _question.delete().catch(() => { });
        await _reply.message.delete().catch(() => { });

        return Promise.resolve(content);
    } catch (error) {
        console.log(error);
    }
}

export async function askSelectMenuQuestion(question: string, channel: TextBasedChannel, author: User, options: APISelectMenuOption[]): Promise<string | undefined> {
    const questionFilter = async (i: MessageComponentInteraction) => {
        await i.deferUpdate()
        return i.user.id === author.id;
    }

    const select_menu = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(new StringSelectMenuBuilder()
            .addOptions(options))

    try {
        const _question = await channel.send({
            embeds: [CustomEmbeds.tickets.question(question)],
            components: [select_menu]
        });

        const _reply = await channel.awaitMessageComponent({
            filter: questionFilter,
            componentType: ComponentType.StringSelect,
            time: 600_000 // 600_000 = 10 minutes
        });

        const content = _reply.values[0] ?? undefined;
        await _question.delete().catch(() => { });
        await _reply.message.delete().catch(() => { });

        return Promise.resolve(content);
    } catch (error) { }
}