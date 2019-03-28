# Iroha Wallet


[![npm version](https://img.shields.io/npm/v/iroha-helpers.svg)](https://www.npmjs.com/package/iroha-helpers)
[![Iroha 1.0.0-rc5](https://img.shields.io/badge/Iroha-1.0.0--rc5-red.svg)](https://github.com/hyperledger/iroha/releases/tag/1.0.0_rc5)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)

Iroha Wallet is an example wallet application for [Iroha](http://iroha.readthedocs.io/).

Iroha Wallet has following features:

1. Login with your Iroha account.
2. See your assets and transactions.
3. Transfer your assets to another Iroha account.

![iroha-wallet](https://user-images.githubusercontent.com/1365915/42019575-72e1d60c-7af0-11e8-9a49-8c019548efdc.png)

## Getting Started

### Prerequisites

First, you need to have an Iroha instance working. You can read how to launch it on [Iroha's docs](http://iroha.readthedocs.io/en/latest/getting_started/index.html). In this guide we assume the local Iroha instance working at `localhost:50051`.

Also we provide docker that you can easily run and use.
```bash
docker-compose -f docker/docker-compose.yaml up
```

Then, populate the database by our example script as below. The script will create new account `alice@test` and several new assets. Note that there already exist `admin@test`. Their keys are in `scripts/`.
Note that you need to complete "Installation" steps in advance if you want to use the example script.

```
 % node scripts/setup.js
```

### Installation

Install npm packages.

```bash
# install dependencies
yarn install
```

### Running

To run application

```bash
yarn serve
```