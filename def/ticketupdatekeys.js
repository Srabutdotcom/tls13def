/**
 * !B.3.4.  Ticket Establishment
 * LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.4
 * *DONE - verified
 */

import { Struct, Uint32, Uint8, VariableVector } from "./base.js";
import { HandshakeType } from "./handshake.js";

export class NewSessionTicket extends Struct {
   type = HandshakeType.new_session_ticket;
   constructor(ticket, extension = new Uint8(0)) {
      const lifetime = new Uint32(7200)//in second
      const ageAdd = new Uint32(0)//in second
      const nonce = new VariableVector(new Uint8(0), 0, 255);
      const ticketVector = new VariableVector(ticket, 1, 2 ** 16 - 1);
      const Extension = new VariableVector(extension, 0, 2 ** 16 - 2);
      super(
         lifetime,
         ageAdd,
         nonce,
         ticketVector,
         Extension
      )
   }
}

/**
 * !B.3.5.  Updating Keys
 * LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.5
 * *DONE - verified
 */

export class EndOfEarlyData extends Struct {
   type = HandshakeType.end_of_early_data
   constructor() { super() }
}

export class KeyUpdateRequest {
   static update_not_requested = new Uint8(0)
   static update_requested = new Uint8(1)
   static Max = new Uint8(255)
}

export class KeyUpdate extends Struct {
   type=HandshakeType.key_update;
   constructor(request_update) {
      const KeyUpdateRequest = request_update
      super(KeyUpdateRequest)
   }
}
