const serverStore = require("../../serverStore");

const updateRooms = (toSpectifiedSocketId = null) => {
  const io = serverStore.getSocketServerInstance();
  const activeRooms = serverStore.getActiveRooms();

  if (toSpectifiedSocketId) {
    io.to(toSpectifiedSocketId).emit("active-rooms", {
      activeRooms,
    });
  } else {
    io.emit("active-rooms", {
      activeRooms,
    });
  }
};

module.exports = {
  updateRooms,
};
