const User = require("../models/user");

const me = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findById(req.user.id).select("-password");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: currentUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res)=> {
    const users = await user.find().select("-password").lean();

    if(!users.length) {
        return res.status(400).json({message: "No users found"})
    }

    res.json(users)
}

module.exports = 
{
    getAllUsers,
    me,
    
}