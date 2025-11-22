# Dependency Inversion Principle

Stratify supports architectures based on the **Dependency Inversion Principle**
through **contracts** and **bindings**.

* **Contracts** are special providers that define types but cannot be instantiated.
* **Bindings** are regular providers that use the same `name` as the contract they implement.

This guide shows how to create a `Mailer` contract and bind it to a concrete provider.

## Project structure

Create the following directory structure:

```bash
src/
  contracts/
    mailer.ts
  services/
    send-welcome-email.ts
  controllers/
    notifications.controller.ts
  bindings/
    smtp-mailer.ts
  modules/
    notifications.module.ts
    root.module.ts
  app.ts
```

Commands for macOS / Linux:

```bash
mkdir -p src/{contracts,services,controllers,bindings,modules}
touch src/app.ts
touch src/contracts/mailer.ts
touch src/services/send-welcome-email.ts
touch src/controllers/notifications.controller.ts
touch src/bindings/smtp-mailer.ts
touch src/modules/notifications.module.ts
touch src/modules/root.module.ts
```


## Contract

Declare the `Mailer` contract:

```ts
// src/contracts/mailer.ts
import { contract } from "@stratify/core";

export const MAILER_TOKEN = "mailer";

export const Mailer = contract<{
  send(to: string, body: string): void;
}>(MAILER_TOKEN);
```

## Domain service

Declare the `Mailer` contract as a dependency of `SendWelcomeEmail`, a domain service provider:

```ts
// src/services/send-welcome-email.ts
import { createProvider } from "@stratify/core";
import { Mailer } from "../contracts/mailer";

export const SendWelcomeEmail = createProvider({
  name: "send-welcome-email",
  deps: { mailer: Mailer },
  expose: ({ mailer }) => ({
    async execute(to: string) {
      mailer.send(to, "Welcome to Stratify!");
    },
  }),
});
```

## Controller

Create a controller that uses the `SendWelcomeEmail` service:

```ts
// src/controllers/notifications.controller.ts
import { createController } from "@stratify/core";
import { Type } from "@sinclair/typebox";
import { SendWelcomeEmail } from "../services/send-welcome-email";

export const NotificationsController = createController({
  name: "notifications",
  deps: { SendWelcomeEmail },
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "POST",
      url: "/welcome",
      schema: {
        body: Type.Object({ to: Type.String({ format: "email" }) }),
      },
      handler: async (req, reply) => {
        await deps.SendWelcomeEmail.execute(req.body.to);
        return { ok: true };
      },
    });
  },
});
```

## Concrete provider

Create a concrete provider `SmtpMailer` that implements the `Mailer` contract:

```ts
// src/bindings/smtp-mailer.ts
import { createProvider } from "@stratify/core";
import { MAILER_TOKEN, Mailer } from "../contracts/mailer";

export const SmtpMailer: typeof Mailer = createProvider({
  name: MAILER_TOKEN,
  expose: () => ({
    send(to: string, body: string) {
      console.log(`[SMTP] ${to} -> ${body}`);
    },
  }),
});
```

## Binding

Bind contracts to concrete providers at the module level:

```ts
// src/modules/notifications.module.ts
import { createModule } from "@stratify/core";
import { NotificationsController } from "../controllers/notifications.controller";
import { SmtpMailer } from "../bindings/smtp-mailer";

export const NotificationsModule = createModule({
  name: "notifications",
  controllers: [NotificationsController],
  bindings: [SmtpMailer], // binds the "mailer" contract to SmtpMailer
});
```

Root module:

```ts
// src/modules/root.module.ts
import { createModule } from "@stratify/core";
import { NotificationsModule } from "./notifications.module";

export const RootModule = createModule({
  name: "root",
  subModules: [NotificationsModule],
});
```

## Application

Application entrypoint (src/app.ts):

```ts
// src/app.ts
import { createApp } from "@stratify/core";
import { RootModule } from "./modules/root.module";

const app = await createApp({ root: RootModule });
await app.listen({ port: 3000 });
```
