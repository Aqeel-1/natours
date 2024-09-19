const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('../../models/tourModel');

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

// Reading Data from json data file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import data to mongodb
const importData = async () => {
  try {
    const newTours = await Tour.create(tours);
    console.log('data seccussfully imported to database!!');
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

// Delete old data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted from database!!');
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}