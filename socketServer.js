const authSocket = require("./middleware/authSocket");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const serverStore = require("./serverStore");
const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  serverStore.setSocketServerInstance(io);
  // 미들웨어 연결
  // socket io는 연결이라는 개념이 처음에만 있기 떄문에 JWT 검증을 최초 연결 때만 작업함
  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };
  io.on("connection", (socket) => {
    console.log("사용자가 연결되었습니다.");
    console.log(socket.id);

    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, [1000 * 8]);
};

module.exports = {
  registerSocketServer,
};
