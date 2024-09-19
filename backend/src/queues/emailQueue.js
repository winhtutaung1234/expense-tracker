const Queue = require("bull");
const sendEmail = require("../utils/auth/sendEmail");

const sendEmailQueue = new Queue("email sending", {
  redis: { port: 6379, host: "127.0.0.1" },
}); // Specify Redis connection using object

sendEmailQueue.process(async (job) => {
  try {
    await sendEmail({
      from: "expensetacker.com",
      to: job.data.email,
      subject: "email verification",
      url: job.data.url,
    });
  } catch (error) {
    console.error(`Failed to send email to ${job.data.email}:`, error);
    throw new Error(error.msg);
  }
});

module.exports = sendEmailQueue;
