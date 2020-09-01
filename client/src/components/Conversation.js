import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { moment } from "moment";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import {
  getSentMessages,
  getReceivedMessages,
  getAllMessages,
} from "./reducers/messages.reducer";
import { addMessage } from "../actions";
import { Link } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";
import { format } from "date-fns";

const Conversation = ({ sender }) => {
  const dispatch = useDispatch();

  const currentUserStatus = useSelector((state) => state.currentuser.status);
  const chatStatus = useSelector((state) => state.chat.status);

  console.log(chatStatus);
  const messagesStatus = useSelector((state) => state.messages.status);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  let currentUsername = currentUserInfo ? currentUserInfo.username : null;
  console.log("currentUsername", currentUsername);
  let currentUserIMG = currentUserInfo ? currentUserInfo.profilePicURL : null;

  // const sentMessages = useSelector(getSentMessages);
  // const receivedMessages = useSelector(getReceivedMessages);

  // console.log("sentMessages", sentMessages);
  // console.log("receivedMessages", receivedMessages);

  const allMessages = useSelector(getAllMessages);
  console.log(allMessages);

  const [receivedMessages, setReceivedMessages] = React.useState([]);
  const [sentMessages, setSentMessages] = React.useState([]);

  React.useEffect(() => {
    console.log("inside useEffect listening for allMessages");
    setReceivedMessages(
      allMessages.filter((message) => message.receiver === currentUsername)
    );
    setSentMessages(
      allMessages.filter((message) => message.sender === currentUsername)
    );
  }, [allMessages]);

  console.log("receivedMessages", receivedMessages);
  console.log("sentMessages", sentMessages);

  const [refreshPage, setRefreshPage] = React.useState(false);

  let conversationMessagesInOrder = [];

  if (receivedMessages && sentMessages) {
    const receivedFromSender = receivedMessages.filter(
      (message) => message.sender === sender
    );
    const sentToSender = sentMessages.filter(
      (message) => message.receiver === sender
    );

    conversationMessagesInOrder = receivedFromSender
      .concat(sentToSender)
      .sort(function compare(a, b) {
        const timeA = new Date(a.timestamp);
        const timeB = new Date(b.timestamp);
        return timeA - timeB;
      });
    // need to figure out how to sort messages from timestamp
    console.log(conversationMessagesInOrder);
  }

  let socket = io.connect("http://localhost:8000");

  React.useEffect(() => {
    socket.on("connection-message", (data) => {
      console.log("received: ", data);
    });
    socket.on("push-message-to-conversation", (msg) => {
      console.log(msg);
      conversationMessagesInOrder.push(msg);
      console.log(conversationMessagesInOrder);
      // const newMessagesArray = allMessages.push(msg);
      // console.log(newMessagesArray);
      dispatch(addMessage(msg));
    });
    return () => {
      socket.off("connection-message");
      socket.close();
    };
  }, []);

  // socket.on("push-message-to-conversation", (msg) => {
  //   conversationMessagesInOrder.push(msg);
  //   console.log(conversationMessagesInOrder);
  //   dispatch(addMessage(msg));
  // });

  // React.useEffect(() => {
  //   setRefreshPage(!refreshPage);
  // }, [chatStatus]);

  console.log(conversationMessagesInOrder);

  const theirStyle = { textAlign: "left" };

  const myStyle = { textAlign: "right" };

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [conversationMessagesInOrder]);

  return (
    <ConversationContainer>
      <SenderName>{sender}</SenderName>
      <AllMessagesDiv>
        {conversationMessagesInOrder.map((message) => {
          return (
            <IndividualMessageDiv
              key={message._id}
              style={sender === message.sender ? theirStyle : myStyle}
            >
              {" "}
              <TimeDiv>
                {format(new Date(message.timestamp), "MMM d yyyy - h:mm a")}
              </TimeDiv>
              <MessageBody>{message.message}</MessageBody>
              {message.invitationToConnect && (
                <ProfileLink to={`profile/${message.sender}`}>
                  Click here to visit my profile and respond
                </ProfileLink>
              )}
            </IndividualMessageDiv>
          );
        })}
        <div ref={messagesEndRef} />
      </AllMessagesDiv>
    </ConversationContainer>
  );
};

const ConversationContainer = styled.div``;

const SenderName = styled.div`
  background-color: var(--coral);
  padding: 10px;
`;

const IndividualMessageDiv = styled.div`
  padding: 10px;
`;

const AllMessagesDiv = styled.div``;

const ProfileLink = styled(Link)`
  padding: 5px;
  background-color: var(--pale-yellow);
  border: 1px solid var(--coral);
`;

const MessageBody = styled.div`
  margin-bottom: 10px;
`;

const TimeDiv = styled.div`
  font-size: 10px;
  margin: 0 5px 5px 5px;
`;

export default Conversation;
