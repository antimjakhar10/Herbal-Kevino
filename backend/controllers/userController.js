const User = require("../models/User");
const Product = require("../models/Product");

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

    const exists = user.wishlist.includes(productId);

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    res.json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variant, price, mrp } = req.body;

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) =>
        item.product.toString() === productId && item.variant === variant,
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: quantity || 1,
        variant,
        price,
        mrp,
      });
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate("cart.product");

    res.json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;

    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (item) =>
        item.product.toString() === productId && item.variant === variant,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;

    await user.save();

    const updatedUser = await User.findById(user._id).populate("cart.product");

    res.json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, variant } = req.body;

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) =>
        !(item.product.toString() === productId && item.variant === variant),
    );

    await user.save();

    const updatedUser = await User.findById(user._id).populate("cart.product");

    res.json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = [];

    await user.save();

    res.json({
      success: true,
      cart: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getUsers,
  deleteUser,
};
