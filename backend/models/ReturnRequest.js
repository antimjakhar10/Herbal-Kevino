const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    type: {
      type: String,
      enum: ["Return", "Exchange"],
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Requested",
        "Approved",
        "Pickup Scheduled",
        "Product Received",
        "Refunded",
        "Exchange Shipped",
        "Completed",
        "Rejected",
      ],
      default: "Requested",
    },

    refundStatus: {
      type: String,
      enum: ["Pending", "Processed"],
      default: "Pending",
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundMethod: {
      type: String,
      default: "",
    },

    refundTransactionId: {
      type: String,
      default: "",
    },

    bankDetails: {
      accountHolderName: {
        type: String,
        default: "",
      },

      bankName: {
        type: String,
        default: "",
      },

      accountNumber: {
        type: String,
        default: "",
      },

      ifscCode: {
        type: String,
        default: "",
      },

      upiId: {
        type: String,
        default: "",
      },
    },

    adminNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReturnRequest",
  returnRequestSchema
);