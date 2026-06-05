const Policy = require("../models/Policy");

const savePolicy = async (req, res) => {
  try {
    const { type, title, content } = req.body;

    let policy = await Policy.findOne({ type });

    if (policy) {
      policy.title = title;
      policy.content = content;

      await policy.save();
    } else {
      policy = await Policy.create({
        type,
        title,
        content,
      });
    }

    res.json({
      success: true,
      message: "Policy saved successfully",
      policy,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      type: req.params.type,
    });

    res.json({
      success: true,
      policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  savePolicy,
  getPolicy,
};