const Donation = require("../models/donation");
const Razorpay = require("razorpay");
const Project = require("../models/project");
const sequelize = require("../utils/database");
const dotenv = require("dotenv");
const Email = require("../services/emailService");


const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createDonation = async (req, res) => {
  const { amount, projectId } = req.body;
  const user = req.user.id;
  const t = await sequelize.transaction();

  try {
    const Order = await razorpay.orders.create({
      amount: amount ,
      currency: "INR",
  
    });

    await Donation.create(
      {
        amount,
        projectId,
        userId: user,
        status: "pending",
        order_id: Order.id,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(200).json({
      message: "Donation created successfully", Order});
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    // validate the payment signature
    const isValidSignature = await validateWebhookSignature(
      razorpay_order_id + "|" + razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValidSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // find the order and update payment details
    const order = await Donation.findOne({
      where: { order_id: razorpay_order_id },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.payment_id = razorpay_payment_id;
    order.status = "paid";
    await order.save();

    // update the current donations of the project
    const currDonation = await Project.findOne({
      where: { id: order.projectId },
    });
    currDonation.currentDonations += order.amount;
    await currDonation.save();
    
    // send email to the user
    const user = await user.findOne({
      where: { id: order.userId },
    });
    Email.sendEmail({ email: user.email, subject: "Donation Successfull", textContent: "Your Donation has been received successfully. Thank you for your support!" });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDonation = async (req, res) => {
  try {
    const userId = req.user.id;

    const donations = await Donation.findAll({
      where: { userId },
      attributes: ["id","order_id" ,"amount", "status", "createdAt"],

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ userId, donations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDonationHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const donations = await Donation.findAll({
      where: { userId },
      attributes: ["order_id", "amount", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Project,
          attributes: ["title", "description"],
        },
      ],
    });

    res.status(200).json({ userId, donations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};