import React from "react";
import io from "socket.io-client";
import styled from "styled-components";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import { sendChat, resetChat } from "../actions";

const Chat = ({ receiver }) => {
  const dispatch = useDispatch();

  const currentUserStatus = useSelector((state) => state.currentuser.status);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  let currentUsername = currentUserInfo ? currentUserInfo.username : null;
  console.log("currentUsername", currentUsername);
  let currentUserIMG = currentUserInfo ? currentUserInfo.profilePicURL : null;

  let socket = io.connect("http://localhost:8000");

  React.useEffect(() => {
    socket.on("connection-message", (data) => {
      console.log("received: ", data);
    });
    return () => {
      socket.off("connection_message");
      socket.close();
    };
  }, []);

  //   const sendMsg = (groupId, sender, msg, time) => {
  //     console.log(groupId, sender, msg, time);
  //     socket.emit("sender-chat-message", { groupId, sender, msg, time });
  //   };

  const [chatMessage, setChatMessage] = React.useState("");

  const currentTime = new Date();
  console.log("currentTime", currentTime);

  React.useEffect(() => {
    setChatMessage("");
  }, [receiver]);

  const handlePostMessage = () => {
    fetch("/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: currentUsername,
        receiver: receiver,
        message: chatMessage,
        timestamp: currentTime,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        // dispatch(resetChat());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <ChatForm
        onSubmit={(ev) => {
          ev.preventDefault();
          dispatch(sendChat());
          socket.emit("send chat message", {
            message: chatMessage,
            sender: currentUsername,
            receiver: receiver,
            // senderImg: currentUserIMG,
            timestamp: currentTime,
          });
          handlePostMessage();
          setChatMessage("");
        }}
      >
        <ChatInput
          type="text"
          id="chatMessage"
          name="chatMessage"
          value={chatMessage}
          onChange={(ev) => {
            setChatMessage(ev.target.value);
          }}
        />
        <button type="submit">SEND</button>
      </ChatForm>
    </div>
  );
};

const ChatForm = styled.form`
  height: 75px;
`;

const ChatInput = styled.textarea`
  width: 100%;
  height: 50px;
`;

export default Chat;
