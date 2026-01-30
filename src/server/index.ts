import { createServer, getServerPort } from "@devvit/web/server";
import { serverOnRequest } from "./server.ts";

const server = createServer(serverOnRequest);
const port: number = getServerPort();

server.on("error", (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
