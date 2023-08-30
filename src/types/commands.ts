import { AutocompleteInteraction, Awaitable, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import CustomClient from "../client/CustomClient";


export interface CommandProps {
    interaction: ChatInputCommandInteraction
    client: CustomClient
}

export type CommandExec =
    (props: CommandProps) => Awaitable<unknown>

export interface AutocompleteProps {
    interaction: AutocompleteInteraction
    client: CustomClient
}

export type CommandAutocomplete =
    (props: AutocompleteProps) => Awaitable<unknown>

export type CommandMeta = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">

export interface CommandOptions {
    guild_command: boolean;
}

export interface Command {
    meta: CommandMeta
    options: CommandOptions
    exec: CommandExec
}

export interface AutoCompleteCommand extends Command {
    meta: CommandMeta
    options: CommandOptions
    exec: CommandExec
    autocomplete?: CommandAutocomplete
}

export interface CommandCategoryExtra {
    description?: string
    emoji?: string

}

export interface CommandCategory extends CommandCategoryExtra {
    name: string
    commands: Command[]
} 
