const baseUrl = import.meta.url;
const enc = new TextEncoder;
const dec = new TextDecoder;

const option = {
   hostname: 'localhost',
   port: 587
}

const key = Deno.readTextFileSync(new URL('./keys/localhost+2-key.pem', baseUrl))
const cert = Deno.readTextFileSync(new URL('./keys/localhost+2.pem', baseUrl))

const optionTls = {
   key,
   cert,
   ...option
}

export async function listen(tls = false, handler) {
   const server = (tls) ? Deno.listenTls(optionTls) : Deno.listen(option);
   while (true) {
      try {
         const conn = await server.accept();
         const reader = conn.readable.getReader();
         const writer = conn.writable.getWriter();
         const close = await handler({ conn, reader, writer })
         if (close == true || close == 'quit') return conn.close();
      } catch (err) {
         console.log(err);
         debugger;
         throw err
      }
   }
}

export async function handle(obj) {
   const { conn, reader, writer } = obj;
   let response
   //*send the welcome message
   await writer.write(enc.encode(`Welcome to localhost\r\n`));
   //*read the message
   response = await reader.read(); debugger;

   return true
}

export async function handleSecure(obj) {
   const { conn, reader, writer } = obj;
   let response
   //*send the welcome message
   //await writer.write(enc.encode(`Welcome to localhost\r\n`));
   //*read the message
   //response = await reader.read(); debugger;

   return true
}