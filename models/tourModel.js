// Tour Model //
const mongoose = require('mongoose');
const { type } = require('os');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The tour most have name!'],
      unique: true,
      trim: true,
      maxLength: [40, 'the name should be less then or equle 40 chars!'],
      minLength: [10, 'the name should be more then or equle 10 chars!'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tours most hava a durations'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour most have a group size!'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour most have a diffivulty!'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'difficulty should be: easy, medium or hard!!',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'the rating should be more then or equle 1!'],
      max: [5, 'the rating should be less then or equle 5!'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'The tour most have price!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'price discount should be less then price!!',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour most have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour most have a cover image!'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log(this.name);
//   next();
// });

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`The query took about ${Date.now() - this.start} MS`);
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
