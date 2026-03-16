import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getOrCreateConversation = async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  let conversation = await Conversation.findOne({
    members: { $all: [userId, friendId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      members: [userId, friendId],
    });
  }

  res.status(200).json(conversation);
};


export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId }).sort({
    createdAt: 1,
  });

  res.json(messages);
};
