import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { chatSocket } from "./chat.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: true, // dev
      credentials: true,
    },
  });



  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;

      if (!cookies) {
        console.log("Socket rejected: no cookies");
        return next(new Error("Unauthorized"));
      }

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.jwt;

      if (!token) {
        console.log("Socket rejected: no jwt cookie");
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = decoded; // { userId }

      next();
    } catch (err) {
      console.log("Socket auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

 io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.user.userId);
    chatSocket(io, socket);
  });

  return io;
};
