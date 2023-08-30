import { category } from "../../utils";
import close from "./close";
import ticket from "./ticket";

const _ = category('Ticket', [
    ticket,
    close,
], { emoji: '🎫', description: 'Ticket commands' })

export default _;
