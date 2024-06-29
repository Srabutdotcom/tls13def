import { listen, handle } from "./server.js";
import { connect, handleLocal } from "./connect.js";

listen(false, handle);
connect('localhost', handleLocal);