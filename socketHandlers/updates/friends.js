const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const serverStore = require("../../serverStore");

const updateFriendsPendingInvitations = async (userId) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id username mail"); //populate -> join 같은 기능 senderId에는 현재 어떤 콜렉션의 id가 들어있기 때문에 그 콜렉션의 데이터를 가져온다.

    // 사용자의 소켓 연결 아이디를 가져온다 -> 온라인인 경우 화면을 바로 변경해주기 위함..
    const receiverList = serverStore.getActiveConnections(userId);
    const io = serverStore.getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-invitations", {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (error) {
    console.log(error);
  }
};
const updateFriends = async (userId) => {
  try {
    //온라인 유저의 아이디를 찾는다.
    const receiverList = serverStore.getActiveConnections(userId);
    if (receiverList.length > 0) {
      //_id:1 , friends:1 -> _id와 friends만 가져오세요 1: 참 0: 거짓
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id username mail"
      );

      if (user) {
        const friendsList = user.friends.map((f) => {
          return {
            id: f._id,
            mail: f.mail,
            username: f.username,
          };
        });
        // 소켓서버 인스턴스 생성
        const io = serverStore.getSocketServerInstance();
        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("friends-list", {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  updateFriendsPendingInvitations,
  updateFriends,
};
