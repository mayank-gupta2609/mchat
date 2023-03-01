import { useState } from 'react'
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import getRecipientEmail from 'utils/getRecipientEmail';
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from '../firebase'
 
function ChatItem({id, users}) {
 
  const [hide, setHide] = useState(true)
  const [img, imgUrl] = useState("")

  const handleImgClick = (e) => { 
    setHide(false);
    console.log(e.target.src)
    imgUrl(e.target.src)
  }

  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const router = useRouter();
  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );

  const recipientUser = recipientSnapshot?.docs?.[0]?.data(); 
  console.log(recipientUser);

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  return (
    <>

    <Container onClick={enterChat} >
      <ImgHolder onClick={handleImgClick}>
        {recipientUser ? (<img src={recipientUser.photoURL} style={{borderRadius:'50%'}} height="60px" />) : (<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" style={{borderRadius:'50%'}} height="60px" alt={recipientUser}/>) }
      </ImgHolder>

      <TextHolder >
      <div>

            <h4>{recipientUser?.name}</h4> 
      </div>
      </TextHolder>
    </Container>
   

      <ImgDiv style={{display: hide ? 'none' : '' }}>
      <div>
            <img src={img} id="zoomedImg" height="210px"/> 
      </div>
      <div>
      <FontAwesomeIcon icon={faMessage} className="fas fa-check" style={{ color: "orange" }} ></FontAwesomeIcon>
      

      </div>
      </ImgDiv>
    </>
  )
}

export default ChatItem


const Container = styled.div`
    display:flex;
    height:80px;
    width:382px;
    background-color:#212121;
    padding-top: 10px;  
    :hover {
       opacity:0.7;
        cursor: pointer;
        transition:0.15s ease-in-out;   
    }
`;

const ImgHolder = styled.div`
  justify-content: center;
  align-items: center;
  display: flex; 
  padding-left:5px; 
  padding-bottom:5px;
  padding-top:5px; 
`;


const TextHolder = styled.div`
    width:350px;
    border-bottom: 1px solid whitesmoke;
    align-items: left;
    justify-content: center;
    flex-direction: column;
    display: flex;
    margin-left:15px
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