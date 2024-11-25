require('dotenv').config({ path: '../expenseapppassword/.env' });
const Sib = require("sib-api-v3-sdk");

// Initialize Brevo API client
const client = Sib.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

/**
 * Sends an email using Brevo's transactional email API.
 *
 * @param {Object} options - Email sending options.
 * @param {Object} options.sender - The sender information (email and name).
 * @param {Array} options.to - Array of recipient objects { email: string }.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.textContent - The HTML content of the email.
 */
exports.sendEmail = async ({ email, subject, textContent }) => {
  const sender = {
    email: "dharshanikaan@gmail.com", // Sender email
    name: "Donation",
  };

  try {
    // Sending transactional email using Brevo API
    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email }],
      subject,
      textContent,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.body : error.message);
    throw new Error("Failed to send email");
  }
};
