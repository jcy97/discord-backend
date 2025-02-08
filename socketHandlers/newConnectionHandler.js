const serverStore = require("../serverStore");
const friendsUpdate = require("./updates/friends");
const roomsUpdate = require("./updates/rooms");
const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  //초대 요청을 업데이트
  friendsUpdate.updateFriendsPendingInvitations(userDetails.userId);

  // 친구 목록을 업데이트
  friendsUpdate.updateFriends(userDetails.userId);

  //대화방 목록을 업데이트
  setTimeout(() => {
    roomsUpdate.updateRooms(socket.id);
  }, [500]);
};

module.exports = newConnectionHandler;
