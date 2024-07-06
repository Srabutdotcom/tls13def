import * as x25519 from "@stablelib/x25519"
import { ClientHello, Handshake, KeyShareEntry, NamedGroup, TLSPlaintext } from "../mod.js";

export class ClientHelloRecord {
   constructor(hostname='localhost'){
      this.keys = x25519.generateKeyPair();
      this.keyShareEntry = new KeyShareEntry(NamedGroup.x25519, this.keys.publicKey);
      this.clientHello = new ClientHello(hostname, this.keyShareEntry);
      this.handshake = new Handshake(this.clientHello);
      this.record = new TLSPlaintext(this.handshake)
   }
}