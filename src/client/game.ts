import {
  ApiEndpoint,
  type DecrementRequest,
  type DecrementResponse,
  type IncrementRequest,
  type IncrementResponse,
  type InitResponse,
} from "../shared/api.ts";
import { navigateTo } from "@devvit/web/client";

const counterValueElement = document.getElementById(
  "counter-value",
) as HTMLSpanElement;
const incrementButton = document.getElementById(
  "increment-button",
) as HTMLButtonElement;
const decrementButton = document.getElementById(
  "decrement-button",
) as HTMLButtonElement;

const docsLink = document.getElementById("docs-link") as HTMLDivElement;
const playtestLink = document.getElementById("playtest-link") as HTMLDivElement;
const discordLink = document.getElementById("discord-link") as HTMLDivElement;

docsLink.addEventListener("click", () => {
  navigateTo("https://developers.reddit.com/docs");
});

playtestLink.addEventListener("click", () => {
  navigateTo("https://www.reddit.com/r/Devvit");
});

discordLink.addEventListener("click", () => {
  navigateTo("https://discord.com/invite/R7yu2wh9Qz");
});

const titleElement = document.getElementById("title") as HTMLHeadingElement;

let currentPostId: string | null = null;
const incrementAmount = 1;
const decrementAmount = 1;

async function fetchInitialCount() {
  try {
    const response = await fetch(ApiEndpoint.Init);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as InitResponse;
    if (data.type === "init") {
      counterValueElement.textContent = data.count.toString();
      currentPostId = data.postId; // Store postId for later use
      titleElement.textContent = `Hey ${data.username} 👋`;
    } else {
      console.error(`Invalid response type from ${ApiEndpoint.Init}`, data);
      counterValueElement.textContent = "Error";
    }
  } catch (error) {
    console.error("Error fetching initial count:", error);
    counterValueElement.textContent = "Error";
  }
}

async function updateCounter(action: "increment" | "decrement", amount = 1) {
  if (!currentPostId) {
    console.error("Cannot update counter: postId is not initialized.");
    // Optionally, you could try to re-initialize or show an error to the user.
    return;
  }

  const body =
    action === "increment"
      ? JSON.stringify({ amount } satisfies IncrementRequest)
      : JSON.stringify({ amount } satisfies DecrementRequest);
  try {
    const response = await fetch(
      action === "increment" ? ApiEndpoint.Increment : ApiEndpoint.Decrement,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // The server uses request context for post ID; amount comes from the body.
        body,
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as
      | IncrementResponse
      | DecrementResponse;
    counterValueElement.textContent = data.count.toString();
  } catch (error) {
    console.error(`Error ${action}ing count:`, error);
    // Optionally, display an error message to the user in the UI
  }
}

incrementButton.addEventListener("click", () =>
  updateCounter("increment", incrementAmount),
);
decrementButton.addEventListener("click", () =>
  updateCounter("decrement", decrementAmount),
);

// Fetch the initial count when the page loads
fetchInitialCount();
