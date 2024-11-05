const OTP = require("../../models/OTP/otp");
const Profile = require("../../models/Auth/auth");
const mailSender = require("../../utils/mailsender");
const bcrypt = require("bcryptjs");
const { generateAndHashOTP } = require("../../utils/generate-hash-otp");
const { createErrorResponse } = require("../../utils/error-handle");

exports.verifyOTP = async (req, res) => {
  try {
    const { userID, otp } = req.body; // Use userID to match the correct record
    const otpRecord = await OTP.findOne({ userID }); // Adjust to match userID field

    if (!otpRecord) return res.status(400).json(createErrorResponse("Invalid or expired OTP", 400));

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) return res.status(400).json(createErrorResponse("Invalid or expired OTP", 400));

    await Profile.findByIdAndUpdate(userID, { verified: true }); // Correct field for verification
    await OTP.deleteMany({ userID }); // Delete all OTPs related to the user

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};



exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Profile.findOne({ email });
    if (!user) return res.status(404).json(createErrorResponse("User not found", 404));

    // Check for the latest OTP record
    const latestOtpRecord = await OTP.findOne({ userID: user._id }).sort({ createdAt: -1 });

    // If there is a record and it was created less than a minute ago
    if (latestOtpRecord && Date.now() - latestOtpRecord.createdAt < 60 * 1000) {
      return res.status(429).json(createErrorResponse("Please wait at least 1 minute before requesting a new OTP", 429));
    }

    // Delete any existing OTPs
    await OTP.deleteMany({ userID: user._id });

    const { otp, hashedOtp } = await generateAndHashOTP();

    const newOtpRecord = new OTP({
      userID: user._id,
      otp: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000, // Set expiration time for 5 minutes
      type: 'emailVerification', // Set the type of OTP
    });

    await newOtpRecord.save();
    await mailSender(email, "Your OTP", `<h1>Your OTP is: ${otp}</h1>`);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};



exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Profile.findOne({ email });
    if (!user) return res.status(404).json(createErrorResponse("Email not found", 404));

    const { otp, hashedOtp } = await generateAndHashOTP();

    await OTP.findOneAndUpdate(
      { userID: user._id, type: 'passwordReset' }, // Adjusted to find by userID and type
      { otp: hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000, createdAt: Date.now() },
      { upsert: true }
    );

    await mailSender(email, "Password Reset OTP", `<h1>Your OTP is: ${otp}</h1>`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.verifyPasswordResetOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const otpRecord = await OTP.findOne({ userID: userId, type: 'passwordReset' }); // Adjusted to find by userID and type
    if (!otpRecord) return res.status(400).json(createErrorResponse("Invalid or expired OTP", 400));

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) return res.status(400).json(createErrorResponse("Invalid or expired OTP", 400));

    await OTP.deleteMany({ userID: userId, type: 'passwordReset' }); // Adjusted to delete by userID and type
    res.status(200).json({ message: "OTP verified, proceed to reset password" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Profile.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};
