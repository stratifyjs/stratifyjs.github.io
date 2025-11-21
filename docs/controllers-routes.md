# 4) Controllers (Routes)

Controllers declare routes via a builder.
They can consume providers and adapters.

Stratify routes builder natively support [@sinclair/typebox](https://github.com/sinclairzx81/typebox), so request
types are automatically inferred from your schema definitions.

```js
import { createController } from "@stratify/core";
import { Type } from "@sinclair/typebox";

const userController = createController({
  // optional name (used for diagnostics)
  name: "user",
  // optional dependency maps
  deps: { profiles },
  adaps: {},
  // async build callback with routes builder
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "GET",
      url: "/users/:id",
      schema: {
        // optional TypeBox schema (fully inferred)
        params: Type.Object({ id: Type.String() }),
      },
      // Handlers must be async
      handler: async (req) => {
        const id = req.params.id; // inferred as `string`
        return deps.profiles.find(id);
      },
    });
  },
});
```

Attach to a module:

```js
const root = createModule({
  name: "root",
  controllers: [userController],
});
```
