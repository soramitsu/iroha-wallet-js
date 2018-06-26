# iroha-wallet-js

An example wallet application for [Iroha](http://iroha.readthedocs.io/).
This version is compatible with [Iroha 1.0 beta-3](https://github.com/hyperledger/iroha/releases/tag/v1.0.0_beta-3).

## Getting Started

### Prerequisites

* Launch a local Iroha instance.
  * [2. Getting Started — Iroha 1.0 beta documentation](http://iroha.readthedocs.io/en/latest/getting_started/index.html)
* Populate the database by our example script.
```
node example/setup-accounts-and-assets.js
```

### Build Setup

``` bash
# install dependencies
yarn install

# rebuild native modules for Electron environment
yarn rebuild

# serve with hot reload
yarn serve:electron

# build electron application for production
# See [electron-builder docs](https://www.electron.build/multi-platform-build) for multi platform build
yarn build:electron

# run unit test
yarn test:unit

# lint all JS/Vue component files in `src/`
yarn lint
```

---

This project was generated with [vue-cli 3](https://github.com/vuejs/vue-cli) and [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder).
