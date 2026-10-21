const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = require("../../config/prisma");
const jwt = require("jsonwebtoken");

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Fetch user info using access_token instead of verifyIdToken
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const payload = await response.json();
    const { email, name, picture } = payload;

    const existUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existUser) {
      await prisma.user.create({
        data: {
          email,
          name,
          picture,
        },
      });
    }

    const appToken = jwt.sign(
      { id: existUser?.id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Login successfully",
      token: appToken,
      user: { email, name, picture },
    });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid google token",
      error: err.message,
    });
  }
};
