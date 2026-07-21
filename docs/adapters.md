# Adapters

Adapters expose values derived from the Fastify instance. They can read instance
information and access decorators added by external plugins, but they receive a
restricted, read-only view of Fastify.

They are **resolved once for each module that uses them**, ensuring the correct encapsulation context and state.

## Restricted Fastify access

Configuration and control APIs—such as plugin or route registration, hooks,
error handlers, and server lifecycle methods—are unavailable in TypeScript and
throw a `TypeError` at runtime. Use an [installer](./installers) whenever you
need unrestricted Fastify access.

## Examples

### Fastify version Adapter

```ts
import { adapter, controller } from "@stratify/core";

// Adapter that exposes the running Fastify version
export const VersionAdapter = adapter({
  expose: ({ fastify }) => fastify.version,
});

export const VersionController = controller({
  deps: { version: VersionAdapter },
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "GET",
      url: "/version",
      handler: async () => ({ version: deps.version }),
    });
  },
});
```

### `@fastify/redis` Adapter

First, register the `@fastify/redis` plugin via an installer:

```ts
// src/installers/redis.installer.ts
import { installer } from "@stratify/core";
import fastifyRedis from "@fastify/redis";

export const RedisInstaller = installer({
  name: "redis",
  install: async ({ fastify }) => {
    await fastify.register(fastifyRedis, {
      url: process.env.REDIS_URL,
    });
  },
});
```

> Must be registered at a higher level module with `encapsulate: false`

Registering the plugin has made the Redis client available via `fastify.redis`, so we can create
the adapter:
```ts
// src/adapters/redis.adapter.ts
import { adapter } from "@stratify/core";

export const RedisAdapter = adapter({
  expose: ({ fastify }) => fastify.redis,
});
```

## Limitations

Adapters cannot be injected into providers because they are scoped to Fastify.
If you are interested in creating official Stratify provider packages to replace
certain Fastify plugins, you can [open an issue](https://github.com/stratifyjs/core/issues/new).
