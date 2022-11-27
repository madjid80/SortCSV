export const FILE_NAME = process.env.FILE_NAME ?? 'transactions.csv'
export const FILE_PATH =
  __dirname + '..\\' + (process.env.RELATIVE_FILE_PATH ?? '..\\')
