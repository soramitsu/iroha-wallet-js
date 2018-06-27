# Iroha Wallet

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Dependency Status](https://david-dm.org/soramitsu/iroha-wallet-js.svg)](https://david-dm.org/soramitsu/iroha-wallet-js)
[![Iroha 1.0 beta-3](https://img.shields.io/badge/iroha-1.0.0--beta3-e2232d.svg)](https://github.com/hyperledger/iroha/releases/tag/v1.0.0_beta-3)

Iroha Wallet is an example wallet application for [Iroha](http://iroha.readthedocs.io/).
This version is compatible with [Iroha 1.0 beta-3](https://github.com/hyperledger/iroha/releases/tag/v1.0.0_beta-3).

![summary](https://user-images.githubusercontent.com/1365915/41962365-cefd72fa-7a2f-11e8-9717-86e416deb2b4.png)

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



## Contributing

## License

Iroha Wallet codebase is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
