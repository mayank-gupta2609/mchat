import React, { useState } from 'react'
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faXmark, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import ChatItem from './ChatItem';
import { signOut } from "firebase/auth";
import { db, auth } from '../firebase';
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, addDoc, query, where } from "firebase/firestore";
import * as EmailValidator from "email-validator";
import { useAuthState } from 'react-firebase-hooks/auth';
 



function Sidebar() {

  const [hide, setHide] = useState(true)
  const [user] = useAuthState(auth);
  console.log(user)
  const [ recipient, setRecipient] = useState('')
  const userChatRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user.email)
  );

  const [chatsSnapshot] = useCollection(userChatRef);
  // const userRef = collection(db, "users");

  const handleMessageClick = () =>{
      setHide(false)
  }

  const hideMessageModal = () =>{ 
    setHide(true)
  }

  const createChat = (e) => {
    e.preventDefault()
    
    if(!recipient) return null; 

    if(EmailValidator.validate(recipient) && !chatExists(recipient))
    {
      const coll = collection(db, "chats");
      // const user_  = collection(db, "users");
      // const foundUser =   query(user_, where("email", "==", recipient))
      // console.log(foundUser);
      addDoc(coll, {
        users:[user.email, recipient]
      })

    }
    // console.log(recipient);
    setRecipient('');
    setHide(true)
  }

  const chatExists = (recipientEmail) =>
  !!chatsSnapshot?.docs.find(
    (chat) =>
      chat.data().users.find((user) => user === recipientEmail) !== undefined
  );

  return (
    <>

    <Container>

      <Header>

      <div style={{display:'flex', alignItems: 'center'}}>
        <img src={user?.photoURL ? user.photoURL : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="" height="46px" style={{marginLeft:'5px', borderRadius:'100px', marginTop:'5px', marginRight:'10px'}} />
        <p>
          {user?.displayName}
        </p>
      </div>
 
      <IconContainer>
       

      <FontAwesomeIcon icon={faMessage} className="fas fa-check" style={{ color: "orange" }} onClick={handleMessageClick}></FontAwesomeIcon>
      
      <FontAwesomeIcon icon={faRightFromBracket} className="fa-duotone fa-ellipsis-vertical" style={{ color: "orange" }}
      onClick={()=>signOut(auth)}
      >
      
      </FontAwesomeIcon>  

      </IconContainer>
      </Header>
      
      <ChatList>
        {chatsSnapshot ?.docs.map((chat) =>(
            <ChatItem key={chat.id} id={chat.id} users={chat.data().users}/> 

        ))}
      
      </ChatList>
      
    </Container>
    <div  >
      
      <ModalMessage style={{display: hide ? 'none' : '', backdropFilter: 'blur(10px)' }}>
      
      <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#191825', padding:'15px', borderRadius:'15px'}}>
      <FontAwesomeIcon icon={faXmark} onClick={hideMessageModal}
       className="fa-duotone fa-ellipsis-vertical" style={{ color: "orange", height:'20px', marginBottom:'10px' }}>
      </FontAwesomeIcon>  


        <form onSubmit={createChat}>
          <div style={{ alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
          <h3>Enter email Id of the Receipient you want to chat with</h3>
          <Input type="text" value={recipient} onChange = {(e)=>setRecipient(e.target.value)}/>
          </div>
        </form>
      </div>
      </ModalMessage> 
    </div>
    </>
  )
}

export default Sidebar;


const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center; 
  top:0;
  position:fixed; 
  width:333px;
  z-index:999; 
  height:70px;
  background-color:black;
`;

const Container = styled.div` 
  border-right:1px solid whitesmoke;
  height:100vh;
  max-width: 400px; 
  color:white;
  overflow-y:scroll;
  font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;
`;

const IconContainer = styled.div`
  display:flex;
  marginRight: 10px;
  padding:10px;
  padding-right:10px;
  width:70px;
  justify-content:space-between;
`;

const ModalMessage = styled.div`
  display:flex;
  flex-direction:column;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); 
  align-items:center;
  justify-content:center; 
   -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  z-index:10000; 
  height:100vh;
  width:100vw;
  
`;

const ChatList = styled.div`
  width:382px;
  margin-top:70px;  
`;


const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px; 
  padding: 20px;
  margin-left: 15px;
  margin-top:10px;
  margin-right: 15px;
  height:20px;
  width:420px;
  font-size:20px;
`;