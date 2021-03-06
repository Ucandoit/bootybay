export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
    user: process.env.DATABASE_USER || 'mongodb',
    password: process.env.DATABASE_PASSWORD || 'mongodb',
    name: process.env.DATABASE_NAME || 'mongodb',
  },
  blizzData: {
    url: process.env.BLIZZ_DATA_URL || 'http://localhost:8001',
  },
});
