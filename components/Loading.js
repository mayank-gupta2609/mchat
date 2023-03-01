import React from 'react'
import styled from "styled-components";


function Loading() {
  return (
    <Container>  
      <img src="https://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="" />
    </Container>
  )
}

export default Loading;

const Container = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;
`
