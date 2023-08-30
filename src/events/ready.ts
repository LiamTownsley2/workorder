import { event } from '../utils';

export default event('ready', async ({ client }) => {
    if (!client.user) return;
    client.log(`ready`, `Logged in as ${client.user.tag}`);
})
