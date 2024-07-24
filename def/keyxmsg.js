/**
 * !SECTION B.3.1.  Key Exchange Messages
 * LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.1
 */
import { mergeUint8, enc, getUint16 } from '../tools/tools.js';
import { FixedVector, Struct, Uint16, Uint8, Uint32, VariableVector } from './base.js'
import { HandshakeType } from './handshake.js'

class ProtocolVersion extends Uint8Array {
   constructor(version = 3) {
      super([3, version]) // legacy_record_version
   }
}

export class Random extends FixedVector {
   constructor() {
      const rnd32 = crypto.getRandomValues(new Uint8Array(32));
      super(rnd32, 32)
   }
}
//const rnd = new Random();//!Test

export const protocolVersion = new ProtocolVersion

export class CipherSuite extends Uint8Array {
   constructor(a = 0x13, b = 0x01) { // default to [0x13, 0x01]-'TLS_AES_128_GCM_SHA256'
      if (a !== 0x13) throw TypeError(`Unsupported cipher`)
      if ([0x01, 0x02].includes(b) == false) throw TypeError(`Unsupported cipher`)
      super([a, b])
   }
   toString() {
      if (this.at(1) == 0x01) return 'TLS_AES_128_GCM_SHA256'
      if (this.at(1) == 0x02) return 'TLS_AES_256_GCM_SHA384'
   }
}
//const cipherSuite = new CipherSuite()//!Test

export const ciphers = [new CipherSuite(0x13, 0x01), new CipherSuite(0x13, 0x02)]

export class CipherSuites extends VariableVector {
   constructor() {
      const uint8s = mergeUint8(...ciphers);
      super(uint8s, 2, 65534)// <2..2^16-2>
      this.ciphers = ciphers
   }
}
//const cipherSuites = new CipherSuites//!Test

export class SessionId extends VariableVector {
   constructor() {
      const uuid = crypto.randomUUID().replaceAll('-', '')
      const sessionId = new Uint8Array(Array.from(uuid, e => e.charCodeAt(0)));
      super(sessionId, 0, 32)
   }
}
//const legacy_session_id = new SessionId;//!Test

export class Compression extends VariableVector {
   constructor() {
      super(new Uint8(0), 1, 255)
   }
}
export const compression = new Compression;

//* the extension below are for tls1.3 only as mentioned in rfc 8446 and iana
//* https://datatracker.ietf.org/doc/html/rfc8446#section-11
//* https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml
export class ExtensionType {// FIXED it should be 2 bytes length instead of 1 bytes.
   static server_name = new Uint16(0)                             /* RFC 6066 */
   static max_fragment_length = new Uint16(1)                     /* RFC 6066 */
   static status_request = new Uint16(5)                          /* RFC 6066 */
   static supported_groups = new Uint16(10)                       /* RFC 8422, 7919 */
   static signature_algorithms = new Uint16(13)                   /* RFC 8446 */
   static use_srtp = new Uint16(14)                               /* RFC 5764 */
   static heartbeat = new Uint16(15)                              /* RFC 6520 */
   static application_layer_protocol_negotiation = new Uint16(16) /* RFC 7301 */
   static signed_certificate_timestamp = new Uint16(18)           /* RFC 6962 */
   static client_certificate_type = new Uint16(19)                /* RFC 7250 */
   static server_certificate_type = new Uint16(20)                /* RFC 7250 */
   static padding = new Uint16(21)                                /* RFC 7685 */
   static session_ticket = new Uint16(35)                         /* [RFC5077][RFC8447] */
   static pre_shared_key = new Uint16(41)                         /* RFC 8446 */
   static early_data = new Uint16(42)                             /* RFC 8446 */
   static supported_versions = new Uint16(43)                     /* RFC 8446 */
   static cookie = new Uint16(44)                                 /* RFC 8446 */
   static psk_key_exchange_modes = new Uint16(45)                 /* RFC 8446 */
   static RESERVED = new Uint16(46)                               /* Used but never assigned */
   static certificate_authorities = new Uint16(47)                /* RFC 8446 */
   static oid_filters = new Uint16(48)                            /* RFC 8446 */
   static post_handshake_auth = new Uint16(49)                    /* RFC 8446 */
   static signature_algorithms_cert = new Uint16(50)              /* RFC 8446 */
   static key_share = new Uint16(51)                              /* RFC 8446 */
   static Max = new Uint16(65535)
}

export class Extension extends Struct {
   constructor(extensionType, extension_data) {
      const extDataVector = new VariableVector(extension_data, 0, 2 ** 16 - 1)
      super(extensionType, extDataVector)
   }
}

export class ClientHello extends Struct {
   type = HandshakeType.client_hello;
   /**
    * 
    * @param {string} SNI 
    */
   constructor(SNI, keyShareEntries) {
      const random = new Random;
      const sessionId = new SessionId;
      const compression = new Compression;
      const cipherSuites = new CipherSuites
      const extensions = [
         new Extension(ExtensionType.server_name, new ServerNameList(new ServerName(SNI))),
         new Extension(ExtensionType.supported_groups, new NamedGroupList),
         new Extension(ExtensionType.signature_algorithms, new SignatureSchemeList),
         new Extension(ExtensionType.supported_versions, new SupportedVersions('client')),
         new Extension(ExtensionType.psk_key_exchange_modes, new PskKeyExchangeModes),
         new Extension(ExtensionType.key_share, new KeyShareClientHello(keyShareEntries)),
      ]

      const ExtensionVector = new VariableVector(mergeUint8(...extensions), 8, 2 ** 16 - 1);

      super(
         protocolVersion,
         random,
         sessionId,
         cipherSuites,
         compression,
         ExtensionVector
      )

   }
}

export class ServerHello extends Struct {
   type = HandshakeType.server_hello;
   constructor(sessionId, cipherSuites, keyShareEntry) {
      const random = new Random;
      const session_id = new VariableVector(sessionId,0, 32)
      const compression = new Uint8(0);
      const cipherSuite = new Uint16(cipherSuites.find(e => ciphers.map(f => getUint16(f)==e)))
      const extensions = [
         new Extension(ExtensionType.supported_versions, new SupportedVersions()),
         new Extension(ExtensionType.key_share, new KeyShareServerHello(keyShareEntry)),
      ]

      const ExtensionVector = new VariableVector(mergeUint8(...extensions), 8, 2 ** 16 - 1);

      super(
         protocolVersion,
         random,
         session_id,
         cipherSuite,
         compression,
         ExtensionVector
      )
      this.random = random;
      this.session_id = session_id;
      this.compression = compression;
      this.cipherSuite = cipherSuite;
      this.extensions = extensions;
   }
}

/**
 * ! 3.  Server Name Indication
 * LINK - https://datatracker.ietf.org/doc/html/rfc6066#section-3
 */
export class ServerName extends Struct {
   constructor(hostname) {
      const hostnameUint8 = typeof (hostname) == 'string' ? enc.encode(hostname) : hostname
      const NameType = new Uint8(0)
      const hostnames = new VariableVector(hostnameUint8, 1, 65535);//<1..2^16-1>
      super(NameType, hostnames)
   }
}

export class ServerNameList extends Struct {
   constructor(server_name_list) {
      const ServerNameVector = new VariableVector(server_name_list, 1, 2 ** 16 - 1)
      super(ServerNameVector)
   }
}

//const sni = new ServerName('localhost')//! Test

/**
 * ! 5.1.2.  Supported Point Formats Extension
 * ! Not used in tls 1.3
 * LINK - https://datatracker.ietf.org/doc/html/rfc8422#section-5.1.2
 */

export const ECPointFormat = {
   uncompressed: new Uint8(0),
   deprecated: new Uint8(1),
   deprecated2: new Uint8(2),
   Max: new Uint8(255)
}

export class ECPointFormatList extends Struct {
   constructor() {
      const ec_point_format_list = new VariableVector(ECPointFormat.uncompressed, 1, 255)
      super(ec_point_format_list)
   }
}

export class KeyShareEntry extends Struct {
   constructor(group, key_exchange) {
      const namedGroup = group;
      const key_exchangeVector = new VariableVector(key_exchange, 1, 2 ** 16 - 1)
      super(namedGroup, key_exchangeVector)
   }
}

export class KeyShareClientHello extends Struct {
   constructor(clientShares) { // keyShareEntries
      const KeyShareEntry = new VariableVector(clientShares, 0, 2 ** 16 - 1);
      super(KeyShareEntry)
   }
}

export class KeyShareHelloRetryRequest extends Struct {
   constructor(selected_group) {
      const namedGroup = selected_group
      super(namedGroup)
   }
}

export class KeyShareServerHello extends Struct {
   constructor(server_share) {
      const keyShareEntry = server_share;
      super(keyShareEntry)
   }
}

export class UncompressedPointRepresentation extends Struct {
   constructor(x, y) {
      const legacy_form = new Uint8(4)
      super(legacy_form, x, y)
   }
}

export class PskKeyExchangeMode {
   static psk_ke = new Uint8(0)
   static psk_dhe_ke = new Uint8(1)
   static Max = new Uint8(255)
}

export class PskKeyExchangeModes extends Struct {
   /**
    * LINK https://datatracker.ietf.org/doc/html/rfc8446#section-4.2.9
    * psk_dhe_ke:  PSK with (EC)DHE key establishment.  In this mode, the
      client and server MUST supply "key_share" values as described in
      Section 4.2.8.
    */
   constructor(ke_modes = PskKeyExchangeMode.psk_dhe_ke) {
      const pskKeyExchangeMode = new VariableVector(ke_modes, 1, 255);
      super(pskKeyExchangeMode)
   }
}

export class Empty extends Struct {
   constructor() {
      super()
   }
}

export class EarlyDataIndication extends Struct {
   constructor(handshakeType, max_early_data_size) {
      if (handshakeType instanceof HandshakeType.new_session_ticket) {
         super(new Uint32(max_early_data_size))
      } else if (handshakeType instanceof HandshakeType.client_hello || handshakeType instanceof HandshakeType.encrypted_extensions) {
         super()
      }
   }
}

export class PskIdentity extends Struct {
   constructor(identity, obfuscated_ticket_age) {
      const identityVector = new VariableVector(identity, 1, 2 ** 16 - 1);
      super(identityVector, new Uint32(obfuscated_ticket_age))
   }
}

export class PskBinderEntry extends VariableVector {
   constructor(pskBinderEntry) {
      super(pskBinderEntry, 32, 255)
   }
}

export class OfferedPsks extends Struct {
   constructor(identities, binders) {
      const pskIdentity = new VariableVector(identities, 7, 2 ** 16 - 1)
      const pskBinderEntry = new VariableVector(binders, 33, 2 ** 16 - 1)
      super(pskIdentity, pskBinderEntry)
   }
}

export class PreSharedKeyExtension extends Struct {
   constructor(handshakeType, value) {
      if (handshakeType instanceof HandshakeType.client_hello) {
         if (value instanceof OfferedPsks == false) throw TypeError(`expected value is instanceof OfferedPsks`)
         const offeredPsks = value
         super(offeredPsks)
      } else if (handshakeType instanceof HandshakeType.server_hello) {
         const selected_identity = new Uint16(value)
         super(selected_identity)
      }
   }
}

//LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.1.1
export class SupportedVersions extends Struct {
   constructor(client) {
      const tls13 = new ProtocolVersion(4);
      const versions = client ? new VariableVector(tls13, 2, 254) : tls13
      super(versions)
   }
}

// LINK https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.1.2
export class Cookie extends Struct {
   constructor(cookie) {
      const cookieVector = new VariableVector(cookie, 1, 2 ** 16 - 1)
      super(cookieVector)
   }
}

/**
 * !B.3.1.3.  Signature Algorithm Extension
 * LINK https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.1.3
 */
export class SignatureScheme {
   /* RSASSA-PKCS1-v1_5 algorithms */
   /* rsa_pkcs1_sha256(0x0401),
   rsa_pkcs1_sha384(0x0501),
   rsa_pkcs1_sha512(0x0601), */

   /* ECDSA algorithms */
   static ecdsa_secp256r1_sha256 = new Uint8Array([0x04, 0x03])
   static ecdsa_secp384r1_sha384 = new Uint8Array([0x05, 0x03])
   static ecdsa_secp521r1_sha512 = new Uint8Array([0x06, 0x03])

   /* RSASSA-PSS algorithms with public key OID rsaEncryption */
   static rsa_pss_rsae_sha256 = new Uint8Array([0x08, 0x04])
   static rsa_pss_rsae_sha384 = new Uint8Array([0x08, 0x05])
   static rsa_pss_rsae_sha512 = new Uint8Array([0x08, 0x06])

   /* EdDSA algorithms */
   /* ed25519(0x0807),
   ed448(0x0808), */

   /* RSASSA-PSS algorithms with public key OID RSASSA-PSS */
   static rsa_pss_pss_sha256 = new Uint8Array([0x08, 0x09])
   static rsa_pss_pss_sha384 = new Uint8Array([0x08, 0x0a])
   static rsa_pss_pss_sha512 = new Uint8Array([0x08, 0x0b])

   /* Legacy algorithms */
   /* rsa_pkcs1_sha1(0x0201),
   ecdsa_sha1(0x0203), */

   /* Reserved Code Points */
   /* obsolete_RESERVED(0x0000..0x0200),
   dsa_sha1_RESERVED(0x0202),
   obsolete_RESERVED(0x0204..0x0400),
   dsa_sha256_RESERVED(0x0402),
   obsolete_RESERVED(0x0404..0x0500),
   dsa_sha384_RESERVED(0x0502),
   obsolete_RESERVED(0x0504..0x0600),
   dsa_sha512_RESERVED(0x0602),
   obsolete_RESERVED(0x0604..0x06FF),
   private_use(0xFE00..0xFFFF), */
   static Max = new Uint8Array([0xFF, 0xFF])
};

export class SignatureSchemeList extends Struct {
   constructor() {
      const supported_signature_algorithms = mergeUint8(
         SignatureScheme.ecdsa_secp256r1_sha256,
         SignatureScheme.ecdsa_secp384r1_sha384,
         SignatureScheme.ecdsa_secp521r1_sha512,
         SignatureScheme.rsa_pss_rsae_sha256,
         SignatureScheme.rsa_pss_rsae_sha384,
         SignatureScheme.rsa_pss_rsae_sha512,
         SignatureScheme.rsa_pss_pss_sha256,
         SignatureScheme.rsa_pss_pss_sha384,
         SignatureScheme.rsa_pss_pss_sha512
      )
      const signatureScheme = new VariableVector(supported_signature_algorithms, 2, 65534)// <2..2^16-2>
      super(signatureScheme)
   }
}

/**
 * !B.3.1.4.  Supported Groups Extension
 * LINK - https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3.1.4
 */
export class NamedGroup {
   /* unallocated_RESERVED(0x0000), */

   /* Elliptic Curve Groups (ECDHE) */
   //obsolete_RESERVED(0x0001..0x0016),
   static secp256r1 = new Uint8Array([0x00, 0x17])
   static secp384r1 = new Uint8Array([0x00, 0x18])
   static secp521r1 = new Uint8Array([0x00, 0x19])
   //obsolete_RESERVED(0x001A..0x001C),
   static x25519 = new Uint8Array([0x00, 0x1D])
   static x448 = new Uint8Array([0x00, 0x1E])

   /* Finite Field Groups (DHE) */
   static ffdhe2048 = new Uint8Array([0x01, 0x00])
   static ffdhe3072 = new Uint8Array([0x01, 0x01])
   static ffdhe4096 = new Uint8Array([0x01, 0x02])
   static ffdhe6144 = new Uint8Array([0x01, 0x03])
   static ffdhe8192 = new Uint8Array([0x01, 0x04])

   /* Reserved Code Points */
   /* ffdhe_private_use(0x01FC..0x01FF),
   ecdhe_private_use(0xFE00..0xFEFF),
   obsolete_RESERVED(0xFF01..0xFF02), */
   static Max = new Uint8Array([0xFF, 0xFF])
}

export class NamedGroupList extends Struct {
   constructor() {
      const named_group_list = [
         NamedGroup.secp256r1,
         NamedGroup.secp384r1,
         NamedGroup.secp521r1,
         NamedGroup.x25519
      ]
      const namedGroup = new VariableVector(
         mergeUint8(...named_group_list),
         2, 65534
      )
      super(namedGroup)
   }
}


