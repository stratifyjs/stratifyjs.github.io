# 8) Architectures Based on the Dependency Inversion Principle (DIP)

Stratify supports architectures that rely on the **Dependency Inversion Principle (DIP)**
through its **contract providers**.

## 8.1 Declaring a Contract

Contracts are special providers that define types but cannot be instantiated:

```ts
import { contract } from "@stratify/core";

export const MAILER_TOKEN = "mailer";

export const Mailer = contract<{
  send(to: string, body: string): void;
}>(MAILER_TOKEN);
```

If a contract is used but not bound in its module, Stratify throws an error.

```ts
import { createProvider, createModule, createApp } from "@stratify/core";
import { Mailer } from "./mailer";

const sendWelcome = createProvider({
  name: "send-welcome",
  deps: { mailer: Mailer },
  expose: ({ mailer }) => ({
    run(email: string) {
      mailer.send(email, "Welcome!");
    },
  }),
});

const welcomeController = createController({
  deps: { sendWelcome },
  build: () => {},
});

const root = createModule({
  name: "root",
  controllers: [welcomeController],
  bindings: [], // No binding for "mailer"
});

await createApp({ root });
```

## 8.2 Creating a Binding

A **binding** is simply a regular provider that uses the same `name` as the contract.
It can be declared anywhere, just like any other provider.

```ts
import { createProvider } from "@stratify/core";
import { MAILER_TOKEN, Mailer } from "../contracts/mailer";

export const smtpMailer: typeof Mailer = createProvider({
  name: MAILER_TOKEN,
  expose: () => ({
    send(to: string, body: string) {
      console.log(`[SMTP] ${to} -> ${body}`);
    },
  }),
});
```

## 8.3 Declaring Dependencies as Contracts

You can now declare your dependencies as **contracts**:

```ts
import { createProvider } from "@stratify/core";
import { Mailer } from "../contracts/mailer";

export const sendWelcomeEmail = createProvider({
  name: "send-welcome-email",
  deps: { mailer: Mailer },
  expose: ({ mailer }) => ({
    async execute(to: string) {
      mailer.send(to, "Welcome to Stratify!");
    },
  }),
});
```

## 8.4 Binding

Then, you must bind contracts to specific providers via the `bindings` property:

```ts
import { createController, createModule, createApp } from "@stratify/core";
import { Type } from "@sinclair/typebox";
import { sendWelcomeEmail } from "../use-cases/send-welcome-email";
import { smtpMailer } from "../adapters/smtp-mailer";

export const notificationsController = createController({
  name: "notifications",
  deps: { sendWelcomeEmail },
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "POST",
      url: "/welcome",
      schema: {
        body: Type.Object({ to: Type.String({ format: "email" }) }),
      },
      handler: async (req, reply) => {
        await deps.sendWelcomeEmail.execute(req.body.to);
        return { ok: true };
      },
    });
  },
});

const notificationsModule = createModule({
  name: "notifications",
  controllers: [notificationsController],
  bindings: [smtpMailer], // binds the "mailer" contract to smtpMailer
});

const root = createModule({
  name: "root",
  subModules: [notificationsModule],
});

const app = await createApp({ root });
await app.listen({ port: 3000 });
```

---
