const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const socketServer = require("./socketServer");

dotenv.config();

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
// json 본문 파싱
app.use(express.json());
app.use(cors());

// routes 등록
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    console.log("서버 연결에 실패하였습니다.");
    console.error(err);
  });
