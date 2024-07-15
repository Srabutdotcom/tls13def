// tools/tools.js
var enc = new TextEncoder();
var dec = new TextDecoder();
function Uint8BE(_integer, _bytes) {
  const integer = ensureUint(_integer);
  const bytes = _bytes ?? maxBytes(integer);
  const upper = 2 ** (8 * bytes) - 1;
  if (integer > upper)
    return TypeError(`integer can't be more than ${upper} `);
  const uint8 = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    const index = bytes - 1 - i;
    const shiftAmount = index * 8;
    uint8[i] = integer >> shiftAmount & 255;
  }
  return uint8;
}
function Uint16BE(_int) {
  return Uint8BE(_int, 2);
}
function Uint24BE(_int) {
  return Uint8BE(_int, 3);
}
function Uint32BE(_int) {
  return Uint8BE(_int, 4);
}
function maxBytes(_integer) {
  const integer = ensureInteger(_integer);
  let b = 1;
  while (true) {
    if (2 ** (b * 8) > integer)
      return b;
    b++;
  }
}
function ensureInteger(integer) {
  const _integer = +Number(integer).toFixed(0);
  const pass = Number.isInteger(_integer);
  if (!pass)
    throw TypeError(`expected integer`);
  return _integer;
}
function ensureUint(integer) {
  const pass = ensureInteger(integer);
  if (pass < 0)
    throw TypeError(`expected positive integer`);
  return pass;
}
function mergeUint8(...arrays) {
  const totalLength = arrays.reduce((acc, arr) => acc + arr?.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr?.length;
  }
  return result;
}
function getUint8BE(data, pos = 0, length = 1) {
  if (!(data instanceof Uint8Array)) {
    throw new TypeError("Input data must be a byte array");
  }
  if (pos < 0 || pos >= data.length) {
    throw new TypeError("Position is out of bounds");
  }
  if (length < 1) {
    throw new TypeError("Length must be at least 1");
  }
  if (pos + length > data.length) {
    throw TypeError(`length is beyond data.length`);
  }
  let output = 0;
  for (let i = pos; i < pos + length; i++) {
    output = output << 8 | data[i];
  }
  return output;
}
function getUint16(data, pos) {
  return getUint8BE(data, pos, 2);
}

// def/base.js
var Struct = class extends Uint8Array {
  #struct;
  constructor(...array) {
    if (!array || !array.length) {
      super();
    } else if (array.some((e) => e instanceof Uint8Array == false)) {
      throw TypeError(`all arguments must be Uint8Array`);
    } else {
      super(mergeUint8(...array));
    }
    this.#struct = array;
  }
  struct() {
    return this.#struct;
  }
};
var FixedVector = class extends Uint8Array {
  constructor(uint8s, length) {
    if (uint8s instanceof Uint8Array == false)
      throw TypeError(`all arguments must be Uint8Array`);
    if (typeof length !== "number")
      throw TypeError(`argument 2 must be a number`);
    if (uint8s.length !== length)
      throw TypeError(`Expected value with length is ${length}`);
    super(uint8s.buffer);
  }
};
var VariableVector = class extends Uint8Array {
  #uint8s;
  constructor(uint8s, min, max) {
    if (uint8s instanceof Uint8Array == false)
      throw TypeError(`all arguments must be Uint8Array`);
    if (typeof min !== "number")
      throw TypeError(`argument 2 must be a number`);
    if (typeof max !== "number")
      throw TypeError(`argument 3 must be a number`);
    if (uint8s.length < min)
      throw TypeError(`value should have a min length of ${min}`);
    if (uint8s.length > max)
      throw TypeError(`value should have a max length of ${max}`);
    const length = Uint8BE(uint8s.length, maxBytes(max));
    super(mergeUint8(length, uint8s));
    this.#uint8s = uint8s;
  }
  uint8s() {
    return this.#uint8s;
  }
};
var Zeros = class extends Uint8Array {
  constructor(length) {
    const buf = new ArrayBuffer(length);
    super(buf);
  }
};
var Uint8 = class extends Uint8Array {
  constructor(integer) {
    super(Uint8BE(integer, 1).buffer);
  }
};
var Uint16 = class extends Uint8Array {
  constructor(integer) {
    super(Uint16BE(integer).buffer);
  }
};
var Uint24 = class extends Uint8Array {
  constructor(integer) {
    super(Uint24BE(integer).buffer);
  }
};
var Uint32 = class extends Uint8Array {
  constructor(integer) {
    super(Uint32BE(integer).buffer);
  }
};

// def/alertmsg.js
var AlertLevel = class {
  static Warning = new Uint8(1);
  static Fatal = new Uint8(2);
  static Max = new Uint8(255);
};
var AlertDescription = class {
  static close_notify = new Uint8(0);
  static unexpected_message = new Uint8(10);
  static bad_record_mac = new Uint8(20);
  static decryption_failed_RESERVED = new Uint8(21);
  static record_overflow = new Uint8(22);
  static decompression_failure_RESERVED = new Uint8(30);
  static handshake_failure = new Uint8(40);
  static no_certificate_RESERVED = new Uint8(41);
  static bad_certificate = new Uint8(42);
  static unsupported_certificate = new Uint8(43);
  static certificate_revoked = new Uint8(44);
  static certificate_expired = new Uint8(45);
  static certificate_unknown = new Uint8(46);
  static illegal_parameter = new Uint8(47);
  static unknown_ca = new Uint8(48);
  static access_denied = new Uint8(49);
  static decode_error = new Uint8(50);
  static decrypt_error = new Uint8(51);
  static export_restriction_RESERVED = new Uint8(60);
  static protocol_version = new Uint8(70);
  static insufficient_security = new Uint8(71);
  static internal_error = new Uint8(80);
  static inappropriate_fallback = new Uint8(86);
  static user_canceled = new Uint8(90);
  static no_renegotiation_RESERVED = new Uint8(100);
  static missing_extension = new Uint8(109);
  static unsupported_extension = new Uint8(110);
  static certificate_unobtainable_RESERVED = new Uint8(111);
  static unrecognized_name = new Uint8(112);
  static bad_certificate_status_response = new Uint8(113);
  static bad_certificate_hash_value_RESERVED = new Uint8(114);
  static unknown_psk_identity = new Uint8(115);
  static certificate_required = new Uint8(116);
  static no_application_protocol = new Uint8(120);
  static Max = new Uint8(255);
};
var Alert = class extends Struct {
  constructor(level, description) {
    super(level, description);
  }
};

// def/keyxmsg.js
var ProtocolVersion = class extends Uint8Array {
  constructor(version = 3) {
    super([3, version]);
  }
};
var Random = class extends FixedVector {
  constructor() {
    const rnd32 = crypto.getRandomValues(new Uint8Array(32));
    super(rnd32, 32);
  }
};
var protocolVersion = new ProtocolVersion();
var CipherSuite = class extends Uint8Array {
  constructor(a = 19, b = 1) {
    if (a !== 19)
      throw TypeError(`Unsupported cipher`);
    if ([1, 2].includes(b) == false)
      throw TypeError(`Unsupported cipher`);
    super([a, b]);
  }
  toString() {
    if (this.at(1) == 1)
      return "TLS_AES_128_GCM_SHA256";
    if (this.at(1) == 2)
      return "TLS_AES_256_GCM_SHA384";
  }
};
var ciphers = [new CipherSuite(19, 1), new CipherSuite(19, 2)];
var CipherSuites = class extends VariableVector {
  constructor() {
    const uint8s = mergeUint8(...ciphers);
    super(uint8s, 2, 65534);
    this.ciphers = ciphers;
  }
};
var SessionId = class extends VariableVector {
  constructor() {
    const uuid = crypto.randomUUID().replaceAll("-", "");
    const sessionId = new Uint8Array(Array.from(uuid, (e) => e.charCodeAt(0)));
    super(sessionId, 0, 32);
  }
};
var Compression = class extends VariableVector {
  constructor() {
    super(new Uint8(0), 1, 255);
  }
};
var compression = new Compression();
var ExtensionType = class {
  // FIXED it should be 2 bytes length instead of 1 bytes.
  static server_name = new Uint16(0);
  /* RFC 6066 */
  static max_fragment_length = new Uint16(1);
  /* RFC 6066 */
  static status_request = new Uint16(5);
  /* RFC 6066 */
  static supported_groups = new Uint16(10);
  /* RFC 8422, 7919 */
  static signature_algorithms = new Uint16(13);
  /* RFC 8446 */
  static use_srtp = new Uint16(14);
  /* RFC 5764 */
  static heartbeat = new Uint16(15);
  /* RFC 6520 */
  static application_layer_protocol_negotiation = new Uint16(16);
  /* RFC 7301 */
  static signed_certificate_timestamp = new Uint16(18);
  /* RFC 6962 */
  static client_certificate_type = new Uint16(19);
  /* RFC 7250 */
  static server_certificate_type = new Uint16(20);
  /* RFC 7250 */
  static padding = new Uint16(21);
  /* RFC 7685 */
  static session_ticket = new Uint16(35);
  /* [RFC5077][RFC8447] */
  static pre_shared_key = new Uint16(41);
  /* RFC 8446 */
  static early_data = new Uint16(42);
  /* RFC 8446 */
  static supported_versions = new Uint16(43);
  /* RFC 8446 */
  static cookie = new Uint16(44);
  /* RFC 8446 */
  static psk_key_exchange_modes = new Uint16(45);
  /* RFC 8446 */
  static RESERVED = new Uint16(46);
  /* Used but never assigned */
  static certificate_authorities = new Uint16(47);
  /* RFC 8446 */
  static oid_filters = new Uint16(48);
  /* RFC 8446 */
  static post_handshake_auth = new Uint16(49);
  /* RFC 8446 */
  static signature_algorithms_cert = new Uint16(50);
  /* RFC 8446 */
  static key_share = new Uint16(51);
  /* RFC 8446 */
  static Max = new Uint16(65535);
};
var Extension = class extends Struct {
  constructor(extensionType, extension_data) {
    const extDataVector = new VariableVector(extension_data, 0, 2 ** 16 - 1);
    super(extensionType, extDataVector);
  }
};
var ClientHello = class extends Struct {
  type = HandshakeType.client_hello;
  /**
   * 
   * @param {string} SNI 
   */
  constructor(SNI, keyShareEntries) {
    const random = new Random();
    const sessionId = new SessionId();
    const compression2 = new Compression();
    const cipherSuites = new CipherSuites();
    const extensions = [
      new Extension(ExtensionType.server_name, new ServerNameList(new ServerName(SNI))),
      new Extension(ExtensionType.supported_groups, new NamedGroupList()),
      new Extension(ExtensionType.signature_algorithms, new SignatureSchemeList()),
      new Extension(ExtensionType.supported_versions, new SupportedVersions("client")),
      new Extension(ExtensionType.psk_key_exchange_modes, new PskKeyExchangeModes()),
      new Extension(ExtensionType.key_share, new KeyShareClientHello(keyShareEntries))
    ];
    const ExtensionVector = new VariableVector(mergeUint8(...extensions), 8, 2 ** 16 - 1);
    super(
      protocolVersion,
      random,
      sessionId,
      cipherSuites,
      compression2,
      ExtensionVector
    );
  }
};
var ServerHello = class extends Struct {
  type = HandshakeType.server_hello;
  constructor(sessionId, cipherSuites, keyShareEntry) {
    const random = new Random();
    const session_id = new VariableVector(sessionId, 0, 32);
    const compression2 = new Uint8(0);
    const cipherSuite = new Uint16(cipherSuites.find((e) => ciphers.map((f) => getUint16(f) == e)));
    const extensions = [
      new Extension(ExtensionType.supported_versions, new SupportedVersions()),
      new Extension(ExtensionType.key_share, new KeyShareServerHello(keyShareEntry))
    ];
    const ExtensionVector = new VariableVector(mergeUint8(...extensions), 8, 2 ** 16 - 1);
    super(
      protocolVersion,
      random,
      session_id,
      cipherSuite,
      compression2,
      ExtensionVector
    );
  }
};
var ServerName = class extends Struct {
  constructor(hostname) {
    const hostnameUint8 = typeof hostname == "string" ? enc.encode(hostname) : hostname;
    const NameType = new Uint8(0);
    const hostnames = new VariableVector(hostnameUint8, 1, 65535);
    super(NameType, hostnames);
  }
};
var ServerNameList = class extends Struct {
  constructor(server_name_list) {
    const ServerNameVector = new VariableVector(server_name_list, 1, 2 ** 16 - 1);
    super(ServerNameVector);
  }
};
var ECPointFormat = {
  uncompressed: new Uint8(0),
  deprecated: new Uint8(1),
  deprecated2: new Uint8(2),
  Max: new Uint8(255)
};
var ECPointFormatList = class extends Struct {
  constructor() {
    const ec_point_format_list = new VariableVector(ECPointFormat.uncompressed, 1, 255);
    super(ec_point_format_list);
  }
};
var KeyShareEntry = class extends Struct {
  constructor(group, key_exchange) {
    const namedGroup = group;
    const key_exchangeVector = new VariableVector(key_exchange, 1, 2 ** 16 - 1);
    super(namedGroup, key_exchangeVector);
  }
};
var KeyShareClientHello = class extends Struct {
  constructor(clientShares) {
    const KeyShareEntry2 = new VariableVector(clientShares, 0, 2 ** 16 - 1);
    super(KeyShareEntry2);
  }
};
var KeyShareHelloRetryRequest = class extends Struct {
  constructor(selected_group) {
    const namedGroup = selected_group;
    super(namedGroup);
  }
};
var KeyShareServerHello = class extends Struct {
  constructor(server_share) {
    const keyShareEntry = server_share;
    super(keyShareEntry);
  }
};
var UncompressedPointRepresentation = class extends Struct {
  constructor(x, y) {
    const legacy_form = new Uint8(4);
    super(legacy_form, x, y);
  }
};
var PskKeyExchangeMode = class {
  static psk_ke = new Uint8(0);
  static psk_dhe_ke = new Uint8(1);
  static Max = new Uint8(255);
};
var PskKeyExchangeModes = class extends Struct {
  /**
   * LINK https://datatracker.ietf.org/doc/html/rfc8446#section-4.2.9
   * psk_dhe_ke:  PSK with (EC)DHE key establishment.  In this mode, the
     client and server MUST supply "key_share" values as described in
     Section 4.2.8.
   */
  constructor(ke_modes = PskKeyExchangeMode.psk_dhe_ke) {
    const pskKeyExchangeMode = new VariableVector(ke_modes, 1, 255);
    super(pskKeyExchangeMode);
  }
};
var Empty = class extends Struct {
  constructor() {
    super();
  }
};
var EarlyDataIndication = class extends Struct {
  constructor(handshakeType, max_early_data_size) {
    if (handshakeType instanceof HandshakeType.new_session_ticket) {
      super(new Uint32(max_early_data_size));
    } else if (handshakeType instanceof HandshakeType.client_hello || handshakeType instanceof HandshakeType.encrypted_extensions) {
      super();
    }
  }
};
var PskIdentity = class extends Struct {
  constructor(identity, obfuscated_ticket_age) {
    const identityVector = new VariableVector(identity, 1, 2 ** 16 - 1);
    super(identityVector, new Uint32(obfuscated_ticket_age));
  }
};
var PskBinderEntry = class extends VariableVector {
  constructor(pskBinderEntry) {
    super(pskBinderEntry, 32, 255);
  }
};
var OfferedPsks = class extends Struct {
  constructor(identities, binders) {
    const pskIdentity = new VariableVector(identities, 7, 2 ** 16 - 1);
    const pskBinderEntry = new VariableVector(binders, 33, 2 ** 16 - 1);
    super(pskIdentity, pskBinderEntry);
  }
};
var PreSharedKeyExtension = class extends Struct {
  constructor(handshakeType, value) {
    if (handshakeType instanceof HandshakeType.client_hello) {
      if (value instanceof OfferedPsks == false)
        throw TypeError(`expected value is instanceof OfferedPsks`);
      const offeredPsks = value;
      super(offeredPsks);
    } else if (handshakeType instanceof HandshakeType.server_hello) {
      const selected_identity = new Uint16(value);
      super(selected_identity);
    }
  }
};
var SupportedVersions = class extends Struct {
  constructor(client) {
    const tls13 = new ProtocolVersion(4);
    const versions = client ? new VariableVector(tls13, 2, 254) : tls13;
    super(versions);
  }
};
var Cookie = class extends Struct {
  constructor(cookie) {
    const cookieVector = new VariableVector(cookie, 1, 2 ** 16 - 1);
    super(cookieVector);
  }
};
var SignatureScheme = class {
  /* RSASSA-PKCS1-v1_5 algorithms */
  /* rsa_pkcs1_sha256(0x0401),
  rsa_pkcs1_sha384(0x0501),
  rsa_pkcs1_sha512(0x0601), */
  /* ECDSA algorithms */
  static ecdsa_secp256r1_sha256 = new Uint8Array([4, 3]);
  static ecdsa_secp384r1_sha384 = new Uint8Array([5, 3]);
  static ecdsa_secp521r1_sha512 = new Uint8Array([6, 3]);
  /* RSASSA-PSS algorithms with public key OID rsaEncryption */
  static rsa_pss_rsae_sha256 = new Uint8Array([8, 4]);
  static rsa_pss_rsae_sha384 = new Uint8Array([8, 5]);
  static rsa_pss_rsae_sha512 = new Uint8Array([8, 6]);
  /* EdDSA algorithms */
  /* ed25519(0x0807),
  ed448(0x0808), */
  /* RSASSA-PSS algorithms with public key OID RSASSA-PSS */
  static rsa_pss_pss_sha256 = new Uint8Array([8, 9]);
  static rsa_pss_pss_sha384 = new Uint8Array([8, 10]);
  static rsa_pss_pss_sha512 = new Uint8Array([8, 11]);
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
  static Max = new Uint8Array([255, 255]);
};
var SignatureSchemeList = class extends Struct {
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
    );
    const signatureScheme = new VariableVector(supported_signature_algorithms, 2, 65534);
    super(signatureScheme);
  }
};
var NamedGroup = class {
  /* unallocated_RESERVED(0x0000), */
  /* Elliptic Curve Groups (ECDHE) */
  //obsolete_RESERVED(0x0001..0x0016),
  static secp256r1 = new Uint8Array([0, 23]);
  static secp384r1 = new Uint8Array([0, 24]);
  static secp521r1 = new Uint8Array([0, 25]);
  //obsolete_RESERVED(0x001A..0x001C),
  static x25519 = new Uint8Array([0, 29]);
  static x448 = new Uint8Array([0, 30]);
  /* Finite Field Groups (DHE) */
  static ffdhe2048 = new Uint8Array([1, 0]);
  static ffdhe3072 = new Uint8Array([1, 1]);
  static ffdhe4096 = new Uint8Array([1, 2]);
  static ffdhe6144 = new Uint8Array([1, 3]);
  static ffdhe8192 = new Uint8Array([1, 4]);
  /* Reserved Code Points */
  /* ffdhe_private_use(0x01FC..0x01FF),
  ecdhe_private_use(0xFE00..0xFEFF),
  obsolete_RESERVED(0xFF01..0xFF02), */
  static Max = new Uint8Array([255, 255]);
};
var NamedGroupList = class extends Struct {
  constructor() {
    const named_group_list = [
      NamedGroup.secp256r1,
      NamedGroup.secp384r1,
      NamedGroup.secp521r1,
      NamedGroup.x25519
    ];
    const namedGroup = new VariableVector(
      mergeUint8(...named_group_list),
      2,
      65534
    );
    super(namedGroup);
  }
};

// def/record.js
var ContentType = class {
  static Invalid = new Uint8(0);
  static ChangeCipherSpec = new Uint8(20);
  static Alert = new Uint8(21);
  static Handshake = new Uint8(22);
  static Application = new Uint8(23);
  static Heartbeat = new Uint8(24);
  /* RFC 6520 */
  static Max = new Uint8(255);
};
var TLSPlaintext = class extends Struct {
  constructor(fragment) {
    const length = new Uint16(fragment.length);
    super(
      fragment.type,
      protocolVersion,
      //*uint16
      length,
      //*uint16
      fragment
    );
  }
};
var TLSInnerPlaintext = class extends Struct {
  constructor(content, contentType, zeros) {
    const args = [content, contentType];
    if (zeros && zeros.length)
      args.push(zeros);
    super(...args);
  }
};
var TLSCiphertext = class extends Struct {
  constructor(encryptedRecord) {
    const length = new Uint16(encryptedRecord.length);
    super(
      ContentType.Application,
      /* 23 */
      protocolVersion,
      /* TLS v1.2 */
      length,
      //*uint16
      encryptedRecord
    );
  }
};
var ChangeCipherSpec = class extends Struct {
  constructor() {
    const length = new Uint16(1);
    super(
      ContentType.ChangeCipherSpec,
      protocolVersion,
      length,
      new Uint8(1)
    );
  }
};

// def/handshake.js
var HandshakeType = class {
  static hello_request_RESERVED = new Uint8(0);
  static client_hello = new Uint8(1);
  //*Key Exchange
  static server_hello = new Uint8(2);
  //*Key Exchange
  static hello_verify_request_RESERVED = new Uint8(3);
  static new_session_ticket = new Uint8(4);
  //*Ticket Establishment
  static end_of_early_data = new Uint8(5);
  //*Updating Keys
  static hello_retry_request_RESERVED = new Uint8(6);
  static encrypted_extensions = new Uint8(8);
  //*Server Parameters Messages
  static certificate = new Uint8(11);
  //*Authentication Messages
  static server_key_exchange_RESERVED = new Uint8(12);
  static certificate_request = new Uint8(13);
  //*Server Parameters Messages
  static server_hello_done_RESERVED = new Uint8(14);
  static certificate_verify = new Uint8(15);
  //*Authentication Messages
  static client_key_exchange_RESERVED = new Uint8(16);
  static finished = new Uint8(20);
  //*Authentication Messages
  static certificate_url_RESERVED = new Uint8(21);
  static certificate_status_RESERVED = new Uint8(22);
  static supplemental_data_RESERVED = new Uint8(23);
  static key_update = new Uint8(24);
  //*Updating Keys
  static message_hash = new Uint8(254);
  static Max = new Uint8(255);
};
var Handshake = class extends Struct {
  type = ContentType.Handshake;
  constructor(handshakeMsg) {
    const length = new Uint24(handshakeMsg.length);
    super(
      handshakeMsg.type,
      length,
      //*uint24 
      handshakeMsg
    );
  }
};

// def/authmsg.js
var CertificateType = class {
  static X509 = new Uint8(0);
  static OpenPGP = new Uint8(1);
  static RawPublicKey = new Uint8(2);
  /* From RFC 7250 ASN.1_subjectPublicKeyInfo */
  static Max = new Uint8(255);
};
var CertificateEntry = class extends Struct {
  constructor(certificate, extensions = new Uint16(0)) {
    const certVector = new VariableVector(certificate, 1, 2 ** 24 - 1);
    const extension = new VariableVector(extensions, 0, 2 ** 16 - 1);
    super(
      certVector,
      extension
    );
  }
};
var Certificate = class extends Struct {
  type = HandshakeType.certificate;
  constructor(certificate_list, certificate_request_context = new Uint8(0)) {
    const certReqCtxVector = new VariableVector(certificate_request_context, 0, 2 ** 8 - 1);
    const certificateEntry = new VariableVector(certificate_list, 0, 2 ** 24 - 1);
    super(
      certReqCtxVector,
      certificateEntry
    );
  }
};
var CertificateList = class extends VariableVector {
  constructor(...certs) {
    super(mergeUint8(...certs), 0, 2 ** 24 - 1);
  }
};
var CertificateVerify = class extends Struct {
  type = HandshakeType.certificate_verify;
  constructor(algorithm, signature) {
    const SignatureScheme2 = algorithm;
    const signatureVector = new VariableVector(signature, 0, 2 ** 16 - 1);
    super(
      SignatureScheme2,
      signatureVector
    );
  }
};
var Finished = class extends Struct {
  type = HandshakeType.finished;
  constructor(verifyData) {
    super(verifyData);
  }
};

// def/serverparams.js
var DistinguishedName = class extends VariableVector {
  constructor(list) {
    super(list, 1, 2 ** 16 - 1);
  }
};
var CertificateAuthoritiesExtension = class extends Struct {
  constructor(authorities) {
    const DistinguishedName2 = new VariableVector(authorities, 3, 2 ** 16 - 1);
    super(DistinguishedName2);
  }
};
var OIDFilter = class extends Struct {
  constructor(certificate_extension_oid, certificate_extension_values) {
    const certExtOidVector = new VariableVector(certificate_extension_oid, 1, 2 ** 8 - 1);
    const certExtValVector = new VariableVector(certificate_extension_values, 0, 2 ** 16 - 1);
    super(
      certExtOidVector,
      certExtValVector
    );
  }
};
var OIDFilterExtension = class extends Struct {
  constructor(filters) {
    const OIDFilter2 = new VariableVector(filters, 0, 2 ** 16 - 1);
    super(OIDFilter2);
  }
};
var PostHandshakeAuth = class extends Struct {
  constructor() {
    super();
  }
};
var EncryptedExtensions = class extends Struct {
  type = HandshakeType.encrypted_extensions;
  constructor(extensions) {
    const extension = new VariableVector(extensions, 0, 2 ** 16 - 1);
    super(extension);
  }
};
var CertificateRequest = class extends Struct {
  type = HandshakeType.certificate_request;
  constructor(certificate_request_context, extensions) {
    const certReqCtxVector = new VariableVector(certificate_request_context, 0, 2 ** 8 - 1);
    const extension = new VariableVector(extensions, 2, 2 ** 16 - 1);
    super(
      certReqCtxVector,
      extension
    );
  }
};

// def/ticketupdatekeys.js
var NewSessionTicket = class extends Struct {
  type = HandshakeType.new_session_ticket;
  constructor(ticket, extension = new Uint8(0)) {
    const lifetime = new Uint32(7200);
    const ageAdd = new Uint32(0);
    const nonce = new VariableVector(new Uint8(0), 0, 255);
    const ticketVector = new VariableVector(ticket, 1, 2 ** 16 - 1);
    const Extension2 = new VariableVector(extension, 0, 2 ** 16 - 2);
    super(
      lifetime,
      ageAdd,
      nonce,
      ticketVector,
      Extension2
    );
  }
};
var EndOfEarlyData = class extends Struct {
  type = HandshakeType.end_of_early_data;
  constructor() {
    super();
  }
};
var KeyUpdateRequest = class {
  static update_not_requested = new Uint8(0);
  static update_requested = new Uint8(1);
  static Max = new Uint8(255);
};
var KeyUpdate = class extends Struct {
  type = HandshakeType.key_update;
  constructor(request_update) {
    const KeyUpdateRequest2 = request_update;
    super(KeyUpdateRequest2);
  }
};
export {
  Alert,
  AlertDescription,
  AlertLevel,
  Certificate,
  CertificateAuthoritiesExtension,
  CertificateEntry,
  CertificateList,
  CertificateRequest,
  CertificateType,
  CertificateVerify,
  ChangeCipherSpec,
  CipherSuite,
  CipherSuites,
  ClientHello,
  Compression,
  ContentType,
  Cookie,
  DistinguishedName,
  ECPointFormat,
  ECPointFormatList,
  EarlyDataIndication,
  Empty,
  EncryptedExtensions,
  EndOfEarlyData,
  Extension,
  ExtensionType,
  Finished,
  FixedVector,
  Handshake,
  HandshakeType,
  KeyShareClientHello,
  KeyShareEntry,
  KeyShareHelloRetryRequest,
  KeyShareServerHello,
  KeyUpdate,
  KeyUpdateRequest,
  NamedGroup,
  NamedGroupList,
  NewSessionTicket,
  OIDFilter,
  OIDFilterExtension,
  OfferedPsks,
  PostHandshakeAuth,
  PreSharedKeyExtension,
  PskBinderEntry,
  PskIdentity,
  PskKeyExchangeMode,
  PskKeyExchangeModes,
  Random,
  ServerHello,
  ServerName,
  ServerNameList,
  SessionId,
  SignatureScheme,
  SignatureSchemeList,
  Struct,
  SupportedVersions,
  TLSCiphertext,
  TLSInnerPlaintext,
  TLSPlaintext,
  Uint16,
  Uint24,
  Uint32,
  Uint8,
  UncompressedPointRepresentation,
  VariableVector,
  Zeros,
  ciphers,
  compression,
  protocolVersion
};
