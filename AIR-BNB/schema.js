/*const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(), // ✅ fixed spelling
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null)
  }).required()
});
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listings: Joi.object({   // ✅ plural (VERY IMPORTANT)
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null)
  }).required()
});*/
const Joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = Joi.object({
  listings: Joi.object({

    title: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters",
      }),

    description: Joi.string()
      .min(10)
      .required()
      .messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 10 characters",
      }),

    location: Joi.string()
      .pattern(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.pattern.base": "Location must contain only letters",
        "string.empty": "Location is required",
      }),

    country: Joi.string()
      .pattern(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.pattern.base": "Country must contain only letters",
        "string.empty": "Country is required",
      }),

    price: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.base": "Price must be a number",
        "number.min": "Price must be greater than 0",
      }),

    image: Joi.string()
      .uri()
      .allow("", null)
      .messages({
        "string.uri": "Image must be a valid URL",
      })

  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required(),
});