import { APIEmbed, Snowflake, TextBasedChannel, User } from "discord.js"
import { UserQuestion } from "../types";
import { DatabaseLounge } from "../types/lounges";

export const CustomColours = {
    success: 0x26de81,
    info: 0x4b7bec,
    failure: 0xeb3b5a,
    warning: 0xfd9644,
    accent: 0x2bcbba,
}

const DEFAULT_EMBED: Partial<APIEmbed> = {
    footer: {
        text: 'Bear Server Bot © 2023'
    },
    color: CustomColours.info
};

export const CustomEmbeds = {
    tickets: {
        existing_ticket(channel_id: Snowflake): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'Existing Ticket!',
                description: `You already have an existing ticket. Please use <#${channel_id}> instead of creating a new one.`,
                color: CustomColours.warning
            }
        },

        ticket_created(channel_id: Snowflake): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'Ticket Created',
                description: `Your ticket has been successfully created: <#${channel_id}>`,
                color: CustomColours.accent
            }
        },

        ticket_not_created(): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'Ticket Cannot be Created',
                description: 'Your ticket could not be created, please try again.',
                color: CustomColours.failure
            }
        },

        question(question: string): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: '❓ Answer this Question',
                description: question
            }
        },

        ticket_overview(questions: UserQuestion[], author?: User): APIEmbed {
            if (author) {
                return {
                    ...DEFAULT_EMBED,
                    title: 'Ticket Overview',
                    description: questions.map(x => `**${x.question}**\n${x.answer}`).join('\n\n'),
                    color: CustomColours.accent,
                    author: {
                        name: author.username,
                        icon_url: author.displayAvatarURL()
                    }
                }
            }

            return {
                ...DEFAULT_EMBED,
                title: 'Ticket Overview',
                description: questions.map(x => `**${x.question}**\n${x.answer}`).join('\n\n'),
                color: CustomColours.accent
            }
        },

        ticket_not_deleted(reason: string): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'Ticket Deletion Error',
                description: reason,
                color: CustomColours.failure
            }
        },

        ticket_claimed(user: User): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'Ticket Claimed!',
                description: `This ticket has been claimed by ${user.toString()}. They have now been added to the ticket.`,
                color: CustomColours.success
            }
        },

        ticket_awaiting_claim(select_freelancer?: string): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'Ticket Submitted',
                description: [
                    (select_freelancer) ? `Awaiting the response of <@${select_freelancer}>` : 'A freelancer will claim your ticket soon!'
                ].join('\n')
            }
        },

        ticket_reassigned(): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'Ticket Reassigned',
                description: 'The freelancer you selected is not available and has declined your commission. Your ticket has been opened to our other freelancers.'
            }
        },

        ticket_menu(): APIEmbed {
            return {
                title: 'Create a Ticket',
                description: 'To get in touch with our development team, use the buttons below to get in contact with the right team and a ticket will be generated for you!',
                color: CustomColours.accent
            }
        }
    },

    member_join: {
        needs_approval(user:User): APIEmbed {
            return {
                ...DEFAULT_EMBED,
                title: 'New Member Needs Approved',
                description: `${user.toString()} has joined the guild, <t:${Math.floor((new Date().getTime() + 600000) / 1000)}:R> this user will be kicked from the guild if they are not approved.`,
                thumbnail: {
                    url: user.displayAvatarURL()
                }
            }
        }
    }
}