const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    //사용자 존재 여부 검사
    const userExists = await User.exists({
      mail: mail.toLowerCase(),
      username: username,
    });

    if (userExists) {
      return res.status(409).send("이미 가입한 이메일입니다.");
    }

    // 패스워드 해쉬화
    const encryptedPassword = await bcrypt.hash(password, 10);

    // 사용자 다큐먼트 생성 및 저장
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    // JWT Token 생성
    // 토큰 값, 시크릿 키, 유지시간
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    // 생성 정보 반환
    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
        _id: user._id,
      },
    });
  } catch (err) {
    return res.status(500).send("처리 중 에러가 발행하였습니다.");
  }
};

module.exports = postRegister;
