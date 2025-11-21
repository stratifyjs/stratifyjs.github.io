# 7) Adapters

Adapters expose values derived from the Fastify instance.

They are **resolved once for each module that uses them**, ensuring the correct encapsulation context and state. It follows that they should **NOT** register plugins, routes, or hooks; use **installers** for those actions.

## Example: version adapter

```js
import { createAdapter, createController, createModule } from "@stratify/core";

// Adapter that exposes the running Fastify version
const version = createAdapter({
  expose: ({ fastify }) => fastify.version,
});

// Controller consuming the adapter
const versionController = createController({
  adaps: { version },
  build: ({ builder, adaps }) => {
    builder.addRoute({
      method: "GET",
      url: "/version",
      handler: async () => ({ version: adaps.version }),
    });
  },
});

// Attach to a module
const root = createModule({
  name: "root",
  controllers: [versionController],
});
```
