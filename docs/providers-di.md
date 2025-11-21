# 3) Providers (DI)

Providers are DI units that expose data or services.
They can depend on other providers and may define `onReady` and `onClose` hooks.

```js
import { createProvider } from "@stratify/core";

const usersRepository = createProvider({
  name: "usersRepository",
  expose: () => ({
    get: (id) => ({ id, name: "Ada" }),
  }),
});

// composed service depending on another provider
const profiles = createProvider({
  name: "profiles",
  deps: { usersRepository },
  expose: ({ usersRepository }) => ({
    find: async (id) => usersRepository.get(id),
  }),
  // optional hooks:
  // onReady: async ({ deps, value }) => {},
  // onClose: async ({ deps, value }) => {},
});
```

## `withProviders()`

All providers include a **`withProviders()`** helper.
It clones the provider and lets you replace specific dependencies, typically for unit testing.

```ts
const testProvider = profilesProvider.withProviders((deps) => ({
  ...deps,
  usersRepository: fakeUsersRepository,
}));

const profiles = await testProvider.resolve();
```

## Global Provider Overrides

Stratify supports global provider overrides when bootstrapping the app.

This is useful for integration and e2e tests where you need to
replace real dependencies with fakes without reconstructing your application tree.

Example of module:

```ts
const realPayment = createProvider({
  name: "payment",
  expose: () => ({ charge: () => "real" }),
});

const paymentController = createController({
  deps: { payment: realPayment },
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "GET",
      url: "/pay",
      handler: async () => deps.payment.charge(),
    });
  },
});

const paymentModule = createModule({
  name: "payment-module",
  controllers: [paymentController],
});
```

Then create the app with overrides:

```ts
const fakePayment = createProvider({
  name: "payment",
  expose: () => ({ charge: () => "fake" }),
});

const app = await createApp({
  root: paymentModule,
  overrides: [fakePayment],
});

const res = await app.inject({ method: "GET", url: "/pay" });
assert.strictEqual(res.body, "fake");
```
