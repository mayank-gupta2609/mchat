import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import styled from "styled-components";

function Login() {

    const signIn = () => {
        signInWithPopup(auth, provider).catch(alert)
    }

    return (
        <div style={{height:'100vh',  width:'100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button onClick={signIn}  >
                Sign In
            </Button>
        </div>
    )
}

export default Login;
 

const Button = styled.div`
    background-color:orange;
    height:40px;
    width:80px;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:4px;
    font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;

    :hover {
        opacity: 0.7
    }
`;