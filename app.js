const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorControllers');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
