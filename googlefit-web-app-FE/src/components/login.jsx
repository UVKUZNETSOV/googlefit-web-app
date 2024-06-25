import { GoogleLogin } from 'react-google-login';

const clientId = ''; // Your CLIENT ID from google cloud console project

function Login() {

  const onSuccess = (res) => {
    console.log("Login OK", res.profileObj);
    console.log("Login OK", res);
  }

  const onFailure = (res) => {
    console.log("Failure", res);
  }

  return(
    <div id="signInButton">
      <GoogleLogin 
        clientId={clientId}
        buttonText='Login'
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy='single-host-origin'
        isSignedIn={true}
      />
    </div>
  )

}

export default Login;

