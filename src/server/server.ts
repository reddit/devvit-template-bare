import type { IncomingMessage, ServerResponse } from "node:http";
import { context, reddit, redis } from "@devvit/web/server";
import type { PartialJsonValue, UiResponse } from "@devvit/web/shared";
import {
  ApiEndpoint,
  type DecrementResponse,
  type IncrementResponse,
  type InitResponse,
} from "../shared/api.ts";

export async function serverOnRequest(
  req: IncomingMessage,
  rsp: ServerResponse,
): Promise<void> {
  try {
    await onRequest(req, rsp);
  } catch (err) {
    const msg = `server error; ${err instanceof Error ? err.stack : err}`;
    console.error(msg);
    writeJSON<ErrorResponse>(500, { error: msg, status: 500 }, rsp);
  }
}

async function onRequest(
  req: IncomingMessage,
  rsp: ServerResponse,
): Promise<void> {
  const path = req.url?.split("?")[0] ?? "";

  let body: ApiResponse | UiResponse | ErrorResponse;
  switch (path) {
    case ApiEndpoint.Init:
      body = await onInit();
      break;
    case ApiEndpoint.Increment:
      body = await onIncrement();
      break;
    case ApiEndpoint.Decrement:
      body = await onDecrement();
      break;
    case "/internal/menu/post-create":
      body = await onMenuNewPost();
      break;
    default:
      body = { error: "not found", status: 404 };
      break;
  }

  writeJSON<PartialJsonValue>("status" in body ? body.status : 200, body, rsp);
}

type ApiResponse = InitResponse | IncrementResponse | DecrementResponse;

type ErrorResponse = {
  error: string;
  status: number;
};

function getPostId(): string {
  if (!context.postId) {
    throw Error("no post ID");
  }
  return context.postId;
}

function getPostCountKey(postId: string): string {
  return `count:${postId}`;
}

async function onInit(): Promise<InitResponse> {
  const postId = getPostId();
  const count = Number((await redis.get(getPostCountKey(postId))) ?? 0);
  return {
    type: "init",
    postId,
    count,
    username: context.username ?? "user",
  };
}

async function onIncrement(): Promise<IncrementResponse> {
  const postId = getPostId();
  const count = Number(await redis.incrBy(getPostCountKey(postId), 1));
  return {
    type: "increment",
    postId,
    count,
  };
}

async function onDecrement(): Promise<DecrementResponse> {
  const postId = getPostId();
  const count = Number(await redis.incrBy(getPostCountKey(postId), -1));
  return {
    type: "decrement",
    postId,
    count,
  };
}

async function onMenuNewPost(): Promise<UiResponse> {
  const post = await reddit.submitCustomPost({ title: context.appName });
  return {
    showToast: { text: `Post ${post.id} created.`, appearance: "success" },
    navigateTo: post.url,
  };
}

function writeJSON<T extends PartialJsonValue>(
  status: number,
  json: Readonly<T>,
  rsp: ServerResponse,
): void {
  const body = JSON.stringify(json);
  const len = Buffer.byteLength(body);
  rsp.writeHead(status, {
    "Content-Length": len,
    "Content-Type": "application/json",
  });
  rsp.end(body);
}
