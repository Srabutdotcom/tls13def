/**
 * !SECTION B.3.  Handshake Protocol
 * LINK - static https=//datatracker.ietf.org/doc/html/rfc8446#appendix-B.3
 * *DONE - verified
 */

import { Struct, Uint24, Uint8 } from "./base.js"
import { ContentType } from "./record.js"

export class HandshakeType {
   static hello_request_RESERVED = new Uint8(0)
   static client_hello = new Uint8(1)                              //*Key Exchange
   static server_hello = new Uint8(2)                              //*Key Exchange
   static hello_verify_request_RESERVED = new Uint8(3)
   static new_session_ticket = new Uint8(4)                        //*Ticket Establishment
   static end_of_early_data = new Uint8(5)                         //*Updating Keys
   static hello_retry_request_RESERVED = new Uint8(6)
   static encrypted_extensions = new Uint8(8)                      //*Server Parameters Messages
   static certificate = new Uint8(11)                              //*Authentication Messages
   static server_key_exchange_RESERVED = new Uint8(12)
   static certificate_request = new Uint8(13)                      //*Server Parameters Messages
   static server_hello_done_RESERVED = new Uint8(14)
   static certificate_verify = new Uint8(15)                       //*Authentication Messages
   static client_key_exchange_RESERVED = new Uint8(16)
   static finished = new Uint8(20)                                 //*Authentication Messages
   static certificate_url_RESERVED = new Uint8(21)
   static certificate_status_RESERVED = new Uint8(22)
   static supplemental_data_RESERVED = new Uint8(23)
   static key_update = new Uint8(24)                               //*Updating Keys
   static message_hash = new Uint8(254)
   static Max = new Uint8(255)
}

export class Handshake extends Struct {
   type = ContentType.Handshake
   constructor(handshakeMsg) {
      const length = new Uint24(handshakeMsg.length);
      super(
         handshakeMsg.type,
         length, //*uint24 
         handshakeMsg
      )
   }
}