# Providers

Providers are DI units that expose data or services.
They can depend on other providers and may define `onReady` and `onClose` hooks.

```js
import { createProvider } from "@stratify/core";

const UsersRepository = createProvider({
  name: "usersRepository",
  expose: () => ({
    get: (id) => ({ id, name: "Ada" }),
  }),
  // Optional hooks:
  onReady: async ({ deps, value }) => { /* Some setup */},
  onClose: async ({ deps, value }) => { /* Some cleanup */},
});

// Domain service depending on another provider
const Profiles = createProvider({
  name: "profiles",
  // You can also do `deps: { UsersRepository }`
  deps: { usersRepo: UsersRepository },
  expose: ({ usersRepo }) => ({
    find: async (id) => usersRepo.get(id),
  }),
});
```

## Encapsulation

Providers are not encapsulated within a specific module scope but managed globally by the DI container.

The same applies to any hooks they define.
This is why a provider cannot declare `onReady`/`onClose` hooks (global scope) and [contract](./dip) dependencies (bound at module scope) at the same time.

## Testing

### Local Provider Overrides

All providers include a **`withProviders()`** method.
It clones the provider and lets you replace specific dependencies, typically for unit testing.

```ts
const ProfileTestProvider = ProfilesProvider.withProviders((deps) => ({
  ...deps,
  usersRepository: fakeUsersRepository,
}));

const profiles = await ProfileTestProvider.resolve();
```

### Global Provider Overrides

Stratify supports global provider overrides when bootstrapping the app.

This is useful for integration and e2e tests where you need to
replace real dependencies with fakes without reconstructing your application tree.

Example of module with real payment provider:

```ts
const RealPayment = createProvider({
  name: "payment",
  expose: () => ({ charge: () => "real" }),
});

const PaymentController = createController({
  deps: { payment: RealPayment },
  build: ({ builder, deps }) => {
    builder.addRoute({
      method: "GET",
      url: "/pay",
      handler: async () => deps.payment.charge(),
    });
  },
});

const PaymentModule = createModule({
  name: "payment-module",
  controllers: [PaymentController],
});
```

Then create the app with overrides:

```ts
const FakePayment = createProvider({
  name: "payment",
  expose: () => ({ charge: () => "fake" }),
});

const app = await createApp({
  root: PaymentModule,
  overrides: [FakePayment],
});

const res = await app.inject({ method: "GET", url: "/pay" });
assert.strictEqual(res.body, "fake");
```
