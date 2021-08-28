const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const pwRecover_unconFirm = async (req, res) => {
  console.log(req.body);
  const usernameExist = await User.findOne({ username: req.body.username });
  console.log(usernameExist);
  const username = req.body.username;
  const email = req.body.email;
  if (!usernameExist) {
    res.status(400).json({
      success: false,
      message: "Tài khoản này không tồn tại vui lòng đăng ký bạn ei 🤭",
    });
  }

  if (!usernameExist.isConfirmed) {
    res.status(400).json({
      success: false,
      message: "Tài khoản này chưa được kích hoạt nhé bạn ",
    });
  }
  if (usernameExist.email != email) {
    res.status(400).json({
      success: false,
      message: "Email không được liên kết với tài khoản này nhé bạn 😓",
    });
  }
  const AllInfomationInToken = jwt.sign(
    {
      username,
      email,
    },
    process.env.TOKEN_SECRET
  );

  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ducquangdz01@gmail.com",
        pass: "Quang11a6",
      },
    });
    let mailOptions = {
      from: process.env.ADMINEMAIL_SECRET,
      to: email,
      subject: `Khôi phục lại mật khẩu cho tài khoản ${username} `,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
          <title>Document</title>
          <style>
              *{
                  font-family: "Poppins", sans-serif;
                  margin: 0;
                  padding: 0;
              }
              .container{
                  width: 100%;
                  height: 70vh;
                  background: #dcdcdc;
                  display: flex;
              }
              .wrapper{
                  padding-top: 3rem;
                  width: 35rem;
                  height: 55%;
                  background: #fff;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  border: 0.0001px solid rgb(223, 223, 223);
                  box-shadow: 1px 2px 26px 3px rgba(0,0,0,0.1);
              }
              a {
                  text-decoration: none;
                  background: #13aa52;
                  color: #fff;
                  font-size: 18px;
                  padding: 0.7rem 2rem;
                  
              }
              .pd{
                padding-block: 2rem;
              }
          </style>
      </head>
      <body>
          <table class="container" style ="justify-content: center; align-items: center;">
              <table align="center" class="wrapper">
                  <tr>
                      <h2 style="margin-block: 1rem; text-align: center">Email Address Verification</h2>     
                  </tr>
                  <tr style="text-align: center" >
                      <img style="margin-top: 2rem; width: 95%; margin-bottom: 2rem" src="https://res.cloudinary.com/dsykf3mo9/image/upload/v1629260001/4th-Years/mailsend_uydv4j.png" alt="">
                  </tr>
                  <tr >
                      <td class="pd" align="center" style="padding-bottom:1rem">
                          <a style="margin-block: 1.5rem;cursor: pointer;color:white" href="http://localhost:3000/users/pw-recovery/new-password/${AllInfomationInToken}">Xác nhận </a>
                          <p style="margin:1.5rem 2.5rem;text-align:initial;font-size :18px;padding-top:1rem">Mở chức năng đăng nhập và nâng cao khả năng sử dụng tại web </p>
                          <strong style="font-size: 18px;  margin-top: 1rem;" > Chúc bạn có trải nghiệm tuyệt vời! </strong>
                      </td>
                  </tr>
              </table>
          </table>
      </body>
      </html>

      `,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email recover password has been send");
      }
    });
    res.json({
      success: true,
      message:
        "Thư kích hoạt tài khoản đã được gửi hãy kiểm tra trong hòm thư của bạn ( kiểm tra cả thư rác nhe bạn ❤️ )",
    });
  } catch (error) {
    console.log(error);
  }
};

const pwRecover_conFirm = async (req, res) => {
  try {
    //step1: decoded
    console.log(
      "data receive from put Router pwRecoverSendRequestToBackEnd",
      req.params
    );

    console.log("req. body", req.body);

    const passworRecoverDetailsInformationHasBeenDecoded = await jwt.verify(
      req.params.token,
      process.env.TOKEN_SECRET
    );

    const password = req.body.password;
    console.log("password", password);

    //step2: store in variables
    const username = passworRecoverDetailsInformationHasBeenDecoded.username;
    const email = passworRecoverDetailsInformationHasBeenDecoded.email;
    const filter = { username };

    //step 3: hashed PW
    const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
    const hashedPW = await bcrypt.hash(password, decryptPW);

    //step 4: lets update in our database
    const updateAccount = {
      username: username,
      email: email,
      password: hashedPW,
      isAdmin: false,
      isConfirmed: true,
    };

    const user = await User.findOneAndUpdate(filter, updateAccount, {
      new: true,
    });

    //step 5: respone
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { pwRecover_conFirm, pwRecover_unconFirm };
