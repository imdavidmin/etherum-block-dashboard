type TransactionProperties =
    | 'accessList'
    | 'blockHash'
    | 'blockNumber'
    | 'chainId'
    | 'from'
    | 'gas'
    | 'gasPrice'
    | 'hash'
    | 'input'
    | 'maxFeePerGas'
    | 'maxPriorityFeePerGas'
    | 'nonce'
    | 'r'
    | 's'
    | 'to'
    | 'transactionIndex'
    | 'type'
    | 'v'
    | 'value'
    | 'yParity'
type Transaction = Record<TransactionProperties, string>

type BlockProperties =
    | 'baseFeePerGas'
    | 'difficulty'
    | 'extraData'
    | 'gasLimit'
    | 'gasUsed'
    | 'hash'
    | 'logsBloom'
    | 'miner'
    | 'mixHash'
    | 'nonce'
    | 'number'
    | 'parentHash'
    | 'receiptsRoot'
    | 'sha3Uncles'
    | 'size'
    | 'stateRoot'
    | 'timestamp'
    | 'totalDifficulty'
    | 'transactions'
    | 'transactionsRoot'
    | 'uncles'
    | 'withdrawals'
    | 'withdrawalsRoot'

type WithdrawProperties = 'address' | 'amount' | 'index' | 'validatorIndex'

type Withdraw = Record<WithdrawProperties, string>

type Block = Record<
    Exclude<BlockProperties, 'transactions' | 'withdraws' | 'uncles'>,
    string
> & {
    transactions: Array<Transaction>
    withdraws: Array<Withdraw>
    uncles: Array<any>
}
