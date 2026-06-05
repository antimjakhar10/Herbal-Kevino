const ContactInfo = require("../models/ContactInfo");


// GET CONTACT INFO
const getContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();

    if (!info) {
      info = await ContactInfo.create({
        phone: "+91 90684 53970",
        email: "kevinoherbalandhealthcare@gmail.com",
        address: "SHYAMPUR AMBIWALA RANA CHOWK, Prem Nagar, Dehradun, Uttarakhand",
      });
    }

    res.json({
      success: true,
      info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE CONTACT INFO
const updateContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();

    if (!info) {
      info = await ContactInfo.create(req.body);
    } else {
      info.phone = req.body.phone;
      info.email = req.body.email;
      info.address = req.body.address;

      await info.save();
    }

    res.json({
      success: true,
      message: "Contact details updated",
      info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo,
};