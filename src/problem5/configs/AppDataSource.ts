import { DataSource } from 'typeorm';
import { localEnv } from './EnvLoader';
import { Feedback } from '../entities/Feedback';
import { Client } from 'pg';
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logLevel: string;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: localEnv.Postgres.Host,
    port: localEnv.Postgres.Port,
    username: localEnv.Postgres.Username,
    password: localEnv.Postgres.Password,
    database: localEnv.Postgres.DbName,
    logLevel: 'info'
  };
};

export const ensureDatabase = async (): Promise<void> => {
  const config = getDatabaseConfig();
  const isDebugMode = config.logLevel === 'debug';
  
  if (isDebugMode) {
    console.debug("Using DB connection: ", config.host, config.port, config.username, config.password, config.database);
  } else {
    console.info("Database connection configured");
  }

  const client = new Client(config);
  await client.connect();
  
  try {
    const checkDb = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [config.database]);
    if (checkDb.rowCount === 0) {
      await client.query(`CREATE DATABASE "${config.database}"`);
      if (isDebugMode) {
        console.debug(`Database '${config.database}' created.`);
      } else {
        console.info(`Database '${config.database}' created.`);
      }
    } else {
      if (isDebugMode) {
        console.debug(`Database '${config.database}' already exists.`);
      } else {
        console.info(`Database '${config.database}' already exists.`);
      }
    }
  } catch (err) {
    console.error('Error ensuring database:', err);
  } finally {
    await client.end();
  }
};

export const initializeDatabase = async (dataSource: DataSource): Promise<void> => {
  const config = getDatabaseConfig();
  const isDebugMode = config.logLevel === 'debug';

  if (typeof dataSource === 'object' && dataSource instanceof DataSource) {
    await dataSource.initialize();
    if (isDebugMode) {
      console.debug("Database connection established successfully");
    } else {
      console.info("Database connection established successfully");
    }
  } else {
    throw new Error('DataSource must be a DataSource instance.');
  }
};


export const AppDataSource = new DataSource({
    type: 'postgres',
    ...getDatabaseConfig(),
    synchronize: false,
    logging: false,
    entities: [
        Feedback
    ],
    migrations: [__dirname + '/migrations/*.ts'],
});
