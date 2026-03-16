import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const chatSocket = (io, socket) => {

  socket.on("joinConversation", (conversationId) => {
    //console.log("User", socket.user.userId, "joined", conversationId);
    socket.join(conversationId);
  });

  socket.on("sendMessage", async ({ conversationId, text }) => {
    //console.log("Message from", socket.user.userId, "to room", conversationId);

    const message = await Message.create({
      conversationId,
      senderId: socket.user.userId,
      text,
    });

    io.to(conversationId).emit("newMessage", message);
  });


  socket.on("markSeen", async (conversationId) => {
  await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: socket.user.userId },
      seenBy: { $ne: socket.user.userId },
    },
    {
      $push: { seenBy: socket.user.userId },
    }
  );

  io.to(conversationId).emit("messagesSeen", {
    conversationId,
    userId: socket.user.userId,
  });
});

socket.on("call-user", ({ conversationId, offer }) => {
   // console.log("📞 call-user emit to room:", conversationId);
    socket.to(conversationId).emit("incoming-call", {
      from: socket.user.userId,
      offer,
    });
  });

  socket.on("answer-call", ({ conversationId, answer }) => {
    socket.to(conversationId).emit("call-answered", {
      answer,
    });
  });

  socket.on("ice-candidate", ({ conversationId, candidate }) => {
    socket.to(conversationId).emit("ice-candidate", {
      candidate,
    });
  });

};
