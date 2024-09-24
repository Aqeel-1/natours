const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name);
  console.log('============');
  console.log(err.message);
  console.log('Shutting down....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Global database connection //
const DB = process.env.DATABASE.replace('<DB_PWD>', process.env.DATABASE_PWD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection success!');
  });
// Global database connection //

// Local database connection //
/* const DB = process.env.DATABASE_LOCAL.replace(
  '<USERNAME>',
  process.env.DATABASE_LOCAL_USER
).replace('<DB_PWD>', process.env.DATABASE_LOCAL_PWD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected!!'))
  .catch((err) => {
    console.error(err);
  });
*/
// Local database connection //
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Start listening on ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name);
  console.log('===================');
  console.log(err.message);
  server.close(() => {
    console.log('Closing server...');
    process.exit(1);
  });
});
