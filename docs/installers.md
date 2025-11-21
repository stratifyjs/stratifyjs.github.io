# 6) Installers

Installers configure Fastify for a module scope.
They run **after app hooks and before controllers**.
Use them to register external plugins (for example, sessions, CORS), compilers, validators, parsers, error handlers etc.

```js
import { createInstaller, createModule } from "@stratify/core";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

const sessionInstaller = createInstaller({
  name: "session",
  install: async ({ fastify }) => {
    // If you need to access decorators exposed by plugins
    // during build time, e.g. to create adapters.
    // You would have to await the registration:
    // await fastify.register
    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
      secret: "a secret with minimum length of 32 characters",
    });
  },
});

const root = createModule({
  name: "root",
  installers: [sessionInstaller],
});
```
