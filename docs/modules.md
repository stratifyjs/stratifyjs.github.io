# Module

A Stratify app is a **tree of modules**.
Each module can include controllers, hooks, installers, and submodules.

```js
import { createModule } from "@stratify/core";

const RootModule = createModule({
  name: "root", // Required unique name
  encapsulate: true, // Encapsulate the module (default: true)
  controllers: [], // HTTP controllers (routes)
  hooks: [], // Application or HTTP lifecycle hooks
  installers: [], // Install Fastify utilities (plugins, compilers, parsers, etc.)
  subModules: [], // Nested modules (domain composition)
});
```

Each module is compiled into a Fastify plugin within its own [**encapsulation context**](https://fastify.dev/docs/latest/Reference/Encapsulation/). Unlike Fastify, Stratify handles dependencies through its own container, so encapsulation does not govern DI.
