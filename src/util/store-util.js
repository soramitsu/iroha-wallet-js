import _ from 'lodash'

export function getTransferAssetsFrom (transactions, accountId, settlements = []) {
  if (_.isEmpty(transactions)) return []

  const transformed = []

  transactions.forEach(t => {
    const { commandsList, createdTime } = t.payload.reducedPayload

    commandsList.forEach(c => {
      if (!c.transferAsset) return

      const {
        amount,
        assetId,
        destAccountId,
        srcAccountId,
        description
      } = c.transferAsset

      const tx = {
        from: srcAccountId === accountId ? 'you' : srcAccountId,
        to: destAccountId === accountId ? 'you' : destAccountId,
        amount: amount,
        date: createdTime,
        currency: assetId,
        message: description
      }

      transformed.push(tx)
    })
  })

  /*
    * As actions.getAccountTransactions() does, we fetch account's txs
    * by multiple getAccount*Asset*Transactions calls.
    *
    * Also, getAccount*Asset*Transactions returns txs each of which includes
    * one or more command(s), which possibly includes also commands issued
    * against different asset.
    *
    * Therefore, when merging transactions for multiple assets, duplication
    * possibly occurs.
    * e.g.
    *    accountAssetTransactions_of_asset_A = [
    *      { commands: [command_for_asset_A_1, command_for_asset_B_1] },
    *      { commands: [command_for_asset_A_2] }
    *    ]
    *    accountAssetTransactions_of_asset_B = [
    *      { commands: [command_for_asset_A_1, command_for_asset_B_1] }
    *    ]
    *    // -> command_for_asset_A_1 and B_1 duplicates!
    *
    * To avoid it, we uniq the transactions.
    */
  return _(transformed)
    .chain()
    .uniqWith(_.isEqual)
    .sortBy('date')
    .reverse()
    .value()
}
