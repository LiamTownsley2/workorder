import { Awaitable, ButtonInteraction, ButtonStyle } from "discord.js";
import CustomClient from "../client/CustomClient";

export interface Button {
    id: string
    exec: ButtonExec
}
export interface ButtonProps {
    interaction: ButtonInteraction
    client: CustomClient
}
export type ButtonExec =
    (props: ButtonProps) => Awaitable<unknown>

export type IDButtonStyle = ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger;

export interface IDButton {
    label: string;
    style: IDButtonStyle;
    custom_id: string;
    emoji?: string;
    disabled?: boolean;
}

export interface URLButton {
    url: string;
    label: string;
    disabled: boolean;
}

export interface EmojiButton {
    emoji: string;
    custom_id: string;
    style: IDButtonStyle;
    label?: string;
    disabled?: boolean;
}