const Category = require("../models/Category");
const slugify = require("../utils/slugify");

const createCategory = async (req, res) => {
  try {
    const { name, active, order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = slugify(name);

    const exists = await Category.findOne({ slug });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      active: active === undefined ? true : active === "true" || active === true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, active, order } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name && name !== category.name) {
      const newSlug = slugify(name);
      const exists = await Category.findOne({
        slug: newSlug,
        _id: { $ne: category._id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.name = name;
      category.slug = newSlug;
    }

    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }

    if (active !== undefined) {
      category.active = active === "true" || active === true;
    }

    if (order !== undefined) {
      category.order = Number(order) || 0;
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getActiveCategories,
  updateCategory,
  deleteCategory,
};