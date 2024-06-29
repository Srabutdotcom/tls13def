import { connect, handleGmail } from "./connect.js";

connect('smtp.gmail.com', handleGmail);//'smtp.gmail.com'

// openssl s_client -connect smtp.gmail.com:587 -starttls smtp -keylogfile ./keylog/keys.log -msg -debug -trace -msgfile ./keylog/msg.log