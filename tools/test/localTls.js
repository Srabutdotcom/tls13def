import { listen, handleSecure } from "./server.js";
import { connect, handleTsl } from "./connect.js";

listen(true, handleSecure);
connect('localhost', handleTsl/* , true */);