import ChatPage from 'components/ChatPage';
import Sidebar from 'components/Sidebar';
import styled from "styled-components";
import Head from "next/head";
import {
    orderBy,
    query,
    getDocs,
    collection,
    doc,
    getDoc,
  } from "firebase/firestore";
import React from 'react'
import { auth, db } from '../../../firebase'
import getRecipientEmail from 'utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';

function Chat({chat, messages}) { 

    const [user] = useAuthState(auth)
    return (
        <Container>
            <Head>
                <title>mChat</title>
            </Head>
            <Sidebar />
            <ChatContainer>

            <ChatPage messages={messages} chat={chat}/>
            </ChatContainer>
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const docRef = doc(db, `chats/${context.query.id}`);
    const colRef = collection(db, `chats/${context.query.id}/messages`);
   
    const messagesQuery = query(colRef, orderBy("timestamp", "asc"));
    const messagesRes = await getDocs(messagesQuery);
  
    const messages = messagesRes.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .map((msgs) => ({
        ...msgs,
        timestamp: msgs.timestamp.toDate().getTime(),
      }));
   
    const chatRes = await getDoc(docRef);
    const chat = {
      id: chatRes.id,
      ...chatRes.data(),
    };
  
    return {
      props: {
        messages: JSON.stringify(messages),
        chat: chat,
      },
    };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
