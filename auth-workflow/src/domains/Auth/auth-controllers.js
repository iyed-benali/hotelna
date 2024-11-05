// controllers/authController.js
const Profile = require("../../models/Auth/auth");
const OTP = require("../../models/OTP/otp");
const mailSender = require("../../utils/mailsender");
const bcrypt = require("bcryptjs");
const { generateAndHashOTP } = require("../../utils/generate-hash-otp");
const {createErrorResponse} = require('../../utils/error-handle')
const jwt = require("jsonwebtoken");

// Register function
const register = async (req, res) => {
  const { username, firstName, lastName, email, phone, password,role } = req.body;

  try {
    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      return res.status(400).json(createErrorResponse("Email already exists.", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newProfile = new Profile({
      username,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role:role
    });
    await newProfile.save();

    const { otp, hashedOtp } = await generateAndHashOTP();

    const otpEntry = new OTP({
      userID: newProfile._id,
      otp: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000, 
      type: 'emailVerification', 
    });
    await otpEntry.save();

    const emailBody = `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`;
    await mailSender(email, "Your OTP Code", emailBody);

    res.status(201).json({ message: "User registered successfully. OTP sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};



// Login function


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(404).json(createErrorResponse("Profile not found.", 404));
    }

    if (!profile.verified) {
      return res.status(403).json(createErrorResponse("Please verify your email before logging in.", 403));
    }

    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) {
      return res.status(400).json(createErrorResponse("Invalid credentials.", 400));
    }

    // Create token payload with important user data
    const tokenPayload = {
      id: profile._id,
      email: profile.email,
      role: profile.role,
    };

    // Generate token (set a secret key and an optional expiration time)
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("Server error", 500));
  }
};


module.exports = {
  register,
  login,
};
