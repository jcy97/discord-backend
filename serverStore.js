const connectedUsers = new Map();

let io = null;

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketServerInstance = () => {
  return io;
};

//클로저
const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  console.log("신규 사용자 추가");
  console.log(connectedUsers);
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("사용자 삭제 완료: ", connectedUsers);
  }
};

// 현재 온라인 사용자들의 연결 정보를 반환한다.
const getActiveConnections = (userId) => {
  const activeConnections = [];
  connectedUsers.forEach(function (value, key) {
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};
const getOnlineUsers = () => {
  const onlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });
  return onlineUsers;
};
module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  getSocketServerInstance,
  setSocketServerInstance,
  getOnlineUsers,
};
