import { Button } from "../../types";
import { event } from "../../utils";
import buttons from "../../buttons";

const allButtonsMap = new Map<string, Button>(
    buttons.map((x) => [x.id, x])
)

export default event('interactionCreate', async ({ client }, interaction) => {
    if (!interaction.isButton()) return
    try {
        const buttonId = interaction.customId.split(':')[0];
        const button = allButtonsMap.get(buttonId) as Button;
        if (button) {
            button.exec({ client, interaction });
        }
    } catch (error) {
        if (interaction.deferred) {
            return interaction.editReply({
                content: 'There was an error using this button, please try again later.'
            })
        }

        return interaction.reply({
            ephemeral: true,
            content: 'There was an error using this button, please try again later.'
        })
    }
})