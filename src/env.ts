import * as dotenv from 'dotenv';




const result = dotenv.config();



export default {
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME.
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_POOL_MIN: process.env.DB_POOL_MIN,
  DB_POOL_MAX: process.env.DB_POOL_MAX,
}
