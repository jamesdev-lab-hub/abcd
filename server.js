const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, methods: ["GET", "POST"] }
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true }));

// Minimal demo signaling only. Use a strong room code and share it privately.
// Production deployments should add account authentication, rate limits,
// room expiry, and stricter origin/CORS settings.
io.on("connection", (socket) => {
  socket.on("join-room", ({ room, role }) => {
    if (typeof room !== "string" || !/^[A-Za-z0-9_-]{8,64}$/.test(room)) {
      socket.emit("app-error", "Room code must be 8–64 letters/numbers/_/-.");
      return;
    }
    if (!["streamer", "viewer"].includes(role)) {
      socket.emit("app-error", "Invalid role.");
      return;
    }

    // Keep this demo to one streamer and one viewer per room.
    const existing = io.sockets.adapter.rooms.get(room);
    if (existing && existing.size >= 2) {
      socket.emit("app-error", "This room already has two connected users.");
      return;
    }

    socket.data.room = room;
    socket.data.role = role;
    socket.join(room);
    socket.emit("joined", { room, role });
    socket.to(room).emit("peer-ready", { role });
  });

  for (const eventName of ["offer", "answer", "ice-candidate", "stop-sharing"]) {
    socket.on(eventName, (payload) => {
      const room = socket.data.room;
      if (!room) return;
      socket.to(room).emit(eventName, payload);
    });
  }

  socket.on("disconnect", () => {
    const room = socket.data.room;
    if (room) socket.to(room).emit("peer-disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Live Camera Share demo listening on port ${PORT}`);
});
