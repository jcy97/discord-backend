const Conversation = require("../../models/conversation");
const serverStore = require("../../serverStore");

const updateChatHistory = async (
  conversationId,
  toSpecifiedSocketId = null
) => {
  /*
    converssations에 messages가 배열로 맵핑되어 있기 때문에 한 번 더 populate 한다
    */
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "author",
      model: "User",
      select: "username _id",
    },
  });
  console.log(11111);
  console.log(conversation);
  if (conversation) {
    const io = serverStore.getSocketServerInstance();
    if (toSpecifiedSocketId) {
      //채팅 기록 업데이트
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    }

    // 현재 온라인인 유저들의 대화가 있으면 업데이트 내용을 전송한다.
    conversation.participants.forEach((userId) => {
      const activeConnection = serverStore.getActiveConnections(
        userId.toString()
      );
      activeConnection.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      });
    });
  }
};

module.exports = { updateChatHistory };
