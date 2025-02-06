const Conversation = require("../models/conversation");
const Message = require("../models/message");
const chatUpdates = require("./updates/chat");

const directMessageHandler = async (socket, data) => {
  try {
    console.log("DM 핸들링");
    const { userId } = socket.user;

    const { receiverUserId, content } = data;

    // 새 메세지 생성
    const message = await Message.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    // 두 사람 간의 대화가 있는지 확인하고 있는 경우 신규 대화를 콜렉션에 만들지 않는다.
    const conversation = await Conversation.findOne({
      participants: {
        // 배열안에 모든 요소가 포함되어 있는지 확인
        $all: [userId, receiverUserId],
      },
    });
    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();
      // 현재 온라인인 대화 참여자들 화면에 변경 내용 반영
      chatUpdates.updateChatHistory(conversation._id.toString());
    } // 대화가 없으면 새로 생성한다.
    else {
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });
      // 현재 온라인인 대화 참여자들 화면에 변경 내용 반영
      chatUpdates.updateChatHistory(newConversation._id.toString());
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directMessageHandler;
