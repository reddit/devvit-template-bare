## Devvit Bare Template

A practical [Devvit](https://developers.reddit.com/) app template with few dependencies. A little simpler at the expense of a little code.

## Getting Started

> Make sure you have Node 22 downloaded on your machine before running!

1. Run `npm create devvit@latest --template=bare`
2. Go through the installation wizard. You will need to create a Reddit account and connect it to Reddit Developers.

## Commands

- `npm run playtest [r/sub]`: watches changes, builds, uploads, and installs on Reddit. Accepts an optional subreddit.
- `npm run build`: builds client and server, including esbuild metafiles.
- `npm run clean`: removes build outputs.
- `npm run test`: runs all tests.
- `npm run format`: fixes lints and formatting.
- `npm run lint`: checks lints and formatting.
- `npm run publish`: cleans, builds, uploads, and files a new app review request.

## Features

- A plain Node.js server with front and backend typing.
- Tests using the builtin Node.js test runner.
- Promise misuse linter.
- Formatter and bundler.
- TypeScript project skeleton split by environment (frontend, backend, test, etc).
