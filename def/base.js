//*DONE - verified

import { mergeUint8, Uint8BE, maxBytes, Uint16BE, Uint24BE, Uint32BE } from "../tools/tools.js"

class Struct extends Uint8Array {
   #struct
   constructor(...array) {
      if (!array || !array.length) {
         super()
      } else if (array.some(e => (e instanceof Uint8Array) == false)) {
         throw TypeError(`all arguments must be Uint8Array`)
      } else {
         super(mergeUint8(...array))
      }
      this.#struct = array
   }
   struct() { return this.#struct }
}

class FixedVector extends Uint8Array {
   constructor(uint8s, length) {
      if ((uint8s instanceof Uint8Array) == false) throw TypeError(`all arguments must be Uint8Array`)
      if (typeof (length) !== 'number') throw TypeError(`argument 2 must be a number`)
      if (uint8s.length !== length) throw TypeError(`Expected value with length is ${length}`)
      super(uint8s.buffer);
   }
}

class VariableVector extends Uint8Array {
   #uint8s
   constructor(uint8s, min, max) {
      if ((uint8s instanceof Uint8Array) == false) throw TypeError(`all arguments must be Uint8Array`)
      if (typeof (min) !== 'number') throw TypeError(`argument 2 must be a number`)
      if (typeof (max) !== 'number') throw TypeError(`argument 3 must be a number`)
      if (uint8s.length < min) throw TypeError(`value should have a min length of ${min}`)
      if (uint8s.length > max) throw TypeError(`value should have a max length of ${max}`)

      const length = Uint8BE(uint8s.length, maxBytes(max))
      super(mergeUint8(length, uint8s));
      this.#uint8s = uint8s
   }
   uint8s() {
      return this.#uint8s;
   }
}

class Zeros extends Uint8Array {
   constructor(length) {
      const buf = new ArrayBuffer(length)
      super(buf)
   }
}

class Uint8 extends Uint8Array {
   constructor(integer) {
      super(Uint8BE(integer, 1).buffer)
   }
}

class Uint16 extends Uint8Array {
   constructor(integer) {
      super(Uint16BE(integer).buffer)
   }
}

class Uint24 extends Uint8Array {
   constructor(integer) {
      super(Uint24BE(integer).buffer)
   }
}

class Uint32 extends Uint8Array {
   constructor(integer) {
      super(Uint32BE(integer).buffer)
   }
}


export { FixedVector, VariableVector, Struct, Zeros, Uint8, Uint16, Uint24, Uint32 }