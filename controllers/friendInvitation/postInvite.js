const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;
  const { userId, mail } = req.user;

  // 초대하는 친구 메일 유효성 검사
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res.status(409).send("자신을 친구로 등록할 수는 없습니다.");
  }
  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });
  if (!targetUser) {
    return res
      .status(404)
      .send(`${targetMailAddress}는 존재하지 않는 유저입니다.`);
  }

  // 이미 초대가 발송된 친구인지 확인
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceived) {
    return res.status(409).send("이미 초대가 발송된 친구입니다.");
  }

  // 이미 나랑 친구인 경우
  const usersAlreadyFriends = targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );
  if (usersAlreadyFriends) {
    return res.status(409).send("이미 친구입니다");
  }
  // 데이터베이스 데이터 생성
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // 초대 발송이 됐다는 걸 사용자에게 전송
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  // 초대 발송이 성공한 경우 응답 반환
  return res.status(201).send("초대가 발송되었습니다.");

  return res.send("컨트롤러가 작동 중입니다.");
};

module.exports = postInvite;
