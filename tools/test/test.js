import { Uint8BE } from "../tools.js";
import { ServerName } from "../../def/keyxmsg.js";
import * as tsl13def from '../../mod.js';

const b1 = Uint8BE(2**8-1);
const b2 = Uint8BE(2**(8*2)-1);
const b3 = Uint8BE(2**(8*3)-1);
const b4 = Uint8BE(2**(8*4)-1);

const sn = new ServerName('localhost')
debugger;