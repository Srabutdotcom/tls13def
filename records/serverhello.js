import * as x25519 from "@stablelib/x25519"
import { ServerHello, KeyShareEntry, NamedGroup } from '../def/keyxmsg.js'
import { Handshake} from "../def/handshake.js";
import { TLSPlaintext } from "../def/record.js";

export class ServerHelloRecord {
   constructor(sessionId, cipherSuite){
      this.keys = x25519.generateKeyPair();
      this.keyShareEntry = new KeyShareEntry(NamedGroup.x25519, this.keys.publicKey);
      this.serverHello = new ServerHello(sessionId,cipherSuite, this.keyShareEntry);
      this.handshake = new Handshake(this.serverHello);
      this.record = new TLSPlaintext(this.handshake)
   }
}