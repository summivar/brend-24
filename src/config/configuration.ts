export default () => ({
  port: parseInt(process.env.PORT, 10) || 7777,
  swaggerTheme: process.env.SWAGGER_THEME,
  database: {
    URL: process.env.DATABASE_URL,
  },
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  cookieSecret: process.env.COOKIE_SECRET
});
