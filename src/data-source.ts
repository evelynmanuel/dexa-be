import { DataSource, DataSourceOptions } from 'typeorm'
import { databaseConfig } from './config/database.config'

const { ...connectionOptions } = databaseConfig

const cliConfig: DataSourceOptions = {
  ...(connectionOptions as DataSourceOptions),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  logging: true,
}

export const AppDataSource = new DataSource(cliConfig)
