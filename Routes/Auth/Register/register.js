const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const Register_UConfirm = async (req, res) => {
  console.log(" sendUserInfoToRegisterDB data", req.body);
  //step 1: check username and mail
  const usernameExist = await User.findOne({ username: req.body.username });
  const emailExist = await User.findOne({ email: req.body.email });

  console.log("usernameExist", usernameExist);
  console.log("emailExist", emailExist);

  if (usernameExist)
    return res.status(400).json({
      success: false,
      message: "Tên người dùng đã tồn tại rồi bạn ơi!",
    });
  if (emailExist)
    return res.status(400).json({
      success: false,
      message: "email này đã được dùng để đăng ký tài khoản khác rồi bạn ơi!",
    });

  //variablize
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const AllInfomationInToken = jwt.sign(
    {
      username,
      password,
      email,
    },
    process.env.TOKEN_SECRET
  );

  const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
  const hashedPW = await bcrypt.hash(password, decryptPW);

  const user = new User({
    name: username,
    username: username,
    email: email,
    password: hashedPW,
    isAdmin: false,
    isConfirmed: false,
  });

  //step 2: create a email to send and then send it to userinput mail

  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
      ignoreTLS: false,
      secure: false,
      auth: {
        user: "ducquangdz01@gmail.com",
        pass: "Quang11a6",
      },
    });

    let mailOptions = {
      from: "computadora",
      to: email,
      subject: `Active account  ${username} on Computadora`,
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
                      <a style="margin-block: 1.5rem;cursor: pointer;color:white" href="http://localhost:3000/users/sign-up/success/${AllInfomationInToken}">Xác nhận </a>
                      <p style="margin:1.5rem 2.5rem;text-align:initial;font-size :18px;padding-top:1rem">Mở chức năng đăng nhập và nâng cao khả năng sử dụng tại web </p>
                      <strong style="font-size: 18px;  margin-top: 1rem;" >Chúc bạn có trải nghiệm tuyệt vời!</strong>
                  </td>
              </tr>
          </table>
      </table>
  </body>
  </html>
      `,
    };

    transporter.sendMail(mailOptions, async (err, data) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        console.log("Email activate account has been send");
        await user.save();
        res.status(200).json({
          success: true,
          message:
            "Thư kích hoạt tài khoản đã được gửi (bạn nhớ kiểm tra cả thư rác nhé 😚)",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const Register_confirmed = async (req, res) => {
  try {
    //step1: decoded
    console.log(
      "data receive from put Router sendUserInfoToRegisterDB",
      req.params
    );
    const registerDetailsInformationHasBeenDecoded = await jwt.verify(
      req.params.token,
      process.env.TOKEN_SECRET
    );

    //step2: store in variables
    const username = registerDetailsInformationHasBeenDecoded.username;
    const password = registerDetailsInformationHasBeenDecoded.password;
    const email = registerDetailsInformationHasBeenDecoded.email;
    console.log("username from sendUserInfoToRegisterDB", username);
    console.log("password from sendUserInfoToRegisterDB", password);
    console.log("email from sendUserInfoToRegisterDB", email);

    //step 3: hashed PW
    const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
    const hashedPW = await bcrypt.hash(password, decryptPW);

    //step 4: lets update in our database
    const filter = { username };
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

    console.log("User được lưu vào db", user);
    res.json({
      success: true,
      message:
        " Tài khoản đã được kích hoạt, chúc bạn có trải nghiệm thật vui vẻ 😜 ",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Register_UConfirm, Register_confirmed };
