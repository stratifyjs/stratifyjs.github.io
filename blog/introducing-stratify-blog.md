---
title: Introducing the Stratify Blog
description: Why we built Stratify for Fastify teams, how it keeps your architecture predictable, and a quick example to get running.
date: 2024-04-02
---

# Introducing the Stratify Blog

Welcome! Stratify started as a way to give Fastify teams opinionated structure without giving up the ecosystem they already love. This blog is where we will share release notes, migration tips, and battle-tested patterns you can drop into production.

## Why Stratify Exists

- Fastify is fast and flexible, but large codebases need guardrails for dependency management.
- Decorators and manual typing often hide errors until runtime; we wanted first-class type safety.
- Teams need a DI container that is easy to test and easy to override in isolated scenarios.

Stratify gives you installers and adapters so you stay compatible with the Fastify ecosystem, plus a strongly typed dependency graph that enforces the Dependency Inversion Principle out of the box.

## A Quick Tour

Here is a minimal, typed setup that wires a data provider into a controller:

```ts
// contracts/userContract.ts
export type UserContract = {
  list(): Promise<Array<{ id: string; email: string }>>;
};

// providers/userProvider.ts
import { bind } from "@stratify/core";
import { UserContract } from "../contracts/userContract";

export const userProvider = bind<UserContract>("user-provider", {
  async list() {
    return [
      { id: "u1", email: "ada@lovelace.dev" },
      { id: "u2", email: "lin@turing.dev" },
    ];
  },
});

// controllers/userController.ts
import { controller } from "@stratify/core";
import { UserContract } from "../contracts/userContract";

export const userController = controller(({ get }) => ({
  route: "/users",
  method: "GET",
  async handler(request, reply) {
    const users = await get<UserContract>("user-provider").list();
    return reply.send(users);
  },
}));

// application.ts
import { createApp } from "@stratify/core";
import { userProvider } from "./providers/userProvider";
import { userController } from "./controllers/userController";

export const app = createApp({
  providers: [userProvider],
  controllers: [userController],
});

app.listen({ port: 3000 });
```

This example shows how Stratify keeps contracts and implementations explicit, so tests can override the `user-provider` binding without touching the controller.

## What to Expect Next

In upcoming posts we will cover:

- Patterns for installers that preserve compatibility with community plugins.
- Testing strategies that swap providers with mocks in a single line.
- Migration notes for teams moving from decorator-heavy architectures.

Have a topic you want us to explore? [Open an issue](https://github.com/stratifyjs/stratify) and let us know.
