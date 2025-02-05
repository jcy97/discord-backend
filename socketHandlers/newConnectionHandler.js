const serverStore = require("../serverStore");
const friendsUpdate = require("../socketHandlers/updates/friends");
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
};

module.exports = newConnectionHandler;
