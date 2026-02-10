const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//GENERATE ACCESS TOKEN AND REFRESH TOKEN
const generateTokens = (user) => {
  const payload = { UserInfo: { id: user._id , isAdmin: user.isAdmin} };

  return {
    accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    }),
    refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    }),
  };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: process.env.NODE_ENV === "production"? true : false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const { accessToken, refreshToken } = generateTokens(foundUser);
    setRefreshCookie(res, refreshToken);

    res.json({
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
      token: accessToken,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

/* ================= LOGOUT ================= */
const logout = (req, res)=> {
  const refreshToken = req.cookies?.jwt;

  if(!refreshToken) return res.sendStatus(204);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
  } ) 

  res.json({message:"logout successfully"})
}

/* ================= REFRESH ================= */
const refresh = async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);

      const foundUser = await User.findById(decoded.UserInfo.id);
      if (!foundUser) return res.sendStatus(401);

      const { accessToken } = generateTokens(foundUser._id);
      res.json({ accessToken });
    }
  );
};

module.exports = 
{
  register,
  login,
  logout,
  refresh,
};
