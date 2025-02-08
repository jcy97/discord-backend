const serverStore = require("../serverStore");
const roomsUpdated = require("./updates/rooms");

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;

  const participantDetails = {
    userId: socket.user.userId,
    socketId: socket.id,
  };

  const roomDetails = serverStore.getActiveRoom(roomId);
  serverStore.joinActiveRoom(roomId, participantDetails);

  // Web RTC 커넥션을 위한 정보 전달
  // 방에 있는 나 외에 사용자들에게 내 사전 정보를 전달
  roomDetails.participants.forEach((participant) => {
    if (participant.socketId !== participantDetails.socketId) {
      socket.to(participant.socketId).emit("conn-prepare", {
        connUserSocketId: participantDetails.socketId,
      });
    }
  });

  roomsUpdated.updateRooms();
};

module.exports = roomJoinHandler;
