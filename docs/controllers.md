# Controllers

Controllers declare Fastify routes via a route builder.
They can inject [providers](./providers) and [adapters](./adapters) as dependencies.

The route builder natively support [@sinclair/typebox](https://github.com/sinclairzx81/typebox), so request
types are automatically inferred from your schema definitions.

Stratify enforces `AsyncFunction` for handlers and hooks to avoid the `done` callback pattern supported by
Fastify, ensuring a consistent promise-based execution model.

```js
import { createController } from "@stratify/core";
import { Type } from "@sinclair/typebox";

const UsersController = createController({
  // Optional name (used by tree printer)
  name: "users",
  // Optional dependency maps
  deps: { profiles },
  // Optional adapters maps
  adaps: {},
  // async build callback with routes builder
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "GET",
      url: "/users/:id",
      schema: {
        // Optional TypeBox schema
        params: Type.Object({ id: Type.String() }),
      },
      // Handlers must be async
      handler: async (req) => {
        const id = req.params.id; // Type is inferred as `string`
        return deps.profiles.find(id);
      },
    });
  },
});
```

## Attach to a module

```js
const UsersModule = createModule({
  name: "users",
  controllers: [UsersController],
});
```
