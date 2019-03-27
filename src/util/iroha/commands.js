import {
  commands
} from 'iroha-helpers'

import {
  newCommandServiceOptions
} from './util'

const createAccount = (privateKeys, quorum, {
  accountName,
  domainId,
  publicKey
}) => commands.createAccount(
  newCommandServiceOptions(privateKeys, quorum), {
    accountName,
    domainId,
    publicKey
  }
)

const createAsset = (privateKeys, quorum, {
  assetName,
  domainId,
  precision
}) => commands.createAsset(
  newCommandServiceOptions(privateKeys, quorum), {
    assetName,
    domainId,
    precision
  }
)

const transferAsset = (privateKeys, quorum, {
  srcAccountId,
  destAccountId,
  assetId,
  description,
  amount
}) => commands.transferAsset(
  newCommandServiceOptions(privateKeys, quorum), {
    srcAccountId,
    destAccountId,
    assetId,
    description,
    amount
  }
)

const addSignatory = (privateKeys, quorum, {
  accountId,
  publicKey
}) => commands.addSignatory(
  newCommandServiceOptions(privateKeys, quorum), {
    accountId,
    publicKey
  }
)

const removeSignatory = (privateKeys, quorum, {
  accountId,
  publicKey
}) => commands.removeSignatory(
  newCommandServiceOptions(privateKeys, quorum), {
    accountId,
    publicKey
  }
)

const addAssetQuantity = (privateKeys, quorum, {
  assetId,
  amount
}) => commands.addAssetQuantity(
  newCommandServiceOptions(privateKeys, quorum), {
    assetId,
    amount
  }
)

const setAccountDetail = (privateKeys, quorum, {
  accountId,
  key,
  value
}) => commands.setAccountDetail(
  newCommandServiceOptions(privateKeys, quorum), {
    accountId,
    key,
    value
  }
)

const setAccountQuorum = (privateKeys, currentQuorum, {
  accountId,
  quorum
}) => commands.setAccountQuorum(
  newCommandServiceOptions(privateKeys, currentQuorum), {
    accountId,
    quorum
  }
)

export {
  createAccount,
  createAsset,
  transferAsset,
  addSignatory,
  removeSignatory,
  addAssetQuantity,
  setAccountDetail,
  setAccountQuorum
}
