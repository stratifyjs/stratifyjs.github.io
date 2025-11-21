# 2) Bootstrapping

```js
import { createApp } from "@stratify/core";

const app = await createApp({ root });
await app.listen({ port: 3000 });
```

## Using a Custom Fastify Instance

You can provide your own Fastify instance with custom configuration:

```js
import Fastify from "fastify";
import { createApp } from "@stratify/core";

const fastifyInstance = Fastify({});

const app = await createApp({ fastifyInstance, root });
await app.listen({ port: 3000 });
```

## Inspecting the Application Tree

Stratify applications can describe their internal module and dependency hierarchy through the **`describeTree()`** utility.

This function produces a human-readable text representation of the **module tree**, including submodules, hooks, installers, controllers, adapters, and providers.

```ts
import { createApp, createModule } from "@stratify/core";

const root = createModule({
  name: "root",
  subModules: [
    createModule({ name: "child" }),
    createModule({ name: "sibling" }),
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
