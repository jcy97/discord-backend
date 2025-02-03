const express = require("express");
const authController = require("../controllers/auth/authController");
const router = express.Router();
const Joi = require("joi");
//express와 호환되는 유효성 검사기
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

router.post(
  "/register",
  validator.body(registerSchema),
  authController.postRegister
);
router.post("/login", validator.body(loginSchema), authController.postLogin);

//토큰 검증 미들웨어 테스트
router.get("/test", auth, (req, res) => {
  res.send("테스트 통과");
});

module.exports = router;
