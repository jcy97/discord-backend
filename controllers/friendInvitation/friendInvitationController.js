const postInvite = require("./postInvite");
const postAccept = require("./postAccept");
const postReject = require("./postReject");

//라우트와 비즈니스 로직을 중재하는 역할
exports.controllers = {
  postInvite,
  postAccept,
  postReject,
};
