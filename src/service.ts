import BigNumber from 'bignumber.js'
import { readFileSync } from 'fs'
import { TTransaction } from './models'

export function readFromFile(filePath: string): string {
  const fileContent: string = readFileSync(filePath, { encoding: 'utf-8' })
  return fileContent
}
function convertRawStringArrayToTransaction(
  headers: (keyof TTransaction)[],
  line: string[] | undefined,
): Partial<TTransaction> {
  try {
    if (!line) {
      throw new Error('CSV file is not formatted correctly')
    }
    return line.reduce(
      (transaction: Partial<TTransaction>, item: string, index: number) => {
        if (headers[index] == 'Address') {
          transaction.Address = item
        } else if (headers[index] === 'Amount') {
          const stringNumberArray = item.match(/[^"]*[^"]/g)
          const stringNumber = stringNumberArray
            ? (stringNumberArray[0] as string).replaceAll(',', '')
            : 'NAN'
          if (stringNumber === 'NAN') {
            throw new Error('CSV number is not formatted correctly')
          }
          transaction.Amount = parseFloat(stringNumber)
        } else if (headers[index] === 'DateTime') {
          transaction.DateTime = new Date(item)
        } else if (headers[index] === 'Txhash') {
          transaction.Txhash = item
        }
        return transaction
      },
      {} as Partial<TTransaction>,
    )
  } catch (error) {
    throw error
  }
}

export function convertToArray(fileContents: string): TTransaction[] {
  try {
    const fileCOntentLineByLine = fileContents.split('\r\n')
    if (fileCOntentLineByLine.length === 0) {
      throw new Error('CSV file is empty')
    }
    const headers: (keyof TTransaction)[] = fileCOntentLineByLine[0].split(
      ',',
    ) as (keyof TTransaction)[]
    if (headers.length === 0) {
      throw new Error('Headers should seprated by "," at the first line')
    }
    const regex = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))/g
    if (fileCOntentLineByLine.length <= 1) {
      throw new Error('CSV file has not any data')
    }
    const allTransactionInputs = fileCOntentLineByLine.slice(1)
    const allTransactionInputsSepratedByColumn = allTransactionInputs.map(
      (rawTransaction: string) =>
        rawTransaction.match(regex)?.filter((item) => item.length > 0),
    )
    if (allTransactionInputsSepratedByColumn.length === 0) {
      throw new Error('CSV format is not correct')
    }
    const items: Partial<
      TTransaction
    >[] = allTransactionInputsSepratedByColumn.map(
      convertRawStringArrayToTransaction.bind(null, headers),
    )
    return items as TTransaction[]
  } catch (error) {
    throw error
  }
}
