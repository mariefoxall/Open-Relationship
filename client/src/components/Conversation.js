import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { moment } from "moment";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Conversation = ({ sender }) => {
  const currentUserStatus = useSelector((state) => state.currentuser.status);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  let currentUsername = currentUserInfo ? currentUserInfo.username : null;
  console.log("currentUsername", currentUsername);
  let currentUserIMG = currentUserInfo ? currentUserInfo.profilePicURL : null;

  const [sentMessages, setSentMessages] = React.useState([]);
  const [receivedMessages, setReceivedMessages] = React.useState([]);

  const getSentMessages = () => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getReceivedMessages = () => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getSentMessages();
    getReceivedMessages();
  }, []);

  const receivedFromSender = receivedMessages.filter(
    (message) => message.sender === sender
  );
  const sentToSender = sentMessages.filter(
    (message) => message.receiver === sender
  );

  const conversationMessagesInOrder = receivedFromSender.concat(sentToSender);
  // .sort((a, b) => {
  //   console.log("a.timestamp", a.timestamp);
  //   console.log("b.timestamp", b.timestamp);
  //   const aminusb = a.timestamp - b.timestamp;
  //   console.log("a.timestamp - b.timestamp", aminusb);

  //   return b.timestamp - a.timestamp;
  // });

  console.log(conversationMessagesInOrder);

  const theirStyle = { textAlign: "left" };

  const myStyle = { textAlign: "right" };

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
              <MessageBody>{message.message}</MessageBody>
              {message.invitationToConnect && (
                <ProfileLink to={`profile/${message.sender}`}>
                  Click here to visit my profile and respond
                </ProfileLink>
              )}
            </IndividualMessageDiv>
          );
        })}
      </AllMessagesDiv>
    </ConversationContainer>
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
  margin-bottom: 10px;
`;

export default Conversation;
