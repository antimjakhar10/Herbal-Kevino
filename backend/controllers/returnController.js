const ReturnRequest = require("../models/ReturnRequest");

const Order = require("../models/Order");

const Product = require("../models/Product");

// CREATE RETURN / EXCHANGE REQUEST
const createReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, quantity, type, reason } = req.body;

    if (!orderId || !productId || !type || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // SECURITY CHECK
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ONLY DELIVERED
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be returned or exchanged",
      });
    }

    // RETURN WINDOW
    const deliveredDate = new Date(order.updatedAt);

    const currentDate = new Date();

    const differenceInDays = Math.floor(
      (currentDate - deliveredDate) / (1000 * 60 * 60 * 24),
    );

    if (differenceInDays > 7) {
      return res.status(400).json({
        success: false,
        message: "Return period expired",
      });
    }

    // CHECK PRODUCT EXISTS IN ORDER
    const orderedItem = order.orderItems.find(
      (item) => item.product.toString() === productId,
    );

    if (!orderedItem) {
      return res.status(400).json({
        success: false,
        message: "Product not found in this order",
      });
    }

    // CHECK EXISTING REQUEST
    const existingRequest = await ReturnRequest.findOne({
      order: orderId,
      product: productId,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already submitted for this product",
      });
    }

    const request = await ReturnRequest.create({
      user: req.user._id,

      order: orderId,

      product: productId,

      quantity: quantity || 1,

      refundAmount: orderedItem.price * (quantity || 1),

      bankDetails: req.body.bankDetails || {},

      type,

      reason,
    });

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// USER REQUESTS
const getMyReturnRequests = async (req, res) => {
  try {
    const requests = await ReturnRequest.find({
      user: req.user._id,
    })
      .populate("product", "name images price")
      .populate("order")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN REQUESTS
const getAdminReturnRequests = async (req, res) => {
  try {
    const requests = await ReturnRequest.find()
      .populate("user", "name email")
      .populate("product", "name images price")
      .populate("order")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE REQUEST
const updateReturnRequest = async (req, res) => {
  try {
    const request = await ReturnRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const oldStatus = request.status;

    request.status = req.body.status || request.status;

    request.adminNote = req.body.adminNote || request.adminNote;

    if (req.body.status === "Refunded") {
      request.refundStatus = "Processed";
    }

    if (
  req.body.refundMethod &&
  req.body.refundTransactionId
) {
  request.refundStatus = "Processed";

  if (
    request.status === "Product Received" ||
    request.status === "Approved" ||
    request.status === "Pickup Scheduled"
  ) {
    request.status = "Refunded";
  }
}

    request.refundMethod = req.body.refundMethod || request.refundMethod;

    request.refundTransactionId =
      req.body.refundTransactionId || request.refundTransactionId;

    // RESTORE STOCK
    if (
      oldStatus !== "Product Received" &&
      req.body.status === "Product Received"
    ) {
      const product = await Product.findById(request.product);

      if (product) {
        product.stock += request.quantity;

        await product.save();
      }
    }

    await request.save();

    res.json({
      success: true,
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReturnRequest,
  getMyReturnRequests,
  getAdminReturnRequests,
  updateReturnRequest,
};
