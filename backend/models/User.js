const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
{
  product:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
  },

  quantity:{
    type:Number,
    default:1
  },

  variant:{
    type:String,
    default:""
  },

  price:{
    type:Number,
    default:0
  },

  mrp:{
    type:Number,
    default:0
  }
},
{ _id:false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: "India",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
      default: "",
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    cart: [cartItemSchema],

    addresses: [addressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);