import { ButtonStyle, Guild, GuildMember, SlashCommandBuilder, TextBasedChannel, TextChannel, User } from 'discord.js'
import { askButtonQuestion, askStringQuestion, command, generateActionRows, generateButton } from '../../utils'
import { createTicket } from '../../utils/tickets'
import { CustomEmbeds } from '../../config/embeds'
import { UserQuestionGroup } from '../../types'
import keys from '../../keys'
import { insertTicketToDatabase } from '../../services'

const meta = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a new ticket!')
    .addStringOption((opt) => opt
        .setName('type')
        .setDescription('What type of ticket would you like to create?')
        .addChoices(
            { name: 'New Plugin', value: 'new_plugin' },
            { name: 'Bug', value: 'Bug' }
        )
        .setRequired(true)
    )

export const USER_QUESTIONS: UserQuestionGroup[] = [{
    name: 'new_plugin',
    questions: [
        { question: 'Please describe the features that you would want included in the plugin.', type: 'string' },
        { question: 'What is the deadline for this plugin being created?', type: 'string' },
        { question: 'Is there any additional information you would like to provide?', type: 'string' }
    ]
}, {
    name: 'bug',
    questions: [
        { question: 'Please describe the bug you encountered.', type: 'string' },
        { question: 'Is there any additional information you would like to provide?', type: 'string' }
    ]
}];

export default command(meta, {
    guild_command: false
}, async ({ interaction, client }) => {
    if (!interaction.guild || !interaction.channel) return;

    await interaction.deferReply({ ephemeral: true });

    const type = interaction.options.getString('type', true);

    const ticket = await createTicket(interaction.guild, interaction.user, type);
    if (!ticket) return interaction.editReply({ embeds: [CustomEmbeds.tickets.ticket_not_created()] });
    if (typeof ticket == 'string') {
        return interaction.editReply({
            embeds: [CustomEmbeds.tickets.existing_ticket(ticket)]
        });
    }

    await interaction.editReply({
        embeds: [CustomEmbeds.tickets.ticket_created(ticket.id)]
    })

    await handleTicket(interaction.guild, ticket, interaction.user, type);
})

export async function handleTicket(guild: Guild, ticket: TextBasedChannel, author: User, type: string) {
    const selectedGroup = USER_QUESTIONS.find(x => x.name == type);
    if (!selectedGroup) return;

    for (const question of selectedGroup.questions) {
        if (question.type == 'string') question.answer = await askStringQuestion(question.question, ticket as TextChannel, author.id);
        if (question.type == 'boolean') question.answer = (await askButtonQuestion(question.question, ticket as TextChannel, author.id, ['✅', '❌']) == 1) ? 'Accept' : 'Decline';
    }

    const selectFreelancer = await askButtonQuestion('Do you have a specific developer you would like to work on this project?', ticket as TextChannel, author.id, ['✅', '❌']);

    let selectFreelancerID;
    if (selectFreelancer == 1) {
        const name = await askStringQuestion('Please enter the name of the developer you would like to take care of your ticket.', ticket as TextChannel, author.id);

        const _members = await guild.members.fetch();
        const freelancer = _members.filter((x: GuildMember) => (x.user.tag == name || x.displayName == name || x.user.globalName == name || x.nickname == name || x.user.id == name) && x.roles.cache.filter(x => keys.FREELANCER_ROLE_IDS.includes(x.id)).size > 0);
        selectFreelancerID = freelancer.first()?.id;

        while (!selectFreelancerID) {
            const __name = await askStringQuestion('Please enter the name of the developer you would like to take care of your ticket.', ticket as TextChannel, author.id);
            const __freelancer = _members.filter(x => (x.user.tag == __name || x.displayName == __name || x.user.globalName == __name || x.nickname == __name || x.user.id == __name) && x.roles.cache.filter(x => keys.FREELANCER_ROLE_IDS.includes(x.id)).size > 0);
            selectFreelancerID = __freelancer.first()?.id;
        }
    }

    const _overview = await ticket.send({
        embeds: [CustomEmbeds.tickets.ticket_overview(selectedGroup.questions)]
    });

    await _overview.pin();

    const pendingOrdersChannel = await guild.channels.fetch(keys.PENDING_ORDERS_CHANNEL) as TextChannel;
    let replyID;

    if (selectFreelancerID) {
        const freelancer = await guild.members.fetch(selectFreelancerID);
        try {
            const freeRes = await freelancer.send({
                content: (selectFreelancerID) ? `<@${selectFreelancerID}> a work order has been created and you have been selected as their preferred freelancer. Would you like to accept this order?` : undefined,
                embeds: [CustomEmbeds.tickets.ticket_overview(selectedGroup.questions, author)],
                components: generateActionRows(
                    [
                        generateButton({ custom_id: `accept_order:${ticket.id}:${selectFreelancerID}`, style: ButtonStyle.Success, label: 'Accept Ticket', disabled: false, emoji: '✅' }),
                        generateButton({ custom_id: `decline_order:${ticket.id}:${selectFreelancerID}`, style: ButtonStyle.Danger, label: 'Decline Ticket', disabled: false, emoji: '✖' })
                    ]
                )
            });
            replyID = freeRes.id;

        } catch (error) {
            const pendingRes = await pendingOrdersChannel.send({
                content: (selectFreelancerID) ? `<@${selectFreelancerID}> a work order has been created and you have been selected as their preferred freelancer. Would you like to accept this order?` : undefined,
                embeds: [CustomEmbeds.tickets.ticket_overview(selectedGroup.questions, author)],
                components: generateActionRows(
                    [
                        generateButton({ custom_id: `accept_order:${ticket.id}:${selectFreelancerID}`, style: ButtonStyle.Success, label: 'Accept Ticket', disabled: false, emoji: '✅' }),
                        generateButton({ custom_id: `decline_order:${ticket.id}:${selectFreelancerID}`, style: ButtonStyle.Danger, label: 'Decline Ticket', disabled: false, emoji: '✖' })
                    ]
                )
            })
            replyID = pendingRes.id;
        }
    } else {
        const pendingOrderRes = await pendingOrdersChannel.send({
            embeds: [CustomEmbeds.tickets.ticket_overview(selectedGroup.questions, author)],
            components: generateActionRows(
                [generateButton({ custom_id: `claim_button:${ticket.id}`, style: ButtonStyle.Secondary, label: 'Claim Ticket', disabled: false, emoji: '🔗' })]
            )
        })
        replyID = pendingOrderRes.id;
          
    }

    await insertTicketToDatabase({
        channel_id: ticket.id,
        message_id: replyID
    })

    _overview.edit({
        components: generateActionRows(
            [generateButton({
                custom_id: `close_ticket:`,
                style: ButtonStyle.Danger,
                label: 'Close',
                emoji: '✖',
                disabled: false
            })]
        )
    });

    await ticket.send({
        embeds: [CustomEmbeds.tickets.ticket_awaiting_claim(selectFreelancerID)],
    });

    return;
}