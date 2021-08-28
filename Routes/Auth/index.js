const router = require("express").Router();
const { Login } = require("./Login/login");
const {
  pwRecover_unconFirm,
  pwRecover_conFirm,
} = require("./PWRecover/pwrecover");
const {
  Register_UConfirm,
  Register_confirmed,
} = require("./Register/register");

//REGISTER
router.post("/registry", Register_UConfirm);
router.post("/registry/:token", Register_confirmed);

//Login
router.post("/login", Login);

//PWRecovery

router.post("/pwRecovery", pwRecover_unconFirm);
router.post("/pwRecovery/newPassWord/:token", pwRecover_conFirm);

module.exports = router;
