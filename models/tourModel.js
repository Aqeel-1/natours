// Tour Model //
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The tour most have name!'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tours most hava a durations']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour most have a group size!']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour most have a diffivulty!']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number, 
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'The tour most have price!'],
  },
  priceDiscount: Number,
  summary: {
    type: String, 
    trim: true, 
    required: [true, 'A tour most have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour most have a cover image!']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
