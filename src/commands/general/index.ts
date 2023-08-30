import { category } from "../../utils";
import echo from "./echo";
import sendticketembed from "./sendticketembed";

const _ = category('General', [
    echo,
    sendticketembed,
], { emoji: '🌠', description: 'General purpose commands' })

export default _;
