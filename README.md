# auth-service

## Installing

### Using npm:
```sh
$ npm install auth-service
```

## Example

Getting accountId from token (customer + merchant)
```js
const { AuthService, AuthenticationError, AccessTypes } = require('auth-service');

const authService = new AuthService({
  account: {
    adminKey: 'account admin key',
    baseURL: 'account base url',
  },
  core: {
    apiKey: 'core api key',
    baseURL: 'core base url',
    features: ['PERMISSION_ONE', 'PERMISSION_TWO'], // Required permissions to access resource
  },
  wallet: {
    apiKey: 'wallet api key',
    baseURL: 'wallet base url',
  },
});

// Customer + Merchant validation
authService.getAccountIdFromToken({
  accessToken: 'sessionToken yolo',
  balanceType: 'PAYLY',
}).then((accountId) => {
  console.log(accountId); // account id of access token
}).catch((err) => {
  if (err instanceof AuthenticationError) {
    console.log('Invalid token or insufficient permissions');
  } else {
    console.log('Unknown err', err);
  }
});

// Only customer validation
authService.getAccountIdFromToken({
  accessToken: 'sessionToken yolo',
  accessType: AccessTypes.Customer,
  balanceType: 'PAYLY',
});

// Only merchant validation
authService.getAccountIdFromToken({
  accessToken: 'coreAccessToken yolo',
  accessType: AccessTypes.Merchant,
  balanceType: 'PAYLY',
});
```

## Contributing

### Stack

| Responsability     | What        |
| ------------------ | ----------- |
| JS Spec            | ES6         |
| Code Standard      | ESLint      |
| Test Runner        | Mocha       |
| Cache              | Redis       |

### Installing and testing the app

```sh
$ npm install
$ npm run test
```

### Building production version
 
```sh
$ npm install
$ npm run build
```

The folder "lib" should be commited in master branch to install this package using git.

### ESLint

```sh
$ npm install
$ npm run lint
```
