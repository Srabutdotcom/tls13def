import { ClientHello, KeyShareEntry, NamedGroup } from "../../def/keyxmsg.js";
import * as x25519 from "@stablelib/x25519"
import { Handshake } from "../../def/handshake.js";
import { TLSPlaintext } from "../../def/record.js";

const enc = new TextEncoder;
const dec = new TextDecoder;

export async function connect(hostname, handler, tls = false) {
   const option = {
      hostname,
      port: 587
   }
   const conn = tls ? await Deno.connectTls(option) : await Deno.connect(option);

   const reader = conn.readable.getReader();
   const writer = conn.writable.getWriter();

   const close = await handler({ conn, reader, writer })
   if (close == true || close == 'quit') return conn.close();
}

async function upgrade(conn) {
   const connTls = await Deno.startTls(conn, {});
   const reader = connTls.readable.getReader();
   const writer = connTls.writable.getWriter();
   //* Send EHLO msg
   let encoded = enc.encode(`EHLO locahost\r\n`)
   await writer.write(encoded)
   //* Read Initial message from Server
   let response = await reader.read();
   let decoded = dec.decode(response.value).split('\r\n');
   debugger;
   return true
}

export async function handleLocal(obj) {
   const { conn, reader, writer } = obj;
   //* Read Initial message from Server
   let response = await reader.read();
   let decoded = dec.decode(response.value).split('\r\n');
   debugger;
   /* //* Send EHLO msg
   await writer.write(enc.encode(`EHLO locahost\r\n`)) */

   return await upgrade(conn)
}

export async function handleTsl(obj) {
   const { conn, reader, writer } = obj;
   //* Read Initial message from Server
   //let response = await reader.read();
   //let decoded = dec.decode(response.value).split('\r\n');
   //debugger;
   //* send clientHello
   await writer.write(createClientHello());
   let response = await reader.read();
   let decoded = dec.decode(response.value).split('\r\n');
   debugger;
   return true
}


export async function handleGmail(obj) {
   const { conn, reader, writer } = obj;
   //* Read Initial message from Server
   let response = await reader.read();
   let decoded = dec.decode(response.value).split('\r\n');

   //* Send EHLO msg
   let encoded = enc.encode(`EHLO locahost\r\n`)
   await writer.write(encoded)

   //* Read EHLO response
   response = await reader.read();
   decoded = dec.decode(response.value).split('\r\n')

   //* Send STARTTLS msg
   encoded = enc.encode(`STARTTLS\r\n`)
   await writer.write(encoded)

   //* Read STARTTLS response
   response = await reader.read();
   decoded = dec.decode(response.value).split('\r\n')

   //* Send ClientHello
   const clientHello = createClientHello()
   await writer.write(clientHello)//mergeUint8(clientHello, new Uint8Array([13,10]))

   //* Read ClientHello response
   response = await reader.read();
   decoded = dec.decode(response.value).split('\r\n')
   debugger;
   return true
}

function createClientHello() {
   const keys = x25519.generateKeyPair();
   const keyShareEntry = new KeyShareEntry(NamedGroup.x25519, keys.publicKey);
   const clientHello = new ClientHello('localhost', keyShareEntry);
   const handshakeClientHello = new Handshake(clientHello);
   const recordClientHello = new TLSPlaintext(handshakeClientHello);
   return recordClientHello;
}