import React from "react";
import io from "socket.io-client";

import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { moment } from "moment";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import Conversation from "./Conversation";
import ConversationSnippet from "./ConversationSnippet";
import styled from "styled-components";
import {
  requestMessages,
  receiveSentMessages,
  receiveReceivedMessages,
} from "../actions";

const Messages = () => {
  const dispatch = useDispatch();

  const currentUserStatus = useSelector((state) => state.currentuser.status);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  let currentUsername = currentUserInfo ? currentUserInfo.username : null;
  console.log("currentUsername", currentUsername);
  let currentUserIMG = currentUserInfo ? currentUserInfo.profilePicURL : null;

  const [receivedMessages, setReceivedMessages] = React.useState([]);
  const [sentMessages, setSentMessages] = React.useState([]);

  const getMessages = () => {
    dispatch(requestMessages());
    fetch("/get-received-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUser: currentUsername,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setReceivedMessages(json.receivedMessages);
        dispatch(receiveReceivedMessages(json.receivedMessages));
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/get-sent-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUser: currentUsername,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setSentMessages(json.sentMessages);
        dispatch(receiveSentMessages(json.sentMessages));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getMessages();
  }, []);

  let receivedMessagesFrom = [];

  if (receivedMessages.length > 0) {
    receivedMessagesFrom.push(receivedMessages[0].sender);
    for (let i = 1; i < receivedMessages.length; i++) {
      if (receivedMessages[i].sender !== receivedMessages[i - 1].sender) {
        receivedMessagesFrom.push(receivedMessages[i].sender);
      }
    }
  }

  console.log(receivedMessagesFrom);

  return (
    <>
      <Header />
      <MessagesDiv>
        <InboxDiv>
          {" "}
          <InboxTitle>INBOX</InboxTitle>
          {receivedMessagesFrom.map((sender, index) => {
            return <ConversationSnippet key={index} sender={sender} />;
          })}
        </InboxDiv>
        <ConversationDiv>
          <ConversationTitle>CONVERSATION</ConversationTitle>
        </ConversationDiv>
      </MessagesDiv>
    </>
  );

  //check in messages collection
  //start with anything where currentUser is receiving
  //check with currentUser sent
  //sort by timestamp
  //make an array (probably have two, combine and sort)
  //map all messages in conversation
};
const MessagesDiv = styled.div`
  display: flex;
  min-height: calc(100vh - 100px);
`;
const InboxDiv = styled.div`
  flex: 1;
  min-height: calc(100vh - 100px);
`;

const InboxTitle = styled.h2`
  padding: 10px;
  background-color: var(--mint-green);
`;

const ConversationDiv = styled.div`
  flex: 1;
  border-left: 1px dashed var(--coral);
  min-height: calc(100vh - 100px);
`;

const ConversationTitle = styled.h2`
  padding: 10px;
  background-color: var(--mint-green);
`;

export default Messages;
