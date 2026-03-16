const MessageBubble = ({ message, isMe }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isSeen = isMe && message.seenBy?.length > 0;

  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm
          ${
            isMe
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }
        `}
      >
        <div>{message.text}</div>

        <div className="flex justify-end items-center gap-1 mt-1 text-[10px] opacity-70">
          <span>{time}</span>
          {isMe && (
            <span>{isSeen ? "✔✔" : "✔"}</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default MessageBubble;