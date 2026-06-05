const Testimonial = require("../models/Testimonial");

const createTestimonial = async (req, res) => {
  try {
    const { name, role, message, rating, active, order } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required",
      });
    }

    const testimonial = await Testimonial.create({
      name,
      role,
      message,
      rating: Number(rating) || 5,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      active: active === undefined ? true : active === "true" || active === true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const { name, role, message, rating, active, order } = req.body;

    if (name !== undefined) testimonial.name = name;
    if (role !== undefined) testimonial.role = role;
    if (message !== undefined) testimonial.message = message;
    if (rating !== undefined) testimonial.rating = Number(rating) || 5;
    if (order !== undefined) testimonial.order = Number(order) || 0;

    if (active !== undefined) {
      testimonial.active = active === "true" || active === true;
    }

    if (req.file) {
      testimonial.image = `/uploads/${req.file.filename}`;
    }

    await testimonial.save();

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await testimonial.deleteOne();

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTestimonial,
  getTestimonials,
  getAdminTestimonials,
  updateTestimonial,
  deleteTestimonial,
};