import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase'
import moment from "moment/moment";

function Message({user, message}) {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
  console.log(message)


  return (
    <Container>
        <TypeOfMessage>
           <p>
            {message.message}
           </p>
           <h6>
           {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
           </h6>
        </TypeOfMessage>
    </Container>
  )
}

export default Message


const Container = styled.div`
`;

const MessageElement = styled.p`
  width: fit-content; 
  height: fit-content;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 6px; 
  text-align: right; 
  align-items: center; 
  padding-right:10px;
  padding-top:8px;
  padding-left:15px;

  >p{
    font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;
    font-size: 22px;
  }

  >h6{
    margin-top:2px;
    font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;
    color:gray;
  }
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
  color:black;
`;

const Receiver = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
  color: black; 
  padding-left:10px;
  padding-top:5px;
`;