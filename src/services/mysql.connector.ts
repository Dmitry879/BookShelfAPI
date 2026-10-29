import mysql from 'mysql2';
import type { Pool } from 'mysql2';
import type { PoolConnection } from 'mysql2/promise';

const { createPool } = mysql;

let pool: Pool | null = null;

const initializeMySqlConnector = () => {
  try {
    pool = createPool({
      connectionLimit:
        parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT != undefined ? process.env.MY_SQL_DB_CONNECTION_LIMIT : ""),
      port:
        parseInt(process.env.MY_SQL_DB_PORT != undefined ? process.env.MY_SQL_DB_PORT : ""),
      host: process.env.MY_SQL_DB_HOST,
      user: process.env.MY_SQL_DB_USER,
      password: process.env.MY_SQL_DB_PASSWORD,
      database: process.env.MY_SQL_DB_DATABASE
    });

    console.debug('MySql Adapter Pool generated successfully');
    console.log('process.env.DB_DATABASE', process.env.MY_SQL_DB_DATABASE);

    pool.getConnection((err, connection) => {
      if (err) {
        console.log('error mysql failed to connect');
        throw new Error('not able to connect to database');
      }
      else {
        console.log('connection made');
        connection.release();
      }
    });
  } catch (error) {
    console.error('[mysql.connector][initializeMySqlConnector][Error]: ', error);
    throw new Error('Failed to initialize pool');
  }
}

export const execute = <T>(query: string,
                           params: any[] | Record<string, any>,
                           connection?: PoolConnection): Promise<T> => {
  try {
    if (!pool) {
      initializeMySqlConnector();
    }
    return new Promise<T>((resolve, reject) => {

      if (connection) {
        connection.query(query, params)
          .then(([results]) => resolve(results as T))
          .catch(reject);
      } else {
        pool!.query(query, params, (error, results) => {
          if (error) reject(error);
          else resolve(results as T);
        });
      }

    });
  } catch (error) {
      console.error('[mysql.connector][execute][Error]', error);
      throw new Error('failed to execute MySQL query');
  }
}

export const getConnection = (): Promise<PoolConnection> => {
  if (!pool) {
    initializeMySqlConnector();
  }

  return pool!.promise().getConnection();
}