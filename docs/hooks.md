# Hooks

Hooks factories declare Fastify hooks via a hooks builder.
They can inject [providers](./providers) and [adapters](./adapters) as dependencies.

Hooks are either **HTTP** (request lifecycle) or **application** (server lifecycle).

Stratify enforces `AsyncFunction` usage to avoid the `done` callback pattern supported by
Fastify, ensuring a consistent promise-based execution model.

## HTTP hooks

```js
import { createHooks } from "@stratify/core";

const httpHooks = createHooks({
  // Optional name (used by tree printer)
  name: "core-http",
  type: "http",
  // Optional dependency maps
  deps: { profiles },
  // Optional adapters maps
  adaps: {},
  build: ({ builder }) => {
    // All handlers must be async.
    builder.addHook("onRequest", async (req, reply) => {
      if (!req.headers.authorization) {
        return reply.code(401).send({ error: "Unauthorized" });
      }
    });

    builder.addHook("onResponse", async (_req, reply) => {
      reply.header("x-content-type-options", "nosniff");
    });
  },
});
```

Read more about Fastify lifecycle hooks doc: https://fastify.dev/docs/latest/Reference/Hooks/#requestreply-hooks

## Application hooks

```js
const appHooks = createHooks({
  type: "app",
  name: "lifecycle",
  build: ({ builder }) => {
    builder.addHook("onReady", async () => {
      // Some setup...
    });

    builder.addHook("onClose", async () => {
      // Closing resources...
    });
  },
});
```

Read more about Fastify application hooks: https://fastify.dev/docs/latest/Reference/Hooks/#application-hooks

## Attach to a module

```js
const root = createModule({
  name: "root",
  hooks: [httpHooks, appHooks],
});
```

