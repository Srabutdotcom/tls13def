/**
 * !SECTION B.1.  Record Layer
 * LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.1
 * *DONE - verified
 */
import { Struct, Uint16, Uint8 } from "./base.js"
import { protocolVersion } from './keyxmsg.js'

class ContentType {
   static Invalid = new Uint8(0);
   static ChangeCipherSpec = new Uint8(20)
   static Alert = new Uint8(21)
   static Handshake = new Uint8(22)
   static Application = new Uint8(23)
   static Heartbeat = new Uint8(24) /* RFC 6520 */
   static Max = new Uint8(255)
}

class TLSPlaintext extends Struct {
   constructor(fragment) {
      const length = new Uint16(fragment.length)
      super(
         fragment.type,
         protocolVersion, //*uint16
         length, //*uint16
         fragment
      )
   }
}

class TLSInnerPlaintext extends Struct {
   constructor(content, contentType, zeros) {
      const args = [content, contentType]
      if (zeros && zeros.length) args.push(zeros)
      super(...args)
   }
}

class TLSCiphertext extends Struct {
   constructor(encryptedRecord) {
      const length = new Uint16(encryptedRecord.length);
      super(
         ContentType.Application, /* 23 */
         protocolVersion, /* TLS v1.2 */
         length, //*uint16
         encryptedRecord
      )
   }
}

export class ChangeCipherSpec extends Struct {
   constructor(){
      const length = new Uint16(1);
      super(
         ContentType.ChangeCipherSpec,
         protocolVersion,
         length,
         new Uint8(1)
      )
   }
}

export { ContentType, TLSPlaintext, TLSInnerPlaintext, TLSCiphertext }