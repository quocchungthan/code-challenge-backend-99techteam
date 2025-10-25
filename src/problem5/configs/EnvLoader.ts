import 'dotenv/config';

export interface PostgresDbConfig {
    Host: string;
    Port: number;
    Username: string;
    Password: string;
    DbName: string;
}

export interface BasicAuthConfig {
    Username: string;
    Password: string;
}

export interface Env {
    Postgres: PostgresDbConfig;
    BasicUser: BasicAuthConfig; 
}

export const localEnv: Env = {
    Postgres: {
        Host: process.env.DB_HOST ?? '',
        Port: +(process.env.DB_PORT ?? '5432'),
        Username: process.env.DB_USERNAME ?? '',
        Password: process.env.DB_PASSWORD ?? '',
        DbName: process.env.DB_DATABASE ?? '',
    },
    BasicUser: {
        Username: process.env.BASIC_USERNAME ?? '',
        Password: process.env.BASIC_PASSWORD ?? '',
    }
}