import { DataSource } from 'typeorm';
import { localEnv } from './EnvLoader';
import { Feedback } from '@entities/Feedback';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: localEnv.Postgres.Host,
    port: localEnv.Postgres.Port,
    username: localEnv.Postgres.Username,
    password: localEnv.Postgres.Password,
    database: localEnv.Postgres.DbName,
    synchronize: false,
    logging: false,
    entities: [
        Feedback
    ],
    migrations: [__dirname + '/migrations/*.ts'],
});
