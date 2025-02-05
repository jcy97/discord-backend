const friendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");
const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    // 초대장 컬렉션에서 해당 초대 삭제
    const invitationExists = await friendInvitation.exists({ _id: id });

    //초대장 삭제
    if (invitationExists) {
      await friendInvitation.findByIdAndDelete(id);
    }

    //사용자 화면에도 업데이트 되도록 처리
    friendsUpdates.updateFriendsPendingInvitations(userId);

    return res.status(200).send("초대가 성공적으로 삭제되었습니다.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("처리 중 에러가 발생하였습니다.");
  }
  return res.send("거절 핸들러");
};

module.exports = postReject;
