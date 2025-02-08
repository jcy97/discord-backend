const serverStore = require("../serverStore");
const roomUpdates = require("./updates/rooms");
const roomCreateHandler = (socket) => {
  console.log("핸들링 대화방 생성");
  const socketId = socket.id;
  const userId = socket.user.userId;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId);

  socket.emit("room-create", {
    roomDetails,
  });

  roomUpdates.updateRooms();
};

module.exports = roomCreateHandler;
