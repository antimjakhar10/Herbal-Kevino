const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },

    benefits: [{ type: String }],
    ingredients: [{ type: String }],
    howToUse: { type: String, default: "" },

    productDetails: [
      {
        title: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],

    faq: [
      {
        question: { type: String, default: "" },
        answer: { type: String, default: "" },
      },
    ],
    
    variantOptions: [
  {
    name: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    mrp: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
],
    shippingInfo: [{ type: String }],
    extraFeatures: [{ type: String }],

    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    images: [{ type: String }],

    badge: { type: String, default: "" },
    tags: [{ type: String }],

    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [
  {
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
    name: { type: String, default: "" },
    role: { type: String, default: "Verified Buyer" },
    message: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    date: { type: String, default: "" },
  },
],

    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);