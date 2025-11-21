# 1) Create a Module

A Stratify app is a **tree of modules**. Each module can include controllers, hooks, installers, and submodules.

```js
import { createModule } from "@stratify/core";

const root = createModule({
  name: "root", // required unique name
  encapsulate: true, // encapsulate the module (default: true)
  controllers: [], // HTTP controllers (routes)
  hooks: [], // application or HTTP lifecycle hooks
  installers: [], // install Fastify utilities (plugins, compilers, parsers, etc.)
  subModules: [], // nested modules (domain composition)
});
```

## Encapsulation

Each module is compiled into a Fastify plugin within its own [**encapsulation context**](https://fastify.dev/docs/latest/Reference/Encapsulation/). Unlike Fastify, Stratify handles dependencies through its own container, so encapsulation mainly governs hooks and adapters scope, not DI.
