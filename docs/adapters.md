# Adapters

Adapters expose values derived from the Fastify instance.

They are **resolved once for each module that uses them**, ensuring the correct encapsulation context and state.
They must **NOT** register plugins, routes, or hooks - access to these APIs will be prohibited in the next major release.
Use **installers** for those operations.

## Examples

### Fastify version Adapter

```ts
import { createAdapter, createController } from "@stratify/core";

// Adapter that exposes the running Fastify version
export const VersionAdapter = createAdapter({
  expose: ({ fastify }) => fastify.version,
});

export const VersionController = createController({
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
import { createInstaller } from "@stratify/core";
import fastifyRedis from "@fastify/redis";

export const RedisInstaller = createInstaller({
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
import { createAdapter } from "@stratify/core";
import { redisInstaller } from "../installers/redis.installer";

export const RedisAdapter = createAdapter({
  expose: ({ fastify }) => fastify.redis,
});
```

## Limitations

Adapters cannot be injected into providers because they are scoped to Fastify.
If you are interested in creating official Stratify provider packages to replace
certain Fastify plugins, you can [open an issue](https://github.com/stratifyjs/core/issues/new).
