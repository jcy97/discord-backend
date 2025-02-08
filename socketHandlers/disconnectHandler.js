const serverStore = require("../serverStore");
const roomLeaveHandler = require("./roomLeaveHandler");

const disconnectHandler = (socket) => {
  const actvieRooms = serverStore.getActiveRooms();
  actvieRooms.forEach((actvieRoom) => {
    const userInRoom = actvieRoom.participants.some(
      (participant) => participant.socketId === socket.id
    );
    if (userInRoom) {
      roomLeaveHandler(socket, { roomId: actvieRoom.roomId });
    }
  });
  serverStore.removeConnectedUser(socket.id);
};

module.exports = disconnectHandler;
