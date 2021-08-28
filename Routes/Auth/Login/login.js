const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login = async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username });
  console.log(username);

  // username exist proceed further step
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Sai tài khoản hoặc mật khẩu nhé" });
  if (!user.isConfirmed)
    return res.status(400).json({
      success: false,
      message:
        "Bạn hãy kiểm tra lại hòm thư điện tử, chúng mình đã gửi thư rồi bạn kích hoạt đi nhé <3",
    });
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res
      .status(400)
      .json({ message: "Sai tài khoản hoặc mật khẩu nhé", success: false });
  }
  try {
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Login };
