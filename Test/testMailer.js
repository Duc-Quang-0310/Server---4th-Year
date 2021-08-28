let nodemailer = require("nodemailer");
let hbs = require("nodemailer-express-handlebars");

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
  to: "ducquang03102000@gmail.com",
  subject: "Test nodemailer",
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
                      <a style="margin-block: 1.5rem;cursor: pointer;color:white" href="https://www.youtube.com/">Xác nhận </a>
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

transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
    console.log("error occurs", err);
  } else {
    console.log("Mail sent!!!");
  }
});
