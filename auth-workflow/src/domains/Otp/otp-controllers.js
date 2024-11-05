const OTP = require("../../models/OTP/otp");
const Profile = require("../../models/Auth/auth");
const mailSender = require("../../utils/mailsender");
const { createErrorResponse } = require("../../utils/error-handle");
const bcrypt = require("bcryptjs"); 

exports.verifyOTP = async (req, res) => {
  try {
    const { userID, otp } = req.body;
    const otpRecord = await OTP.findOne({ userID });

    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json(createErrorResponse("Invalid or expired OTP", 400));
    }

    if (otp !== otpRecord.otp) {
      return res.status(400).json(createErrorResponse("Invalid OTP", 400));
    }

    await Profile.findByIdAndUpdate(userID, { verified: true });
    await OTP.deleteMany({ userID });

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

    const latestOtpRecord = await OTP.findOne({ userID: user._id }).sort({ createdAt: -1 });
    if (latestOtpRecord && Date.now() - latestOtpRecord.createdAt < 60 * 1000) {
      return res.status(429).json(createErrorResponse("Please wait at least 1 minute before requesting a new OTP", 429));
    }

    await OTP.deleteMany({ userID: user._id });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // Set expiration time for 5 minutes

    const newOtpRecord = new OTP({
      userID: user._id,
      otp,
      expiresAt,
      type: 'emailVerification',
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // Set expiration time for 5 minutes

    await OTP.findOneAndUpdate(
      { userID: user._id, type: 'passwordReset' },
      { otp, expiresAt, createdAt: Date.now() },
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

    const otpRecord = await OTP.findOne({ userID: userId, type: 'passwordReset' });
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json(createErrorResponse("Invalid or expired OTP", 400));
    }

    if (otp !== otpRecord.otp) {
      return res.status(400).json(createErrorResponse("Invalid OTP", 400));
    }

    await OTP.deleteMany({ userID: userId, type: 'passwordReset' });
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
