import { FILE_NAME, FILE_PATH } from './constant'
import { ESortOrders, TTransaction } from './models'
import { convertToArray, readFromFile } from './service'
const sortOrder: ESortOrders = ESortOrders.ASC
const walletAddressToSearch: string =
  '0x21a31ee1afc51d94c2efccaa2092ad1028285549'
async function main() {
  try {
    const rawTransactionData: string = readFromFile(FILE_PATH + FILE_NAME)
    const allTransactions: TTransaction[] = convertToArray(rawTransactionData)
    allTransactions.sort(
      (item: TTransaction, nextItem: TTransaction) =>
        (sortOrder === ESortOrders.DESC ? 1 : -1) *
        (item.DateTime.getTime() - nextItem.DateTime.getTime()),
    )
    const foundTransactions: TTransaction[] = allTransactions.filter(
      (transaction: TTransaction) =>
        transaction.Address === walletAddressToSearch,
    )
    console.log('Wallet Address transactions are: ', foundTransactions)
    console.log(
      `Total: ${allTransactions.length}, found transactions: ${foundTransactions.length}, wallet to Search: ${walletAddressToSearch}`,
    )
  } catch (error) {
    //TODO handle each error sepratly
    console.error((error as Error).message ? (error as Error).message : error)
  }
}

main()
