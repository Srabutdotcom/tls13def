/**
 * !SECTION B.3.3.  Authentication Messages
 * LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.3
 * *DONE - verified
 */
import { mergeUint8 } from '../tools/tools.js'
import { Struct, VariableVector, Uint8, Uint16 } from './base.js'
import { HandshakeType } from './handshake.js'

class CertificateType {
   static X509 = new Uint8(0)
   static OpenPGP = new Uint8(1)
   static RawPublicKey = new Uint8(2) /* From RFC 7250 ASN.1_subjectPublicKeyInfo */
   static Max = new Uint8(255)
}

class CertificateEntry extends Struct {
   constructor(certificate, extensions = new Uint16(0)) {
      //if ((certificate instanceof Certificate) == false) throw TypeError(`argument 1 must be instanceof Certificate`)
      const certVector = new VariableVector(certificate, 1, 2 ** 24 - 1)
      const extension = new VariableVector(extensions, 0, 2 ** 16 - 1)
      super(
         certVector,
         extension
      )
   }
}

class Certificate extends Struct {
   type = HandshakeType.certificate
   constructor(certificate_list, certificate_request_context = new Uint8(0)) {
      const certReqCtxVector = new VariableVector(certificate_request_context, 0, 2 ** 8 - 1);
      const certificateEntry = new VariableVector(certificate_list, 0, 2 ** 24 - 1)
      super(
         certReqCtxVector,
         certificateEntry
      )
   }
}

export class CertificateList extends VariableVector {
   constructor(...certs){
      super(mergeUint8(...certs), 0, 2 ** 24 - 1)
   }
}

class CertificateVerify extends Struct {
   type = HandshakeType.certificate_verify
   constructor(algorithm, signature) {
      const SignatureScheme = algorithm;
      const signatureVector = new VariableVector(signature, 0, 2 ** 16 - 1)
      super(
         SignatureScheme,
         signatureVector
      )
   }
}

class Finished extends Struct {
   type = HandshakeType.finished
   constructor(verifyData) {
      super(verifyData)
   }
}

export { CertificateType, CertificateEntry, Certificate, CertificateVerify, Finished }