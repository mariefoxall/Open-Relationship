import React from "react";
import io from "socket.io-client";

import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { moment } from "moment";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import Conversation from "./Conversation";

const Messages = () => {
  const dispatch = useDispatch();

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

  // const AllMessagesInOrder = receivedMessages
  //   .concat(sentMessages)
  //   .sort((a, b) => {
  //     return b.timestamp - a.timestamp;
  //   });

  // console.log(AllMessagesInOrder);

  // const conversationWithPerson = (person) => {
  //   return AllMessagesInOrder.filter((message) => {
  //     message.sender === person || message.receiver === person;
  //   });
  // };

  return (
    <>
      <Header />
      <div> Inbox</div>
      {receivedMessagesFrom.map((sender) => {
        return <Conversation sender={sender} />;
      })}
    </>
  );

  //check in messages collection
  //start with anything where currentUser is receiving
  //check with currentUser sent
  //sort by timestamp
  //make an array (probably have two, combine and sort)
  //map all messages in conversation
};

export default Messages;
