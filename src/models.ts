import BigNumber from 'bignumber.js'

export type TTransaction = {
  Txhash: string
  Address: string
  DateTime: Date
  Amount: number
}

export enum ESortOrders {
  ASC = 'ASC',
  DESC = 'DESC',
}
