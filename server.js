const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
  })
  .catch((err) => {
    console.error(err);
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
app.listen(port, () => {
  console.log(`Start listening on ${port}...`);
});
