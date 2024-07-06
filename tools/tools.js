export const enc = new TextEncoder
export const dec = new TextDecoder

export function Uint8BE(_integer, _bytes) {
   const integer = ensureUint(_integer);
   const bytes = _bytes ?? maxBytes(integer)
   const upper = 2 ** (8 * bytes) - 1;
   if (integer > upper) return TypeError(`integer can't be more than ${upper} `)
   // Create the Uint8Array with the specified number of bytes
   const uint8 = new Uint8Array(bytes);

   // Loop through each byte in big-endian order (most significant first)
   for (let i = 0; i < bytes; i++) {
      const index = bytes - 1 - i
      const shiftAmount = index * 8; // Calculate shift amount based on byte index
      uint8[i] = (integer >> shiftAmount) & 0xff; // Shift and mask to get the current byte integer
   }
   return uint8;
}

export function Uint16BE(_int) {
   return Uint8BE(_int, 2);
}
export function Uint24BE(_int) {
   return Uint8BE(_int, 3);
}
export function Uint32BE(_int) {
   return Uint8BE(_int, 4);
}

export function maxBytes(_integer) {
   const integer = ensureInteger(_integer)
   let b = 1;
   while (true) {
      if (2 ** (b * 8) > integer) return b;
      b++
   }
}

export function ensureInteger(integer) {
   const _integer = +Number(integer).toFixed(0);
   const pass = Number.isInteger(_integer)//validate(_integer, ['integer'])
   if (!pass) throw TypeError(`expected integer`);
   return _integer
}

export function ensureUint(integer) {
   const pass = ensureInteger(integer);
   if (pass < 0) throw TypeError(`expected positive integer`)
   return pass;
}

/**
 * 
 * @param  {...Uint8Array} arrays 
 * @returns {Uint8Array}
 */
export function mergeUint8(...arrays) {
   const totalLength = arrays.reduce((acc, arr) => acc + arr?.length, 0);
   const result = new Uint8Array(totalLength);
   let offset = 0;

   for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr?.length;
   }

   return result;
}
/**
 * 
 * @param {Uint8Array} data 
 * @param {uint} pos 
 * @param {uint} length 
 * @returns {uint} The unsigned integer value, or throws an error if the provided data is not a byte array,
       the position is out of bounds, or the length is less than 1.
 */
export function getUint8BE(data, pos = 0, length = 1) {

   if (!(data instanceof Uint8Array)) {
      throw new TypeError("Input data must be a byte array");
   }

   if (pos < 0 || pos >= data.length) {
      throw new TypeError("Position is out of bounds");
   }

   if (length < 1) {
      throw new TypeError("Length must be at least 1");
   }

   if(pos + length > data.length){
      throw TypeError(`length is beyond data.length`)
   }

   // Use a loop to handle bytes of any length
   let output = 0;
   for (let i = pos; i < pos + length; i++) {
      output = (output << 8) | data[i];
   }

   return output;
}
