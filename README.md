# Iroha Wallet

[![Iroha 1.0 beta-3](https://img.shields.io/badge/iroha-1.0.0--beta3-e2232d.svg?style=flat-square)](https://github.com/hyperledger/iroha/releases/tag/v1.0.0_beta-3)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)

Iroha Wallet is an example wallet application for [Iroha](http://iroha.readthedocs.io/).
This version is compatible with [Iroha 1.0 beta-3](https://github.com/hyperledger/iroha/releases/tag/v1.0.0_beta-3).

Iroha Wallet has following features:

1. Login with your Iroha account.
2. See your assets and transactions.
3. Transfer your assets to another Iroha account.

![dashboard](https://user-images.githubusercontent.com/1365915/42013908-6de21254-7ada-11e8-99eb-ace8a9cff171.png)

## Getting Started

### Prerequisites

First, you need to have an Iroha instance working. You can read how to launch it on [Iroha's docs](http://iroha.readthedocs.io/en/latest/getting_started/index.html). In this guide we assume the local Iroha instance working at `localhost:50051`.

Then, populate the database by our example script. The script will create new account `alice@test` and new assets `coolcoin#test` and `hotcoin#test`. Note that there already exist `admin@test`. Their keys are in `example/`.

```
 % node example/setup-accounts-and-assets.js
alice@test has successfully been created
coolcoin#test (precision: 2) has successfully been created
hotcoin#test (precision: 5) has successfully been created
```

### Installation

Install npm packages.

```bash
# install dependencies
yarn install

# rebuild native modules for Electron environment
yarn rebuild
```

### Development

Launch an Electron app in development mode.

```bash
yarn serve:electron
```

### Package and build an Electron app

Since Iroha Wallet is built with Electron, you can package an Electron app for distribution. The following command generates installers in `dist_electron/`.

```bash
yarn build:electron
```

See [electron-builder's docs](https://www.electron.build/multi-platform-build) for build options.

## Running the tests

Run unit tests and lint js files.

```bash
# run unit test
yarn test:unit

# lint all JS/Vue component files in `src/`
yarn lint
```

## Technologies

* [Iroha v1.0.0-beta3](http://iroha.readthedocs.io/)
* [Electron 2](https://electronjs.org/)
* [vue-cli 3](https://github.com/vuejs/vue-cli)
* [webpack 4](https://github.com/webpack/webpack)
* [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder)
* [JavaScript Standard Style](https://github.com/standard/standard)

## License

Iroha Wallet codebase is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
