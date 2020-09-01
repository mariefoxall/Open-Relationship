import React from "react";
import io from "socket.io-client";

import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import Conversation from "./Conversation";
import ConversationSnippet from "./ConversationSnippet";
import styled from "styled-components";
import {
  requestMessages,
  receiveSentMessages,
  receiveReceivedMessages,
  receiveAllMessages,
} from "../actions";
import Chat from "./Chat";
import { getAllMessages } from "./reducers/messages.reducer";
import Loading from "./Loading";

const Messages = () => {
  const dispatch = useDispatch();

  const currentUserStatus = useSelector((state) => state.currentuser.status);
  const messagesStatus = useSelector((state) => state.messages.status);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  let currentUsername = currentUserInfo ? currentUserInfo.username : null;
  console.log("currentUsername", currentUsername);
  let currentUserIMG = currentUserInfo ? currentUserInfo.profilePicURL : null;

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

  const getMessages = () => {
    dispatch(requestMessages());

    fetch("/messages")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveAllMessages(json.allMessages));
      })
      .catch((error) => console.log(error));

    // fetch("/get-received-messages", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     currentUser: currentUsername,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     console.log(json);
    //     setReceivedMessages(json.receivedMessages);
    //     dispatch(receiveReceivedMessages(json.receivedMessages));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // fetch("/get-sent-messages", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     currentUser: currentUsername,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     console.log(json);
    //     setSentMessages(json.sentMessages);
    //     dispatch(receiveSentMessages(json.sentMessages));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  React.useEffect(() => {
    getMessages();
  }, []);

  let receivedMessagesFrom = [];

  if (receivedMessages.length > 0) {
    const compare = (a, b) => {
      if (a.sender < b.sender) {
        return -1;
      }
      if (a.sender > b.sender) {
        return 1;
      }
      return 0;
    };
    const receivedMessagesSortedBySender = receivedMessages.sort(compare);
    receivedMessagesFrom.push(receivedMessagesSortedBySender[0].sender);
    for (let i = 1; i < receivedMessagesSortedBySender.length; i++) {
      if (
        receivedMessagesSortedBySender[i].sender !==
        receivedMessagesSortedBySender[i - 1].sender
      ) {
        receivedMessagesFrom.push(receivedMessagesSortedBySender[i].sender);
      }
    }
  }

  console.log(receivedMessagesFrom);

  const [selectedSuggestion, setSelectedSuggestion] = React.useState(0);
  const isSelected = (index) => {
    return index === selectedSuggestion;
  };

  console.log(selectedSuggestion);

  return (
    <>
      {" "}
      {messagesStatus === "messages-requested" && (
        <>
          <Header />
          <Loading />{" "}
        </>
      )}
      {messagesStatus === "messages-received" && (
        <>
          <Header />
          <MessagesDiv>
            <InboxDiv>
              {" "}
              <InboxTitle>INBOX</InboxTitle>
              <SnippetDiv>
                {receivedMessagesFrom.map((sender, index) => {
                  return (
                    <div
                      key={index}
                      active={isSelected(index).toString()}
                      onClick={() => setSelectedSuggestion(index)}
                    >
                      <ConversationSnippet sender={sender} />{" "}
                    </div>
                  );
                })}{" "}
              </SnippetDiv>
            </InboxDiv>
            {receivedMessages.length > 0 && (
              <ConversationDiv>
                <ConversationTitle>
                  CONVERSATION WITH {receivedMessagesFrom[selectedSuggestion]}
                </ConversationTitle>
                <BottomDiv>
                  <ConvoDiv>
                    <Conversation
                      sender={receivedMessagesFrom[selectedSuggestion]}
                    />
                  </ConvoDiv>{" "}
                  <Chat receiver={receivedMessagesFrom[selectedSuggestion]} />
                </BottomDiv>
              </ConversationDiv>
            )}{" "}
            {receivedMessages.length === 0 && (
              <ConversationDiv>
                <ConversationTitle></ConversationTitle>
              </ConversationDiv>
            )}
          </MessagesDiv>
        </>
      )}
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
  /* height: calc(100vh - 150px); */
`;
const InboxDiv = styled.div`
  flex: 1;
  height: calc(100vh - 100px);
  position: relative;
`;

const InboxTitle = styled.h2`
  padding: 10px;
  background-color: var(--mint-green);
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
`;

const ConversationDiv = styled.div`
  flex: 1;
  height: calc(100vh - 100px);
  position: relative;
  width: 100%;
`;

const BottomDiv = styled.div`
  height: calc(100vh - 150px);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 50px;
`;

const ConversationTitle = styled.h2`
  padding: 10px;
  background-color: var(--mint-green);
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
`;

const SnippetDiv = styled.div`
  position: absolute;
  top: 50px;
  overflow-y: scroll;
  height: calc(100vh - 150px);
  width: 100%;
`;

const ConvoDiv = styled.div`
  overflow-y: scroll;
  width: 100%;
`;

export default Messages;
