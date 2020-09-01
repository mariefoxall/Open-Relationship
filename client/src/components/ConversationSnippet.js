import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { moment } from "moment";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import { format } from "date-fns";
import {
  // getSentMessages,
  // getReceivedMessages,
  getAllMessages,
} from "./reducers/messages.reducer";

import { Link } from "react-router-dom";
import styled from "styled-components";
import Loading from "./Loading";

const ConversationSnippet = ({ sender }) => {
  const currentUserStatus = useSelector((state) => state.currentuser.status);
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
    setReceivedMessages(
      allMessages.filter((message) => message.receiver === currentUsername)
    );
    setSentMessages(
      allMessages.filter((message) => message.sender === currentUsername)
    );
  }, [allMessages]);

  console.log("receivedMessages", receivedMessages);
  console.log("sentMessages", sentMessages);

  //   const getSentMessages = () => {
  //     fetch("/get-sent-messages", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         currentUser: currentUsername,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((json) => {
  //         console.log(json);
  //         setSentMessages(json.sentMessages);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   const getReceivedMessages = () => {
  //     fetch("/get-received-messages", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         currentUser: currentUsername,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((json) => {
  //         console.log(json);
  //         setReceivedMessages(json.receivedMessages);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   React.useEffect(() => {
  //     getSentMessages();
  //     getReceivedMessages();
  //   }, []);

  let recentMessage = {};

  if (receivedMessages && sentMessages) {
    const receivedFromSender = receivedMessages.filter(
      (message) => message.sender === sender
    );
    const sentToSender = sentMessages.filter(
      (message) => message.receiver === sender
    );

    const conversationMessagesInOrder = receivedFromSender
      .concat(sentToSender)
      .sort(function compare(a, b) {
        const timeA = new Date(a.timestamp);
        const timeB = new Date(b.timestamp);
        return timeB - timeA;
      });
    // need to figure out how to sort messages from timestamp
    console.log(conversationMessagesInOrder);

    recentMessage = conversationMessagesInOrder[0];
  }

  // .sort((a, b) => {
  //   console.log("a.timestamp", a.timestamp);
  //   console.log("b.timestamp", b.timestamp);
  //   const aminusb = a.timestamp - b.timestamp;
  //   console.log("a.timestamp - b.timestamp", aminusb);

  //   return b.timestamp - a.timestamp;
  // });

  const theirStyle = { textAlign: "left" };

  const myStyle = { textAlign: "right" };

  let recentMessageSender = "";
  let recentMessageBody = "";
  let recentMessageInvitationToConnect = "false";
  let recentMessageTime = "";

  if (recentMessage) {
    recentMessageSender =
      recentMessage.sender === currentUsername ? "you" : recentMessage.sender;
    recentMessageBody = recentMessage.message;
    recentMessageInvitationToConnect = recentMessage.invitationToConnect;
    recentMessageTime = format(
      new Date(recentMessage.timestamp),
      "MMM d yyyy - h:mm a"
    );
  }

  return (
    <>
      {messagesStatus === "messages-requested" && <Loading />}
      {messagesStatus === "messages-received" && (
        <ConversationContainer>
          <SenderName>{sender}</SenderName>
          <IndividualMessageDiv
            style={sender === recentMessageSender ? theirStyle : myStyle}
          >
            <TimeDiv>{recentMessageTime}</TimeDiv>
            <WhoSentLast>{recentMessageSender} said:</WhoSentLast>
            <MessageBody>{recentMessageBody}</MessageBody>
            {recentMessageInvitationToConnect && (
              <ProfileLink to={`profile/${recentMessageSender}`}>
                Click here to visit my profile and respond
              </ProfileLink>
            )}
          </IndividualMessageDiv>
        </ConversationContainer>
      )}
    </>
  );
};

const ConversationContainer = styled.div`
  border: 1px solid var(--forest-green);
`;

const SenderName = styled.div`
  background-color: var(--coral);
  padding: 10px;
`;

const IndividualMessageDiv = styled.div`
  padding: 10px;
  border: 1px solid var(--mint-green);
`;

const AllMessagesDiv = styled.div`
  border: 1px solid var(--forest-green);
`;

const ProfileLink = styled(Link)`
  padding: 5px;
  background-color: var(--pale-yellow);
  border: 1px solid var(--coral);
`;

const MessageBody = styled.div`
  margin: 0 8px 10px 8px;
`;

const WhoSentLast = styled.div`
  margin-bottom: 10px;
  color: var(--forest-green);
  background-color: var(--pale-yellow);
  padding: 5px;
`;

const TimeDiv = styled.div`
  font-size: 10px;
  margin: 0 8px 5px 8px;
`;

export default ConversationSnippet;
