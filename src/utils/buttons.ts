import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Button, ButtonExec, EmojiButton, IDButton, URLButton } from "../types/buttons";

export function button(id: string, exec: ButtonExec): Button {
    return {
        id,
        exec
    }
}

export function generateButton(button: IDButton | URLButton | EmojiButton): ButtonBuilder {
    if (_isIDButton(button)) {
        const idButton = button as IDButton;
        const _button = _generateIDButton(idButton)
        return _button;
    } else {
        const urlButton = button as URLButton;
        const _button = _generateURLButton(urlButton.url, urlButton.label, urlButton.disabled);
        return _button;
    }
}

export function generateActionRows(buttons: ButtonBuilder[]) {
    const actionRows: ActionRowBuilder<ButtonBuilder>[] = [];
    let currentRow = new ActionRowBuilder<ButtonBuilder>();

    for (const [i, button] of buttons.entries()) {
        currentRow.addComponents(button);
        if (currentRow.components.length === 5 || i === buttons.length - 1) {
            actionRows.push(currentRow);
            currentRow = new ActionRowBuilder();

        }
    }

    return actionRows;
}

function _generateIDButton(button: IDButton): ButtonBuilder {
    if (!(button.emoji == undefined && button.label == undefined)) {
        const _button = new ButtonBuilder()
            .setCustomId(button.custom_id)
            .setStyle(button.style)
            .setDisabled(button.disabled ?? false)

        if (button.label) _button.setLabel(button.label);
        if (button.emoji) _button.setEmoji(button.emoji);

        return _button;
    } else {
        throw new Error("Include either emoji or label in your buttons.");
    }
}

function _isIDButton(button: IDButton | URLButton | EmojiButton) {
    return ((button as IDButton).custom_id !== undefined);
}

function _generateURLButton(url: string, label: string, disabled: boolean = false): ButtonBuilder {
    return new ButtonBuilder()
        .setURL(url)
        .setLabel(label)
        .setDisabled(disabled)
        .setStyle(ButtonStyle.Link);
}
