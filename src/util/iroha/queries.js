import { queries } from 'iroha-helpers'
import { newQueryServiceOptions } from './util'

const getAccount = ({
  accountId
}) => queries.getAccount(
  newQueryServiceOptions(), {
    accountId
  }
)

const getAccountAssets = ({
  accountId
}) => queries.getAccountAssets(
  newQueryServiceOptions(), {
    accountId
  }
)

const getAccountDetail = ({
  accountId,
  key,
  writer
}) => queries.getAccountDetail(
  newQueryServiceOptions(), {
    accountId,
    key,
    writer
  }
)

const getAccountTransactions = ({
  accountId,
  pageSize,
  firstTxHash
}) => queries.getAccountTransactions(
  newQueryServiceOptions(), {
    accountId,
    pageSize,
    firstTxHash
  }
)

const getAccountAssetTransactions = ({
  accountId,
  assetId,
  pageSize,
  firstTxHash
}) => queries.getAccountAssetTransactions(
  newQueryServiceOptions(), {
    accountId,
    assetId,
    pageSize,
    firstTxHash
  }
)

const getSignatories = ({
  accountId
}) => queries.getSignatories(
  newQueryServiceOptions(), {
    accountId
  }
)

const getRawPendingTransactions = () => queries.getRawPendingTransactions(
  newQueryServiceOptions()
)

const getAssetInfo = ({
  assetId
}) => queries.getAssetInfo(
  newQueryServiceOptions(), {
    assetId
  }
)

export {
  getAccount,
  getAccountAssets,
  getAccountAssetTransactions,
  getAccountTransactions,
  getAccountDetail,
  getSignatories,
  getRawPendingTransactions,
  getAssetInfo
}
