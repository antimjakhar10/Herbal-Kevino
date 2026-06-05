const Order = require("../models/Order");
const Product = require("../models/Product");
const sendEmail = require("../utils/sendEmail");
const PDFDocument = require("pdfkit");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,

      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,

      paymentStatus,
    } = req.body;

    if (!orderItems?.length) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }
    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address required",
      });
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }
    }

    const updatedOrderItems = orderItems.map((item) => ({
      ...item,

      image: item.image?.startsWith("http")
        ? item.image
        : `http://localhost:5000/${item.image
            ?.replace(/\\/g, "/")
            .replace(/^\/+/, "")}`,
    }));

    const order = await Order.create({
      user: req.user._id,

      orderItems: updatedOrderItems,

      shippingAddress,

      paymentMethod,

      totalPrice,

      razorpayOrderId: razorpayOrderId || "",

      razorpayPaymentId: razorpayPaymentId || "",

      razorpaySignature: razorpaySignature || "",

      paymentStatus: paymentStatus || "Pending",

      isPaid: paymentMethod === "Razorpay",
    });

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock -= item.quantity;

        await product.save();
      }
    }

    await sendEmail({
      to: req.user.email,

      subject: "Order Placed Successfully",

      html: `
    <div style="font-family:sans-serif;padding:20px;">
      <h2 style="color:#155b37;">
        Order Confirmed 🎉
      </h2>

      <p>
        Hi ${req.user.name},
      </p>

      <p>
        Your order has been placed successfully.
      </p>

      <p>
        <strong>Order ID:</strong>
        ${order._id}
      </p>

      <p>
        <strong>Total:</strong>
        ₹${order.totalPrice}
      </p>

      <p>
        We'll notify you once your order is shipped.
      </p>

      <br />

      <p>
        Team Kevino Herbal 🌿
      </p>
    </div>
  `,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id).populate("user");

    await sendEmail({
      to: populatedOrder.user.email,

      subject: `Order ${status}`,

      html: `
    <div style="font-family:sans-serif;padding:20px;">
      <h2 style="color:#155b37;">
        Order Update 📦
      </h2>

      <p>
        Hi ${populatedOrder.user.name},
      </p>

      <p>
        Your order status is now:
      </p>

      <h3 style="color:#155b37;">
        ${status}
      </h3>

      <p>
        Order ID:
        ${order._id}
      </p>

      <br />

      <p>
        Thank you for shopping with Kevino Herbal 🌿
      </p>
    </div>
  `,
    });

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalRevenue = orders
      .filter((order) => order.orderStatus === "Delivered")
      .reduce((acc, item) => acc + item.totalPrice, 0);

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Pending",
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalPrice",
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = months.map((month, index) => {
      const found = monthlyRevenue.find((item) => item._id.month === index + 1);

      return {
        month,
        revenue: found ? found.revenue : 0,
      };
    });

    res.json({
      success: true,

      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
      },

      chartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`,
    );

    doc.pipe(res);

    // ==========================
    // LOGO
    // ==========================
    try {
      doc.image("uploads/logo.png", 40, 30, {
        width: 80,
      });
    } catch (err) {
      console.log("Logo not found");
    }

    // ==========================
    // COMPANY HEADER
    // ==========================
    doc
      .fontSize(28)
      .fillColor("#155b37")
      .text("Kevino Herbals & HealthCare", 140, 35);

    doc
      .fontSize(14)
      .fillColor("#666")
      .text("Trusted Herbal Wellness Products", 140, 72);

    // divider
    doc.moveTo(40, 120).lineTo(555, 120).strokeColor("#d9d9d9").stroke();

    // ==========================
    // INVOICE TITLE
    // ==========================
    doc.fontSize(24).fillColor("#155b37").text("INVOICE", 40, 140);

    // ==========================
    // INVOICE DETAILS
    // ==========================
    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Invoice No : ${order._id}`, 340, 145);

    doc.text(
      `Invoice Date : ${new Date(order.createdAt).toLocaleDateString()}`,
      340,
      225,
    );

   doc.text(`Order Status : ${order.orderStatus}`, 340, 185);

    // ==========================
    // BILL TO BOX
    // ==========================
    doc.roundedRect(40, 215, 250, 130, 8).stroke("#d9d9d9");

    doc.rect(40, 215, 250, 30).fill("#155b37");

    doc.fillColor("white").fontSize(13).text("BILL TO", 55, 224);

    doc
      .fillColor("black")
      .fontSize(11)
      .text(`Customer: ${order.shippingAddress.fullName}`, 55, 265);

    doc.text(`Phone: ${order.shippingAddress.phone}`);

    doc.text(`${order.shippingAddress.street}`);

    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`);

    doc.text(`${order.shippingAddress.pincode}`);

    // ==========================
    // SHIPPING BOX
    // ==========================
    doc.roundedRect(320, 215, 240, 130, 8).stroke("#d9d9d9");

    doc.rect(320, 215, 240, 30).fill("#155b37");

    doc.fillColor("white").fontSize(13).text("SHIPPING ADDRESS", 335, 224);

    doc
      .fillColor("black")
      .fontSize(11)
      .text(`${order.shippingAddress.street}`, 335, 265);

    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`);

    doc.text(`${order.shippingAddress.pincode}`);

    // ==========================
    // PRODUCTS TABLE
    // ==========================
    let y = 385;

    doc.rect(40, y, 520, 28).fill("#155b37");

    doc.fillColor("white").fontSize(11);

    doc.text("#", 55, y + 8);
    doc.text("PRODUCT", 90, y + 8);
    doc.text("QTY", 320, y + 8);
    doc.text("PRICE", 390, y + 8);
    doc.text("TOTAL", 480, y + 8);

    y += 40;

    let grandTotal = 0;

    order.orderItems.forEach((item, index) => {
      const total = item.price * item.quantity;

      grandTotal += total;

      doc.fillColor("black");

      doc.text(index + 1, 55, y);

      doc.text(item.name, 90, y, {
        width: 200,
      });

      doc.text(item.quantity, 330, y);

      doc.text(`Rs. ${item.price}`, 390, y);

      doc.text(`Rs. ${total}`, 470, y);

      y += 30;
    });

    // ==========================
    // TOTAL SECTION
    // ==========================

    y += 30;

    doc.moveTo(40, y).lineTo(555, y).strokeColor("#e5e5e5").stroke();

    y += 20;

    doc
      .fontSize(12)
      .fillColor("#444")
      .text(`Payment Method : ${order.paymentMethod}`, 40, y);

    doc.text(
      `Payment Status : ${order.isPaid ? "Paid" : "Pending"}`,
      40,
      y + 20,
    );

    doc
      .fontSize(18)
      .fillColor("#155b37")
      .text(`Total Amount : Rs. ${order.totalPrice}`, 0, y, {
        align: "right",
      });

    // ==========================
    // FOOTER
    // ==========================
    doc.moveTo(40, 735).lineTo(555, 735).strokeColor("#e5e5e5").stroke();

    doc
      .fontSize(12)
      .fillColor("#155b37")
      .text("Thank you for choosing Kevino Herbals & HealthCare", 40, 750, {
        align: "center",
      });

    doc
      .fontSize(9)
      .fillColor("#777")
      .text("SHYAMPUR AMBIWALA RANA CHOWK, Prem Nagar, Dehradun, Uttarakhand", {
        align: "center",
      });

    doc.text("+91 90684 53970 | kevinoherbalandhealthcare@gmail.com", {
      align: "center",
    });

    doc
      .fontSize(10)
      .fillColor("#666")
      .text("Kevino Herbals & HealthCare - Trusted Herbal Wellness Products", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    res.json({
      success: true,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  generateInvoice,
  createRazorpayOrder,
  verifyRazorpayPayment,
};
