var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/source/browser.js
var require_browser = __commonJS({
  "../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/source/browser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrowserRandomSource = void 0;
    var QUOTA = 65536;
    var BrowserRandomSource = class {
      constructor() {
        this.isAvailable = false;
        this.isInstantiated = false;
        const browserCrypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (browserCrypto && browserCrypto.getRandomValues !== void 0) {
          this._crypto = browserCrypto;
          this.isAvailable = true;
          this.isInstantiated = true;
        }
      }
      randomBytes(length) {
        if (!this.isAvailable || !this._crypto) {
          throw new Error("Browser random byte generator is not available.");
        }
        const out = new Uint8Array(length);
        for (let i = 0; i < out.length; i += QUOTA) {
          this._crypto.getRandomValues(out.subarray(i, i + Math.min(out.length - i, QUOTA)));
        }
        return out;
      }
    };
    exports.BrowserRandomSource = BrowserRandomSource;
  }
});

// ../../../node_modules/.deno/@stablelib+wipe@1.0.1/node_modules/@stablelib/wipe/lib/wipe.js
var require_wipe = __commonJS({
  "../../../node_modules/.deno/@stablelib+wipe@1.0.1/node_modules/@stablelib/wipe/lib/wipe.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function wipe(array) {
      for (var i = 0; i < array.length; i++) {
        array[i] = 0;
      }
      return array;
    }
    exports.wipe = wipe;
  }
});

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// ../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/source/node.js
var require_node = __commonJS({
  "../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/source/node.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NodeRandomSource = void 0;
    var wipe_1 = require_wipe();
    var NodeRandomSource = class {
      constructor() {
        this.isAvailable = false;
        this.isInstantiated = false;
        if (typeof __require !== "undefined") {
          const nodeCrypto = require_crypto();
          if (nodeCrypto && nodeCrypto.randomBytes) {
            this._crypto = nodeCrypto;
            this.isAvailable = true;
            this.isInstantiated = true;
          }
        }
      }
      randomBytes(length) {
        if (!this.isAvailable || !this._crypto) {
          throw new Error("Node.js random byte generator is not available.");
        }
        let buffer = this._crypto.randomBytes(length);
        if (buffer.length !== length) {
          throw new Error("NodeRandomSource: got fewer bytes than requested");
        }
        const out = new Uint8Array(length);
        for (let i = 0; i < out.length; i++) {
          out[i] = buffer[i];
        }
        (0, wipe_1.wipe)(buffer);
        return out;
      }
    };
    exports.NodeRandomSource = NodeRandomSource;
  }
});

// ../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/source/system.js
var require_system = __commonJS({
  "../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/source/system.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemRandomSource = void 0;
    var browser_1 = require_browser();
    var node_1 = require_node();
    var SystemRandomSource = class {
      constructor() {
        this.isAvailable = false;
        this.name = "";
        this._source = new browser_1.BrowserRandomSource();
        if (this._source.isAvailable) {
          this.isAvailable = true;
          this.name = "Browser";
          return;
        }
        this._source = new node_1.NodeRandomSource();
        if (this._source.isAvailable) {
          this.isAvailable = true;
          this.name = "Node";
          return;
        }
      }
      randomBytes(length) {
        if (!this.isAvailable) {
          throw new Error("System random byte generator is not available.");
        }
        return this._source.randomBytes(length);
      }
    };
    exports.SystemRandomSource = SystemRandomSource;
  }
});

// ../../../node_modules/.deno/@stablelib+int@1.0.1/node_modules/@stablelib/int/lib/int.js
var require_int = __commonJS({
  "../../../node_modules/.deno/@stablelib+int@1.0.1/node_modules/@stablelib/int/lib/int.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function imulShim(a, b) {
      var ah = a >>> 16 & 65535, al = a & 65535;
      var bh = b >>> 16 & 65535, bl = b & 65535;
      return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
    }
    exports.mul = Math.imul || imulShim;
    function add(a, b) {
      return a + b | 0;
    }
    exports.add = add;
    function sub(a, b) {
      return a - b | 0;
    }
    exports.sub = sub;
    function rotl(x, n) {
      return x << n | x >>> 32 - n;
    }
    exports.rotl = rotl;
    function rotr(x, n) {
      return x << 32 - n | x >>> n;
    }
    exports.rotr = rotr;
    function isIntegerShim(n) {
      return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
    }
    exports.isInteger = Number.isInteger || isIntegerShim;
    exports.MAX_SAFE_INTEGER = 9007199254740991;
    exports.isSafeInteger = function(n) {
      return exports.isInteger(n) && (n >= -exports.MAX_SAFE_INTEGER && n <= exports.MAX_SAFE_INTEGER);
    };
  }
});

// ../../../node_modules/.deno/@stablelib+binary@1.0.1/node_modules/@stablelib/binary/lib/binary.js
var require_binary = __commonJS({
  "../../../node_modules/.deno/@stablelib+binary@1.0.1/node_modules/@stablelib/binary/lib/binary.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var int_1 = require_int();
    function readInt16BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 0] << 8 | array[offset + 1]) << 16 >> 16;
    }
    exports.readInt16BE = readInt16BE;
    function readUint16BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 0] << 8 | array[offset + 1]) >>> 0;
    }
    exports.readUint16BE = readUint16BE;
    function readInt16LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 1] << 8 | array[offset]) << 16 >> 16;
    }
    exports.readInt16LE = readInt16LE;
    function readUint16LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 1] << 8 | array[offset]) >>> 0;
    }
    exports.readUint16LE = readUint16LE;
    function writeUint16BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(2);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 8;
      out[offset + 1] = value >>> 0;
      return out;
    }
    exports.writeUint16BE = writeUint16BE;
    exports.writeInt16BE = writeUint16BE;
    function writeUint16LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(2);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 0;
      out[offset + 1] = value >>> 8;
      return out;
    }
    exports.writeUint16LE = writeUint16LE;
    exports.writeInt16LE = writeUint16LE;
    function readInt32BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3];
    }
    exports.readInt32BE = readInt32BE;
    function readUint32BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3]) >>> 0;
    }
    exports.readUint32BE = readUint32BE;
    function readInt32LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset];
    }
    exports.readInt32LE = readInt32LE;
    function readUint32LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset]) >>> 0;
    }
    exports.readUint32LE = readUint32LE;
    function writeUint32BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 24;
      out[offset + 1] = value >>> 16;
      out[offset + 2] = value >>> 8;
      out[offset + 3] = value >>> 0;
      return out;
    }
    exports.writeUint32BE = writeUint32BE;
    exports.writeInt32BE = writeUint32BE;
    function writeUint32LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 0;
      out[offset + 1] = value >>> 8;
      out[offset + 2] = value >>> 16;
      out[offset + 3] = value >>> 24;
      return out;
    }
    exports.writeUint32LE = writeUint32LE;
    exports.writeInt32LE = writeUint32LE;
    function readInt64BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var hi = readInt32BE(array, offset);
      var lo = readInt32BE(array, offset + 4);
      return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
    }
    exports.readInt64BE = readInt64BE;
    function readUint64BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var hi = readUint32BE(array, offset);
      var lo = readUint32BE(array, offset + 4);
      return hi * 4294967296 + lo;
    }
    exports.readUint64BE = readUint64BE;
    function readInt64LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var lo = readInt32LE(array, offset);
      var hi = readInt32LE(array, offset + 4);
      return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
    }
    exports.readInt64LE = readInt64LE;
    function readUint64LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var lo = readUint32LE(array, offset);
      var hi = readUint32LE(array, offset + 4);
      return hi * 4294967296 + lo;
    }
    exports.readUint64LE = readUint64LE;
    function writeUint64BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      writeUint32BE(value / 4294967296 >>> 0, out, offset);
      writeUint32BE(value >>> 0, out, offset + 4);
      return out;
    }
    exports.writeUint64BE = writeUint64BE;
    exports.writeInt64BE = writeUint64BE;
    function writeUint64LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      writeUint32LE(value >>> 0, out, offset);
      writeUint32LE(value / 4294967296 >>> 0, out, offset + 4);
      return out;
    }
    exports.writeUint64LE = writeUint64LE;
    exports.writeInt64LE = writeUint64LE;
    function readUintBE(bitLength, array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("readUintBE supports only bitLengths divisible by 8");
      }
      if (bitLength / 8 > array.length - offset) {
        throw new Error("readUintBE: array is too short for the given bitLength");
      }
      var result = 0;
      var mul = 1;
      for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
        result += array[i] * mul;
        mul *= 256;
      }
      return result;
    }
    exports.readUintBE = readUintBE;
    function readUintLE(bitLength, array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("readUintLE supports only bitLengths divisible by 8");
      }
      if (bitLength / 8 > array.length - offset) {
        throw new Error("readUintLE: array is too short for the given bitLength");
      }
      var result = 0;
      var mul = 1;
      for (var i = offset; i < offset + bitLength / 8; i++) {
        result += array[i] * mul;
        mul *= 256;
      }
      return result;
    }
    exports.readUintLE = readUintLE;
    function writeUintBE(bitLength, value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(bitLength / 8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("writeUintBE supports only bitLengths divisible by 8");
      }
      if (!int_1.isSafeInteger(value)) {
        throw new Error("writeUintBE value must be an integer");
      }
      var div = 1;
      for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
        out[i] = value / div & 255;
        div *= 256;
      }
      return out;
    }
    exports.writeUintBE = writeUintBE;
    function writeUintLE(bitLength, value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(bitLength / 8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("writeUintLE supports only bitLengths divisible by 8");
      }
      if (!int_1.isSafeInteger(value)) {
        throw new Error("writeUintLE value must be an integer");
      }
      var div = 1;
      for (var i = offset; i < offset + bitLength / 8; i++) {
        out[i] = value / div & 255;
        div *= 256;
      }
      return out;
    }
    exports.writeUintLE = writeUintLE;
    function readFloat32BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat32(offset);
    }
    exports.readFloat32BE = readFloat32BE;
    function readFloat32LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat32(offset, true);
    }
    exports.readFloat32LE = readFloat32LE;
    function readFloat64BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat64(offset);
    }
    exports.readFloat64BE = readFloat64BE;
    function readFloat64LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat64(offset, true);
    }
    exports.readFloat64LE = readFloat64LE;
    function writeFloat32BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat32(offset, value);
      return out;
    }
    exports.writeFloat32BE = writeFloat32BE;
    function writeFloat32LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat32(offset, value, true);
      return out;
    }
    exports.writeFloat32LE = writeFloat32LE;
    function writeFloat64BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat64(offset, value);
      return out;
    }
    exports.writeFloat64BE = writeFloat64BE;
    function writeFloat64LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat64(offset, value, true);
      return out;
    }
    exports.writeFloat64LE = writeFloat64LE;
  }
});

// ../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/random.js
var require_random = __commonJS({
  "../../../node_modules/.deno/@stablelib+random@1.0.2/node_modules/@stablelib/random/lib/random.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randomStringForEntropy = exports.randomString = exports.randomUint32 = exports.randomBytes = exports.defaultRandomSource = void 0;
    var system_1 = require_system();
    var binary_1 = require_binary();
    var wipe_1 = require_wipe();
    exports.defaultRandomSource = new system_1.SystemRandomSource();
    function randomBytes(length, prng = exports.defaultRandomSource) {
      return prng.randomBytes(length);
    }
    exports.randomBytes = randomBytes;
    function randomUint32(prng = exports.defaultRandomSource) {
      const buf = randomBytes(4, prng);
      const result = (0, binary_1.readUint32LE)(buf);
      (0, wipe_1.wipe)(buf);
      return result;
    }
    exports.randomUint32 = randomUint32;
    var ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    function randomString(length, charset = ALPHANUMERIC, prng = exports.defaultRandomSource) {
      if (charset.length < 2) {
        throw new Error("randomString charset is too short");
      }
      if (charset.length > 256) {
        throw new Error("randomString charset is too long");
      }
      let out = "";
      const charsLen = charset.length;
      const maxByte = 256 - 256 % charsLen;
      while (length > 0) {
        const buf = randomBytes(Math.ceil(length * 256 / maxByte), prng);
        for (let i = 0; i < buf.length && length > 0; i++) {
          const randomByte = buf[i];
          if (randomByte < maxByte) {
            out += charset.charAt(randomByte % charsLen);
            length--;
          }
        }
        (0, wipe_1.wipe)(buf);
      }
      return out;
    }
    exports.randomString = randomString;
    function randomStringForEntropy(bits, charset = ALPHANUMERIC, prng = exports.defaultRandomSource) {
      const length = Math.ceil(bits / (Math.log(charset.length) / Math.LN2));
      return randomString(length, charset, prng);
    }
    exports.randomStringForEntropy = randomStringForEntropy;
  }
});

// ../../../node_modules/.deno/@stablelib+x25519@1.0.3/node_modules/@stablelib/x25519/lib/x25519.js
var require_x25519 = __commonJS({
  "../../../node_modules/.deno/@stablelib+x25519@1.0.3/node_modules/@stablelib/x25519/lib/x25519.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sharedKey = exports.generateKeyPair = exports.generateKeyPairFromSeed = exports.scalarMultBase = exports.scalarMult = exports.SHARED_KEY_LENGTH = exports.SECRET_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = void 0;
    var random_1 = require_random();
    var wipe_1 = require_wipe();
    exports.PUBLIC_KEY_LENGTH = 32;
    exports.SECRET_KEY_LENGTH = 32;
    exports.SHARED_KEY_LENGTH = 32;
    function gf(init) {
      const r = new Float64Array(16);
      if (init) {
        for (let i = 0; i < init.length; i++) {
          r[i] = init[i];
        }
      }
      return r;
    }
    var _9 = new Uint8Array(32);
    _9[0] = 9;
    var _121665 = gf([56129, 1]);
    function car25519(o) {
      let c = 1;
      for (let i = 0; i < 16; i++) {
        let v = o[i] + c + 65535;
        c = Math.floor(v / 65536);
        o[i] = v - c * 65536;
      }
      o[0] += c - 1 + 37 * (c - 1);
    }
    function sel25519(p, q, b) {
      const c = ~(b - 1);
      for (let i = 0; i < 16; i++) {
        const t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
      }
    }
    function pack25519(o, n) {
      const m = gf();
      const t = gf();
      for (let i = 0; i < 16; i++) {
        t[i] = n[i];
      }
      car25519(t);
      car25519(t);
      car25519(t);
      for (let j = 0; j < 2; j++) {
        m[0] = t[0] - 65517;
        for (let i = 1; i < 15; i++) {
          m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
          m[i - 1] &= 65535;
        }
        m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
        const b = m[15] >> 16 & 1;
        m[14] &= 65535;
        sel25519(t, m, 1 - b);
      }
      for (let i = 0; i < 16; i++) {
        o[2 * i] = t[i] & 255;
        o[2 * i + 1] = t[i] >> 8;
      }
    }
    function unpack25519(o, n) {
      for (let i = 0; i < 16; i++) {
        o[i] = n[2 * i] + (n[2 * i + 1] << 8);
      }
      o[15] &= 32767;
    }
    function add(o, a, b) {
      for (let i = 0; i < 16; i++) {
        o[i] = a[i] + b[i];
      }
    }
    function sub(o, a, b) {
      for (let i = 0; i < 16; i++) {
        o[i] = a[i] - b[i];
      }
    }
    function mul(o, a, b) {
      let v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
      v = a[0];
      t0 += v * b0;
      t1 += v * b1;
      t2 += v * b2;
      t3 += v * b3;
      t4 += v * b4;
      t5 += v * b5;
      t6 += v * b6;
      t7 += v * b7;
      t8 += v * b8;
      t9 += v * b9;
      t10 += v * b10;
      t11 += v * b11;
      t12 += v * b12;
      t13 += v * b13;
      t14 += v * b14;
      t15 += v * b15;
      v = a[1];
      t1 += v * b0;
      t2 += v * b1;
      t3 += v * b2;
      t4 += v * b3;
      t5 += v * b4;
      t6 += v * b5;
      t7 += v * b6;
      t8 += v * b7;
      t9 += v * b8;
      t10 += v * b9;
      t11 += v * b10;
      t12 += v * b11;
      t13 += v * b12;
      t14 += v * b13;
      t15 += v * b14;
      t16 += v * b15;
      v = a[2];
      t2 += v * b0;
      t3 += v * b1;
      t4 += v * b2;
      t5 += v * b3;
      t6 += v * b4;
      t7 += v * b5;
      t8 += v * b6;
      t9 += v * b7;
      t10 += v * b8;
      t11 += v * b9;
      t12 += v * b10;
      t13 += v * b11;
      t14 += v * b12;
      t15 += v * b13;
      t16 += v * b14;
      t17 += v * b15;
      v = a[3];
      t3 += v * b0;
      t4 += v * b1;
      t5 += v * b2;
      t6 += v * b3;
      t7 += v * b4;
      t8 += v * b5;
      t9 += v * b6;
      t10 += v * b7;
      t11 += v * b8;
      t12 += v * b9;
      t13 += v * b10;
      t14 += v * b11;
      t15 += v * b12;
      t16 += v * b13;
      t17 += v * b14;
      t18 += v * b15;
      v = a[4];
      t4 += v * b0;
      t5 += v * b1;
      t6 += v * b2;
      t7 += v * b3;
      t8 += v * b4;
      t9 += v * b5;
      t10 += v * b6;
      t11 += v * b7;
      t12 += v * b8;
      t13 += v * b9;
      t14 += v * b10;
      t15 += v * b11;
      t16 += v * b12;
      t17 += v * b13;
      t18 += v * b14;
      t19 += v * b15;
      v = a[5];
      t5 += v * b0;
      t6 += v * b1;
      t7 += v * b2;
      t8 += v * b3;
      t9 += v * b4;
      t10 += v * b5;
      t11 += v * b6;
      t12 += v * b7;
      t13 += v * b8;
      t14 += v * b9;
      t15 += v * b10;
      t16 += v * b11;
      t17 += v * b12;
      t18 += v * b13;
      t19 += v * b14;
      t20 += v * b15;
      v = a[6];
      t6 += v * b0;
      t7 += v * b1;
      t8 += v * b2;
      t9 += v * b3;
      t10 += v * b4;
      t11 += v * b5;
      t12 += v * b6;
      t13 += v * b7;
      t14 += v * b8;
      t15 += v * b9;
      t16 += v * b10;
      t17 += v * b11;
      t18 += v * b12;
      t19 += v * b13;
      t20 += v * b14;
      t21 += v * b15;
      v = a[7];
      t7 += v * b0;
      t8 += v * b1;
      t9 += v * b2;
      t10 += v * b3;
      t11 += v * b4;
      t12 += v * b5;
      t13 += v * b6;
      t14 += v * b7;
      t15 += v * b8;
      t16 += v * b9;
      t17 += v * b10;
      t18 += v * b11;
      t19 += v * b12;
      t20 += v * b13;
      t21 += v * b14;
      t22 += v * b15;
      v = a[8];
      t8 += v * b0;
      t9 += v * b1;
      t10 += v * b2;
      t11 += v * b3;
      t12 += v * b4;
      t13 += v * b5;
      t14 += v * b6;
      t15 += v * b7;
      t16 += v * b8;
      t17 += v * b9;
      t18 += v * b10;
      t19 += v * b11;
      t20 += v * b12;
      t21 += v * b13;
      t22 += v * b14;
      t23 += v * b15;
      v = a[9];
      t9 += v * b0;
      t10 += v * b1;
      t11 += v * b2;
      t12 += v * b3;
      t13 += v * b4;
      t14 += v * b5;
      t15 += v * b6;
      t16 += v * b7;
      t17 += v * b8;
      t18 += v * b9;
      t19 += v * b10;
      t20 += v * b11;
      t21 += v * b12;
      t22 += v * b13;
      t23 += v * b14;
      t24 += v * b15;
      v = a[10];
      t10 += v * b0;
      t11 += v * b1;
      t12 += v * b2;
      t13 += v * b3;
      t14 += v * b4;
      t15 += v * b5;
      t16 += v * b6;
      t17 += v * b7;
      t18 += v * b8;
      t19 += v * b9;
      t20 += v * b10;
      t21 += v * b11;
      t22 += v * b12;
      t23 += v * b13;
      t24 += v * b14;
      t25 += v * b15;
      v = a[11];
      t11 += v * b0;
      t12 += v * b1;
      t13 += v * b2;
      t14 += v * b3;
      t15 += v * b4;
      t16 += v * b5;
      t17 += v * b6;
      t18 += v * b7;
      t19 += v * b8;
      t20 += v * b9;
      t21 += v * b10;
      t22 += v * b11;
      t23 += v * b12;
      t24 += v * b13;
      t25 += v * b14;
      t26 += v * b15;
      v = a[12];
      t12 += v * b0;
      t13 += v * b1;
      t14 += v * b2;
      t15 += v * b3;
      t16 += v * b4;
      t17 += v * b5;
      t18 += v * b6;
      t19 += v * b7;
      t20 += v * b8;
      t21 += v * b9;
      t22 += v * b10;
      t23 += v * b11;
      t24 += v * b12;
      t25 += v * b13;
      t26 += v * b14;
      t27 += v * b15;
      v = a[13];
      t13 += v * b0;
      t14 += v * b1;
      t15 += v * b2;
      t16 += v * b3;
      t17 += v * b4;
      t18 += v * b5;
      t19 += v * b6;
      t20 += v * b7;
      t21 += v * b8;
      t22 += v * b9;
      t23 += v * b10;
      t24 += v * b11;
      t25 += v * b12;
      t26 += v * b13;
      t27 += v * b14;
      t28 += v * b15;
      v = a[14];
      t14 += v * b0;
      t15 += v * b1;
      t16 += v * b2;
      t17 += v * b3;
      t18 += v * b4;
      t19 += v * b5;
      t20 += v * b6;
      t21 += v * b7;
      t22 += v * b8;
      t23 += v * b9;
      t24 += v * b10;
      t25 += v * b11;
      t26 += v * b12;
      t27 += v * b13;
      t28 += v * b14;
      t29 += v * b15;
      v = a[15];
      t15 += v * b0;
      t16 += v * b1;
      t17 += v * b2;
      t18 += v * b3;
      t19 += v * b4;
      t20 += v * b5;
      t21 += v * b6;
      t22 += v * b7;
      t23 += v * b8;
      t24 += v * b9;
      t25 += v * b10;
      t26 += v * b11;
      t27 += v * b12;
      t28 += v * b13;
      t29 += v * b14;
      t30 += v * b15;
      t0 += 38 * t16;
      t1 += 38 * t17;
      t2 += 38 * t18;
      t3 += 38 * t19;
      t4 += 38 * t20;
      t5 += 38 * t21;
      t6 += 38 * t22;
      t7 += 38 * t23;
      t8 += 38 * t24;
      t9 += 38 * t25;
      t10 += 38 * t26;
      t11 += 38 * t27;
      t12 += 38 * t28;
      t13 += 38 * t29;
      t14 += 38 * t30;
      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1);
      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1);
      o[0] = t0;
      o[1] = t1;
      o[2] = t2;
      o[3] = t3;
      o[4] = t4;
      o[5] = t5;
      o[6] = t6;
      o[7] = t7;
      o[8] = t8;
      o[9] = t9;
      o[10] = t10;
      o[11] = t11;
      o[12] = t12;
      o[13] = t13;
      o[14] = t14;
      o[15] = t15;
    }
    function square(o, a) {
      mul(o, a, a);
    }
    function inv25519(o, inp) {
      const c = gf();
      for (let i = 0; i < 16; i++) {
        c[i] = inp[i];
      }
      for (let i = 253; i >= 0; i--) {
        square(c, c);
        if (i !== 2 && i !== 4) {
          mul(c, c, inp);
        }
      }
      for (let i = 0; i < 16; i++) {
        o[i] = c[i];
      }
    }
    function scalarMult(n, p) {
      const z = new Uint8Array(32);
      const x = new Float64Array(80);
      const a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
      for (let i = 0; i < 31; i++) {
        z[i] = n[i];
      }
      z[31] = n[31] & 127 | 64;
      z[0] &= 248;
      unpack25519(x, p);
      for (let i = 0; i < 16; i++) {
        b[i] = x[i];
      }
      a[0] = d[0] = 1;
      for (let i = 254; i >= 0; --i) {
        const r = z[i >>> 3] >>> (i & 7) & 1;
        sel25519(a, b, r);
        sel25519(c, d, r);
        add(e, a, c);
        sub(a, a, c);
        add(c, b, d);
        sub(b, b, d);
        square(d, e);
        square(f, a);
        mul(a, c, a);
        mul(c, b, e);
        add(e, a, c);
        sub(a, a, c);
        square(b, a);
        sub(c, d, f);
        mul(a, c, _121665);
        add(a, a, d);
        mul(c, c, a);
        mul(a, d, f);
        mul(d, b, x);
        square(b, e);
        sel25519(a, b, r);
        sel25519(c, d, r);
      }
      for (let i = 0; i < 16; i++) {
        x[i + 16] = a[i];
        x[i + 32] = c[i];
        x[i + 48] = b[i];
        x[i + 64] = d[i];
      }
      const x32 = x.subarray(32);
      const x16 = x.subarray(16);
      inv25519(x32, x32);
      mul(x16, x16, x32);
      const q = new Uint8Array(32);
      pack25519(q, x16);
      return q;
    }
    exports.scalarMult = scalarMult;
    function scalarMultBase(n) {
      return scalarMult(n, _9);
    }
    exports.scalarMultBase = scalarMultBase;
    function generateKeyPairFromSeed(seed) {
      if (seed.length !== exports.SECRET_KEY_LENGTH) {
        throw new Error(`x25519: seed must be ${exports.SECRET_KEY_LENGTH} bytes`);
      }
      const secretKey = new Uint8Array(seed);
      const publicKey = scalarMultBase(secretKey);
      return {
        publicKey,
        secretKey
      };
    }
    exports.generateKeyPairFromSeed = generateKeyPairFromSeed;
    function generateKeyPair3(prng) {
      const seed = (0, random_1.randomBytes)(32, prng);
      const result = generateKeyPairFromSeed(seed);
      (0, wipe_1.wipe)(seed);
      return result;
    }
    exports.generateKeyPair = generateKeyPair3;
    function sharedKey(mySecretKey, theirPublicKey, rejectZero = false) {
      if (mySecretKey.length !== exports.PUBLIC_KEY_LENGTH) {
        throw new Error("X25519: incorrect secret key length");
      }
      if (theirPublicKey.length !== exports.PUBLIC_KEY_LENGTH) {
        throw new Error("X25519: incorrect public key length");
      }
      const result = scalarMult(mySecretKey, theirPublicKey);
      if (rejectZero) {
        let zeros = 0;
        for (let i = 0; i < result.length; i++) {
          zeros |= result[i];
        }
        if (zeros === 0) {
          throw new Error("X25519: invalid shared key");
        }
      }
      return result;
    }
    exports.sharedKey = sharedKey;
  }
});

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
    const cipherSuite = ciphers.find((e) => cipherSuites.map((f) => getUint16(e) == f));
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
    this.random = random;
    this.session_id = session_id;
    this.compression = compression2;
    this.cipherSuite = cipherSuite;
    this.extensions = extensions;
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
    const tls12 = new ProtocolVersion(3);
    const tls13 = new ProtocolVersion(4);
    const versions = client ? new VariableVector(mergeUint8(tls12, tls13), 2, 254) : tls13;
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
    this.encryptedRecord = encryptedRecord;
    this.header = mergeUint8(ContentType.Application, protocolVersion, length);
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

// records/clienthello.js
var x25519 = __toESM(require_x25519());
var ClientHelloRecord = class {
  constructor(hostname = "localhost") {
    this.keys = x25519.generateKeyPair();
    this.keyShareEntry = new KeyShareEntry(NamedGroup.x25519, this.keys.publicKey);
    this.clientHello = new ClientHello(hostname, this.keyShareEntry);
    this.handshake = new Handshake(this.clientHello);
    this.record = new TLSPlaintext(this.handshake);
  }
};

// records/serverhello.js
var x255192 = __toESM(require_x25519());
var ServerHelloRecord = class {
  constructor(sessionId, cipherSuite) {
    this.keys = x255192.generateKeyPair();
    this.keyShareEntry = new KeyShareEntry(NamedGroup.x25519, this.keys.publicKey);
    this.serverHello = new ServerHello(sessionId, cipherSuite, this.keyShareEntry);
    this.handshake = new Handshake(this.serverHello);
    this.record = new TLSPlaintext(this.handshake);
  }
};

// records/encrypted.js
var EncryptObject = class {
  constructor(object) {
    this.handshake = new Handshake(object);
    this.record = new TLSPlaintext(this.handshake);
    this.tlsInnerPlainText = new TLSInnerPlaintext(this.handshake, ContentType.Handshake);
  }
  header() {
    return Uint8Array.from(this.record).slice(0, 5);
  }
  async encrypt(aead) {
    if (this.encrypted)
      return this.encrypted;
    this.encrypted = await aead.encrypt(this.tlsInnerPlainText, this.header());
    const test = await aead.decrypt(this.encrypted);
    return this.encrypted;
  }
  async cipherText(aead) {
    if (this.tlsCipherText)
      return this.tlsCipherText;
    if (this.encrypted)
      return this.#cipherText();
    await this.encrypt(aead);
    return this.#cipherText();
  }
  #cipherText() {
    this.tlsCipherText = new TLSCiphertext(this.encrypted);
    return this.tlsCipherText;
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
  ClientHelloRecord,
  Compression,
  ContentType,
  Cookie,
  DistinguishedName,
  ECPointFormat,
  ECPointFormatList,
  EarlyDataIndication,
  Empty,
  EncryptObject,
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
  ServerHelloRecord,
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
