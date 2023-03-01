import { useState, useRef } from 'react'
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import {auth, db} from '../firebase';
import {
    collection,
    doc,
    orderBy,
    query,
    setDoc,
    Timestamp,
    addDoc,
    where,
} from "firebase/firestore";
import getRecipientEmail from 'utils/getRecipientEmail';
import Message from './Message';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import TimeAgo from "timeago-react";


function ChatPage({chat, messages}) {
  const [user] = useAuthState(auth);
  const [ input, setInput ] = useState("");
  const endOfMessagesRef = useRef(null);
  const router = useRouter();

  const [messagesSnapshot] = useCollection(
    query(
      collection(db, `chats/${router.query.id}/messages`),
      orderBy("timestamp", "asc")
    )
  );
  
//   console.log(props)
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };


  const recipient = recipientSnapshot?.docs?.[0]?.data();

  // console.log(recipient)

  const sendMessage = (e) => {
    e.preventDefault();
    const docRef = doc(db, `chats/${user.uid}`);
    
    setDoc(
      docRef,{ lastActive: Timestamp.now() },{ merge: true }
    );

    const colRef = collection(db, `chats/${router.query.id}/messages`);
    addDoc(colRef, {
      timestamp: Timestamp.now(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  }

  const [hide, setHide] = useState(true)
  const [img, imgUrl] = useState("")

  // const handleImgClick = (e) => { 
  //   setHide(false);
  //   console.log(e.target.src)
  //   imgUrl(e.target.src)
  // }

  return (
    <Container>
        <Header> 
          <HeaderInformation>
          <ImgHolder 
          // onClick={handleImgClick}
          >
        {recipient ? (<img src={recipient.photoURL} style={{borderRadius:'50%'}} height="60px" />) : (<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" style={{borderRadius:'50%'}} height="60px" alt={recipient}/>) }
      </ImgHolder> 
             <div>

            <h2>{recipient?.name}</h2>
            {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastActive?.toDate() ? (
                <TimeAgo datetime={recipient?.lastActive?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
             </div>
            </HeaderInformation>
            
        </Header>
        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessagesRef} />
        </MessageContainer>

        <InputContainer>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button disabled={!input} type="submit" onClick={sendMessage}>
        <FontAwesomeIcon icon={faPaperPlane} className="fas fa-check" style={{ color: "orange" }} ></FontAwesomeIcon>
        </Button>
        </InputContainer>

        <ImgDiv style={{display: hide ? 'none' : '' }}>
      <div>
            <img src={img} id="zoomedImg" height="210px"/> 
      </div>
      <div>
      <FontAwesomeIcon icon={faMessage} className="fas fa-check" style={{ color: "orange" }} ></FontAwesomeIcon>
      

      </div>
      </ImgDiv>
    </Container>
  )
}

export default ChatPage

const Container = styled.div`
font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;
`;

const Header = styled.div`
  position: sticky; 
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  width:1100px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  background-color:black;

  div>p{
    font-size:14px;
    color:gray;
  }
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  display: flex;
  align-items: center;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;
 

const MessageContainer = styled.div`
  padding: 30px; 
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;


const ImgHolder = styled.div`
  justify-content: center;
  align-items: center;
  display: flex; 
  padding-right:25px; 
  padding-bottom:5px;
  padding-top:5px; 
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #212121;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px; 
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;


const ImgDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); 
  border: 1px solid whitesmoke;
  height:250px;
  width:250px;
  justify-content: center;
  display: flex; 
`;

const Button = styled.div` 
    :hover {
        opacity: 0.7
    }
`;