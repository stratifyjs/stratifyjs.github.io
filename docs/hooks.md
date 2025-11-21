# 5) Hooks

Hooks are either **HTTP** (request lifecycle) or **application** (server lifecycle).

## HTTP hooks

```js
import { createHooks } from "@stratify/core";

const httpHooks = createHooks({
  type: "http",
  name: "core-http", // optional label
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
      // some setup...
    });

    builder.addHook("onClose", async () => {
      // closing resources...
    });
  },
});
```

Attach to a module:

```js
const root = createModule({
  name: "root",
  hooks: [httpHooks, appHooks],
});
```

Read more about Fastify application hooks: https://fastify.dev/docs/latest/Reference/Hooks/#application-hooks
