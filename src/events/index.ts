import { Event } from '../types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import guildMemberAdd from './guildMemberAdd';

const events: Event<any>[] = [
    ready,
    guildMemberAdd,
    ...interactionCreate
]

export default events