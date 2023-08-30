import { Button } from "../types";
import accept_order from "./accept_order";
import approve_member from "./approve_member";
import claim_button from "./claim_button";
import close_ticket from "./close_ticket";
import create_bug from "./create_bug";
import create_plugin from "./create_plugin";
import decline_member from "./decline_member";
import decline_order from "./decline_order";

const buttons: Button[] = [
    claim_button,
    accept_order,
    decline_order,
    create_plugin,
    create_bug,
    close_ticket,
    approve_member,
    decline_member
]

export default buttons;