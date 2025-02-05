const connectedUsers = new Map();

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

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
};
