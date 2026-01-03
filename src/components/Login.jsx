import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>WRC Relay</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
