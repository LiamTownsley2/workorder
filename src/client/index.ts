import keys from '../keys';
import events from '../events';
import CustomClient from './CustomClient';
import { registerEvents } from '../utils';
import { connectToDatabase } from '../services';


const _customClient = new CustomClient();

(async () => {
    try {
        console.log('[client]', 'Attempting connection to Database.')
        await connectToDatabase();

        console.log('[client]', 'Attempting to register events.')
        registerEvents(_customClient, events);

        console.log('[client]', 'Attempting to login to Discord using token provided.')
        await _customClient.login(keys.DISCORD_TOKEN)

        console.log('[client]', 'Sucesfully logged into Discord.')

    } catch (error) {
        console.log('[client]', 'Error logging into Discord.')
        console.error(error)
        process.exit(1);
    } finally {
        console.log('[client] >> Status:', 'READY');
    }
})();