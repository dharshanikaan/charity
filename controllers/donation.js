require('dotenv').config({ path: '../expenseapppassword/.env' });

const Donation = require("../models/donation");
const Razorpay = require("razorpay");
const User = require('../models/user');
const Project = require("../models/project");
const sequelize = require("../utils/database");
const Email = require("../services/emailService");

const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");

require('dotenv').config({ path: '../expenseapppassword/.env' });

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
      amount: amount * 100,  // Amount should be in paise for Razorpay
      currency: "INR",
    });

    await Donation.create(
      {
        amount,  // Store the amount in INR (not paise)
        projectId,
        userId: user,
        status: "pending",
        order_id: Order.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({
      message: "Donation created successfully",
      Order
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateTransactionManually = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id } = req.body;

  try {
    // Find the donation record using the razorpay_order_id
    const donation = await Donation.findOne({
      where: { order_id: razorpay_order_id },
    });

    // Check if the donation record exists
    if (!donation) {
      console.log('Order not found');
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the donation is already marked as "paid"
    if (donation.status === "paid") {
      return res.status(400).json({ message: "This donation has already been paid." });
    }

    // Update the donation's status and payment_id
    donation.payment_id = razorpay_payment_id;  // Save the payment ID
    donation.status = "paid";  // Change status to "paid"
    await donation.save();  // Save the donation with updated status

    // Log successful payment update
    console.log('Payment successful for order ID:', razorpay_order_id);
    console.log('Updated order status to "paid"');

    // Update the project donations total
    const currDonation = await Project.findOne({
      where: { id: donation.projectId },
    });

    if (currDonation) {
      // Add the donation amount to the project's current donations
      currDonation.currentDonations += donation.amount;  // No need to divide by 100 if donation.amount is in INR

   
      await currDonation.save(); // Save the updated currentDonations

      // Log the updated donations value
      console.log(`Updated project donations for project ID: ${currDonation.id}, new total: ₹${currDonation.currentDonations}`);
    }

    // Send an email notification to the user
    const user = await User.findOne({ where: { id: donation.userId } });
    if (user) {
      // Sending a success email to the donor
      await Email.sendEmail({
        email: user.email,
        subject: "Donation Successful",
        textContent: `Your donation of ₹${donation.amount.toFixed(2)} has been successfully received. Thank you for your support!`,
      });
      console.log(`Email sent to user: ${user.email}`);
    }

    // Respond to the client
    res.status(200).json({ message: "Donation updated successfully", status: "paid" });
  } catch (error) {
    console.log('Error during transaction update:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getDonation = async (req, res) => {
  try {
    const userId = req.user.id;

    const donations = await Donation.findAll({
      where: { userId },
      attributes: ["id", "order_id", "amount", "status", "createdAt"],
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
