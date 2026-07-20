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

Use `withProviders()` and `resolve()` to replace dependencies and exercise a
provider in isolation. For integration and end-to-end tests, bootstrap the
application with global overrides and access registered providers through
`app.ioc`.

See [Testing](./testing) for complete examples and the differences between both
strategies.
