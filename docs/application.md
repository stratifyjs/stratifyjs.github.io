# Application

## Standard Stratify application

This returns a Fastify application on which [`fastify.ready()`](https://fastify.dev/docs/latest/Reference/Server/#ready) has been called.


```js
import { createApp } from "@stratify/core";

const app = await createApp({ 
  root, // Every application as a root module
  serverOptions: {}, // Optional Fastify options
  overrides: {}, // Optional providers to override
});

await app.listen({ port: 3000 });
```

## Using a custom Fastify instance

You can provide your own Fastify instance.
But remember that Stratify calls `fastify.ready()` internally.

```js
import Fastify from "fastify";
import { createApp } from "@stratify/core";

const fastifyInstance = Fastify({
  // Server options
});

// Some configuration...

const app = await createApp({ fastifyInstance, root });
await app.listen({ port: 3000 });
```

## Inspecting the Application Tree

Stratify applications can describe their internal module and dependency hierarchy through the **`describeTree()`** utility.

This function produces a human-readable text representation of the **module tree**, including submodules, hooks, installers, controllers, adapters, and providers.

```ts
import { createApp, mod } from "@stratify/core";

const root = mod({
  name: "root",
  subModules: [
    mod({ name: "child" }),
    mod({ name: "sibling" }),
  ],
});

const app = await createApp({ root });

console.log(app.describeTree());
```

### Example output

```
🌳 mod root@m1 (encapsulate=true)
  📦 mod child@m2 (encapsulate=true)
  📦 mod sibling@m3 (encapsulate=true)
```

### Full hierarchy display

When modules include **hooks, installers, controllers, adapters, and providers**, `describeTree()` shows each layer with dependency nesting:

```
🌳 mod root@m1 (encapsulate=true)
  📦 mod sibling@m2 (encapsulate=false)
    ⚙️ installer a
      🔧 prov siblingProv@p1
    ⚙️ installer b
    🧭 controller a
      🔌 adp siblingAdapter
      🔧 prov siblingDependent@p2
        🔧 prov siblingProv@p1
```

## Testing the application

The returned Fastify instance exposes the application container through
`app.ioc`. It lets integration and end-to-end tests retrieve providers that are
registered in the application, including providers used by nested modules.

See [Testing](./testing) for provider unit tests, application overrides,
type-safe provider access, and Fastify injection examples.
