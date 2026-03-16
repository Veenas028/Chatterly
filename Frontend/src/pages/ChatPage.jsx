import { useParams } from "react-router";
import { useEffect, useState } from "react";
import socket from "../lib/socket";
import axios from "../lib/axios";
import useAuthUser from "../hooks/useAuthUser";
import MessageBubble from "../components/MessageBubble.jsx";
import { useNavigate } from "react-router";

const ChatPage = () => {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [receiver, setReceiver] = useState(null);

  const { authUser } = useAuthUser();
  const myId = authUser?._id;
  const navigate = useNavigate();

  /* =========================
     1️⃣ FETCH MESSAGES
  ========================= */
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/conversations/${conversationId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  /* =========================
     2️⃣ FETCH RECEIVER (CHAT HEADER)
  ========================= */
  useEffect(() => {
    if (!conversationId || !myId) return;

    const fetchConversation = async () => {
      try {
        const res = await axios.get(`/conversations/${conversationId}/details`);

        const otherUser = res.data.members.find(
          (u) => String(u._id) !== String(myId)
        );

        setReceiver(otherUser);
      } catch (err) {
        console.error("Error fetching conversation", err);
      }
    };

    fetchConversation();
  }, [conversationId, myId]);
  useEffect(() => {
  const onIncomingCall = (data) => {
    console.log("📲 INCOMING CALL EVENT RECEIVED", data);
    const accept = window.confirm("Incoming video call. Accept?");

    if (accept) {
      navigate(`/call/${conversationId}`);
    }
  };

  socket.on("incoming-call", onIncomingCall);

  return () => {
    socket.off("incoming-call", onIncomingCall);
  };
}, [conversationId, navigate]);


  /* =========================
     3️⃣ SOCKET SETUP
  ========================= */
  useEffect(() => {
    if (!conversationId || !myId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinConversation", conversationId);
    socket.emit("markSeen", conversationId);

    const onNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const onMessagesSeen = ({ userId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.seenBy?.includes(userId)
            ? m
            : { ...m, seenBy: [...(m.seenBy || []), userId] }
        )
      );
    };

    socket.on("newMessage", onNewMessage);
    socket.on("messagesSeen", onMessagesSeen);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("messagesSeen", onMessagesSeen);
    };
  }, [conversationId, myId]);

  /* =========================
     4️⃣ SEND MESSAGE
  ========================= */
  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", {
      conversationId,
      text,
    });

    setText("");
  };


  /* =========================
     UI
  ========================= */
  return (
    <div className="h-[90vh] flex flex-col bg-[#e8f5e9] rounded-xl overflow-hidden">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <img
            src={receiver?.profilePic || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">
              {receiver?.fullName || "Chat"}
            </h3>
            <p className="text-xs text-gray-500">
              Online
            </p>
          </div>
        </div>

       <button
  onClick={() => navigate(`/call/${conversationId}`)}
  className="bg-[#9bb87a] p-2 rounded-lg text-white"
>
  📹
</button>

      </div>

      {/* ===== CHAT BODY ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#f5f7fb]">
        {messages.map((m) => {
          const isMe = String(m.senderId) === String(myId);

          return (
            <MessageBubble
              key={m._id}
              message={m}
              isMe={isMe}
            />
          );
        })}
      </div>

      {/* ===== INPUT BAR ===== */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-t">
        <button className="text-2xl text-gray-400">＋</button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-full outline-none"
          placeholder="Type your message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="text-2xl text-gray-500"
        >
          ➤
        </button>
      </div>

    </div>
  );
};

export default ChatPage;
