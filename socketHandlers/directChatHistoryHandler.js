const Conversation = require("../models/conversation");
const chatUpdates = require("./updates/chat");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      chatUpdates.updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directChatHistoryHandler;
