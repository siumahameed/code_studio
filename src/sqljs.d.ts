declare module 'sql.js' {
  const initSqlJs: (config?: { locateFile: (file: string) => string }) => Promise<{
    Database: new () => {
      run(sql: string): void
      prepare(sql: string): {
        getColumnNames(): string[]
        step(): boolean
        getAsObject(): Record<string, unknown>
        free(): void
      }
    }
  }>
  export default initSqlJs
}
