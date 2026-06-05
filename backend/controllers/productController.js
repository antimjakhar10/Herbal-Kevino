const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("../utils/slugify");
const Order = require("../models/Order");

const safeJsonParse = (value, fallback = []) => {
  try {
    if (!value) return fallback;
    if (Array.isArray(value)) return value;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const makeBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return value === true || value === "true";
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      shortDescription,
      description,
      variantOptions,
      benefits,
      ingredients,
      howToUse,
      productDetails,
      faq,
      variants,
      shippingInfo,
      extraFeatures,
      price,
      mrp,
      stock,
      badge,
      tags,
      rating,
      reviewsCount,
      reviews,
      isBestSeller,
      isNewArrival,
      featured,
      active,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let slug = slugify(name);
    const exists = await Product.findOne({ slug });

    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const images = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const product = await Product.create({
      name,
      slug,
      category,
      shortDescription,
      description,
      benefits: safeJsonParse(benefits),
      ingredients: safeJsonParse(ingredients),
      howToUse,
      productDetails: safeJsonParse(productDetails),
      faq: safeJsonParse(faq),
      variantOptions: safeJsonParse(variantOptions),
      shippingInfo: safeJsonParse(shippingInfo),
      extraFeatures: safeJsonParse(extraFeatures),
      price: Number(price),
      mrp: Number(mrp) || 0,
      stock: Number(stock) || 0,
      images,
      badge,
      tags: safeJsonParse(tags),
      rating: Number(rating) || 5,
      reviewsCount: Number(reviewsCount) || 0,
      reviews: safeJsonParse(reviews),
      isBestSeller: makeBoolean(isBestSeller),
      isNewArrival: makeBoolean(isNewArrival),
      featured: makeBoolean(featured),
      active: makeBoolean(active, true),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      active: true,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category?._id,
      active: true,
    })
      .populate("category", "name slug")
      .limit(4)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const fields = req.body;

    if (fields.name && fields.name !== product.name) {
      product.name = fields.name;
      product.slug = `${slugify(fields.name)}-${Date.now()}`;
    }

    [
      "category",
      "shortDescription",
      "description",
      "howToUse",
      "badge",
    ].forEach((key) => {
      if (fields[key] !== undefined) product[key] = fields[key];
    });

    ["price", "mrp", "stock", "rating", "reviewsCount"].forEach((key) => {
      if (fields[key] !== undefined) product[key] = Number(fields[key]) || 0;
    });

    ["isBestSeller", "isNewArrival", "featured", "active"].forEach((key) => {
      if (fields[key] !== undefined) {
        product[key] = makeBoolean(fields[key]);
      }
    });

    if (fields.benefits !== undefined) {
      product.benefits = safeJsonParse(fields.benefits);
    }

    if (fields.ingredients !== undefined) {
      product.ingredients = safeJsonParse(fields.ingredients);
    }

    if (fields.tags !== undefined) {
      product.tags = safeJsonParse(fields.tags);
    }

    if (fields.productDetails !== undefined) {
      product.productDetails = safeJsonParse(fields.productDetails);
    }

    if (fields.faq !== undefined) {
      product.faq = safeJsonParse(fields.faq);
    }

    if (fields.reviews !== undefined) {
  product.reviews = safeJsonParse(fields.reviews);
}

    if (fields.variantOptions !== undefined) {
  product.variantOptions = safeJsonParse(
    fields.variantOptions
  );
}

    if (fields.shippingInfo !== undefined) {
      product.shippingInfo = safeJsonParse(fields.shippingInfo);
    }

    if (fields.extraFeatures !== undefined) {
      product.extraFeatures = safeJsonParse(fields.extraFeatures);
    }

    if (req.files?.length) {
      product.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug"
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addReview = async (
  req,
  res
) => {
  try {
    const {
      rating,
      message,
    } = req.body;

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    const hasPurchased =
      await Order.findOne({
        user: req.user._id,

        orderItems: {
          $elemMatch: {
            product:
              product._id,
          },
        },

        orderStatus:
          "Delivered",
      });

    if (!hasPurchased) {
      return res.status(400).json({
        success: false,
        message:
          "You can review only purchased products",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (review) =>
          review.user?.toString() ===
          req.user._id.toString()
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message:
          "You already reviewed this product",
      });
    }

    const newReview = {
      user: req.user._id,

      name: req.user.name,

      role: "Verified Buyer",

      rating:
        Number(rating) || 5,

      message,

      date:
        new Date().toLocaleDateString(),
    };

    product.reviews.push(
      newReview
    );

    product.reviewsCount =
      product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      ) /
      product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message:
        "Review added successfully",

      reviews:
        product.reviews,

      rating:
        product.rating,

      reviewsCount:
        product.reviewsCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReview = async (
  req,
  res
) => {
  try {
    const {
      productId,
      reviewId,
    } = req.params;

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    product.reviews =
      product.reviews.filter(
        (review) =>
          review._id.toString() !==
          reviewId
      );

    product.reviewsCount =
      product.reviews.length;

    product.rating =
      product.reviews.length
        ? product.reviews.reduce(
            (acc, item) =>
              acc +
              item.rating,
            0
          ) /
          product.reviews.length
        : 0;

    await product.save();

    res.json({
      success: true,
      message:
        "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getAdminProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
};