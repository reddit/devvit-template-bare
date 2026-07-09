# devvit-template-hello-world/src

there are Three Folders here.

- `client`: anything you want to send to the client. basically the code that runs on the client.
- `server`: anything you want to send to the server. basically the code that runs on the server.
- `shared`: anything you want to send to both the server and client. the code gets dupicated so you cant use this to get client server interaction via the shared folder. [speculation]

`client` and `server` folders are required to be for your app to work.

## devvit-template-hello-world/src/client

in the client older there are three other folders. these folders are for this template and should be able to be rearranged.

- `game`: this template specifies the `game` folder to contain the code for the expanded mode.
- `public`: this template specifies the `public` folder to contain a single image, a snoo. while its cute, you can safely delete it.
- `splash`: this template specifies the `splash` folder to contain the code for the splash mode. basically the inline in the post.
  be careful because scrolling and guestures are forbidden in the inline feed.

except for `tsconfig.json` and `vite.config.ts` this folder is fully configuarble in layout [speculation].

## devvit-template-hello-world/src/server

this folder contains serverside code. the structure is less freeform than `devvit-template-hello-world/src/client`,
but can be edited.

### imports

in the `index.ts`, you will find

```ts
import express from "express";
import {
  InitResponse,
  IncrementResponse,
  DecrementResponse,
} from "../shared/types/api";
import {
  createServer,
  context,
  getServerPort,
  reddit,
  redis,
} from "@devvit/web/server";
import { createPost } from "./core/post";
```

you should keep `createServer`, `getServerPort`, and `express`, these are Required for devvit serverside to work.
the others can be configured.

### express config

you will also find this, while an more experienced [Express.js](https://expressjs.com/)
may be able to configure these, if you are not experienced (and even if you are)
you should keep these as is.

```ts
const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();
```

### express server activation

this code is Required for devvit to work. it basically activates your devvit web serveside.
while an more experienced [Express.js](https://expressjs.com/)
may be able to configure these, if you are not experienced (and
even if you are) you should keep these as is.

```ts
app.use(router);

const server = createServer(app);
server.on("error", (err) => console.error(`server error; ${err.stack}`));
server.listen(getServerPort());
```

### posting.

in devvit web server you will also find this.

```ts
import { reddit } from "@devvit/web/server";

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: "<% name %>",
  });
};
```

this is a basic posting utillity made by reddit and can be safely deleted.

while you could delete it, i ([u/antboiy](https://www.reddit.com/user/antboiy/)) suggest you use this instead

```ts
import { reddit } from "@devvit/web/server";

export const createPost = async (title) => await reddit.submitCustomPost({title});
;
```

### types on routes.

it may be cofusing what to put where on endpoints (or [u/antboiy](https://www.reddit.com/user/antboiy/) was dumb when writing this file).

[i encourage you to read this express Request documentation to understand what `_req` is cabale of](https://expressjs.com/en/5x/api.html#req)  
[and i also encourage you to read this express Response documentation to understand what `res` is cabale of](https://expressjs.com/en/5x/api.html#res)  
(these links link to express 5x, you may need others if devvit and express make new versions).

in this route, i have stripped boilerplate and only included the template specific imports

```ts
import { InitResponse, IncrementResponse, DecrementResponse} from "../shared/types/api";

router.get<{ postId: string }, InitResponse | { status: string; message: string }
>("/api/init", async (_req, res): Promise<void> => {/* ... */});
```

they expect `_req.body` to be of type `{ postId: string }`, and `res.json` to send either `InitResponse` or `{ status: string; message: string }`.
where `InitResponse` can be found at the imports and that links to `"../shared/types/api"`.

## devvit-template-hello-world/devvit.json

`devvit.json` is the main configuator of your devvit app.

## credits.

u/antboiy write this file only.
