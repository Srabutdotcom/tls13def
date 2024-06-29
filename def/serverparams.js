/**!SECTION
 * !B.3.2.  Server Parameters Messages
 * LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.2
 * *DONE - verified
 */

import { Struct, VariableVector } from "./base.js";
import { HandshakeType } from "./handshake.js";

export class DistinguishedName extends VariableVector {
   constructor(list) {
      super(list, 1, 2 ** 16 - 1)//<1..2^16-1>
   }
}

export class CertificateAuthoritiesExtension extends Struct {
   constructor(authorities) {
      const DistinguishedName = new VariableVector(authorities, 3, 2 ** 16 - 1);
      super(DistinguishedName)
   }
}

export class OIDFilter extends Struct {
   constructor(certificate_extension_oid, certificate_extension_values) {
      const certExtOidVector = new VariableVector(certificate_extension_oid, 1, 2 ** 8 - 1);
      const certExtValVector = new VariableVector(certificate_extension_values, 0, 2 ** 16 - 1)
      super(
         certExtOidVector,
         certExtValVector
      )
   }
}

export class OIDFilterExtension extends Struct {
   constructor(filters) {
      const OIDFilter = new VariableVector(filters, 0, 2 ** 16 - 1);
      super(OIDFilter)
   }
}

export class PostHandshakeAuth extends Struct {
   constructor() {
      super()
   }
}

export class EncryptedExtensions extends Struct {
   type = HandshakeType.encrypted_extensions
   constructor(extensions) {
      const extension = new VariableVector(extensions, 0, 2 ** 16 - 1);
      super(extension)
   }
}

export class CertificateRequest extends Struct {
   type = HandshakeType.certificate_request
   constructor(certificate_request_context, extensions) {
      const certReqCtxVector = new VariableVector(certificate_request_context, 0, 2 ** 8 - 1)
      const extension = new VariableVector(extensions, 2, 2 ** 16 - 1);
      super(
         certReqCtxVector,
         extension
      )
   }
}