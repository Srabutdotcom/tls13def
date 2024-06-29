/**
 * !SECTION B.2.  Alert Messages
 * LINK - static https=//datatracker.ietf.org/doc/html/rfc8446#appendix-B.2
 * *DONE - verified
 */
import { Struct, Uint8 } from "./base.js"

export class AlertLevel {
   static Warning = new Uint8(1)
   static Fatal = new Uint8(2)
   static Max = new Uint8(255)
}

export class AlertDescription {
   static close_notify= new Uint8(0)
   static unexpected_message= new Uint8(10)
   static bad_record_mac= new Uint8(20)
   static decryption_failed_RESERVED= new Uint8(21)
   static record_overflow= new Uint8(22)
   static decompression_failure_RESERVED= new Uint8(30)
   static handshake_failure= new Uint8(40)
   static no_certificate_RESERVED= new Uint8(41)
   static bad_certificate= new Uint8(42)
   static unsupported_certificate= new Uint8(43)
   static certificate_revoked= new Uint8(44)
   static certificate_expired= new Uint8(45)
   static certificate_unknown= new Uint8(46)
   static illegal_parameter= new Uint8(47)
   static unknown_ca= new Uint8(48)
   static access_denied= new Uint8(49)
   static decode_error= new Uint8(50)
   static decrypt_error= new Uint8(51)
   static export_restriction_RESERVED= new Uint8(60)
   static protocol_version= new Uint8(70)
   static insufficient_security= new Uint8(71)
   static internal_error= new Uint8(80)
   static inappropriate_fallback= new Uint8(86)
   static user_canceled= new Uint8(90)
   static no_renegotiation_RESERVED= new Uint8(100)
   static missing_extension= new Uint8(109)
   static unsupported_extension= new Uint8(110)
   static certificate_unobtainable_RESERVED= new Uint8(111)
   static unrecognized_name= new Uint8(112)
   static bad_certificate_status_response= new Uint8(113)
   static bad_certificate_hash_value_RESERVED= new Uint8(114)
   static unknown_psk_identity= new Uint8(115)
   static certificate_required= new Uint8(116)
   static no_application_protocol= new Uint8(120)
   static Max = new Uint8(255)
}

export class Alert extends Struct {
   constructor(level, description) {
      super(level, description)
   }
}
