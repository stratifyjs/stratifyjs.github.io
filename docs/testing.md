# Testing

Stratify supports two complementary testing strategies:

- resolve a provider directly for a focused unit test;
- create the application for integration or end-to-end tests that exercise
  module wiring, Fastify, provider overrides, and lifecycle hooks.

## Unit testing providers

Every provider exposes `withProviders()` and `resolve()`.
`withProviders()` creates a new provider definition with selected dependencies
replaced, leaving the production definition unchanged. `resolve()` builds that
provider and its dependency graph in an isolated container.

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { createProvider } from "@stratify/core";

const UsersRepository = createProvider({
  name: "users-repository",
  expose: () => ({
    find: async (id: string) => ({ id, name: "Production user" }),
  }),
});

const UsersService = createProvider({
  name: "users",
  deps: { usersRepository: UsersRepository },
  expose: ({ usersRepository }) => ({
    find: (id: string) => usersRepository.find(id),
  }),
});

test("finds a user", async () => {
  const FakeUsersRepository: typeof UsersRepository = createProvider({
    name: "users-repository",
    expose: () => ({
      find: async (id: string) => ({ id, name: "Test user" }),
    }),
  });

  const UsersServiceUnderTest = UsersService.withProviders((deps) => ({
    ...deps,
    usersRepository: FakeUsersRepository,
  }));

  const users = await UsersServiceUnderTest.resolve();

  assert.deepEqual(await users.find("user-1"), {
    id: "user-1",
    name: "Test user",
  });
});
```

Dependency replacements are provider definitions, not their exposed values.
TypeScript checks that the replacement exposes a compatible value.

Direct resolution does not bootstrap Fastify or run provider application
lifecycle hooks such as `onReady` and `onClose`. Use an application test when
those behaviors or module-level contract bindings are part of the scenario.

## Integration and end-to-end tests

Create the real module tree and pass replacement providers through
`createApp({ overrides })`. Overrides match providers by `name` and apply across
the complete application graph.

The following example keeps the provider inside a nested module, replaces its
repository, exercises the HTTP route with Fastify's `inject()`, and retrieves
the same application-scoped service through `app.ioc`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  createApp,
  createController,
  createModule,
  createProvider,
} from "@stratify/core";

const UsersRepository = createProvider({
  name: "users-repository",
  expose: () => ({
    list: async () => [{ id: "real-user", name: "Alice" }],
  }),
});

const UsersService = createProvider({
  name: "users",
  deps: { usersRepository: UsersRepository },
  expose: ({ usersRepository }) => ({
    list: () => usersRepository.list(),
  }),
});

const UsersController = createController({
  name: "users-controller",
  deps: { users: UsersService },
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "GET",
      url: "/users",
      handler: async () => deps.users.list(),
    });
  },
});

const UsersModule = createModule({
  name: "users-module",
  controllers: [UsersController],
});

const RootModule = createModule({
  name: "root",
  subModules: [UsersModule],
});

const FakeUsersRepository: typeof UsersRepository = createProvider({
  name: "users-repository",
  expose: () => ({
    list: async () => [{ id: "test-user", name: "Test user" }],
  }),
});

const createTestApp = () =>
  createApp({
    root: RootModule,
    overrides: [FakeUsersRepository],
  });

test("lists users", async (t) => {
  const app = await createTestApp();
  t.after(() => app.close());

  const response = await app.inject({
    method: "GET",
    url: "/users",
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), [
    { id: "test-user", name: "Test user" },
  ]);

  const users = await app.ioc.get(UsersService);
  assert.deepEqual(await users.list(), [
    { id: "test-user", name: "Test user" },
  ]);
});
```

`app.inject()` tests the HTTP boundary without opening a network socket. You can
use the same `createTestApp()` pattern in a test suite that starts the server for
full end-to-end requests. Always close the application so Fastify and provider
cleanup hooks run.

## Accessing providers through `app.ioc`

Passing the provider definition preserves its inferred return type:

```ts
const users = await app.ioc.get(UsersService);
```

You can also retrieve a provider by name. A string lookup returns `unknown` by
default, so provide the expected type when you need typed access:

```ts
const users = await app.ioc.get<Users>("users");
```

`get()` only resolves providers already registered in the application.
When a provider is not registered, both definition and string lookups reject
with a clear error.

The application container uses the same singleton cache and overrides as the
rest of the application. This makes `app.ioc` useful for checking provider
state, fakes, or spies after exercising a route while preserving the module
context of providers declared in nested modules.
