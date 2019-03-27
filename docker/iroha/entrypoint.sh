#!/bin/sh
#while ! curl http://wallet-js-iroha-postgres:5432/ 2>&1 | grep '52'
#do
#done
sleep 10
irohad --genesis_block genesis.block --config config.docker --keypair_name $KEY --overwrite-ledger
