import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from './components/Login';
import Scanner from './components/Scanner';
import { submitLog } from './services/sheets';
import { requestPermission } from './services/notifications';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        requestPermission();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleScan = async (decodedText) => {
    if (confirm(`Log Student ID: ${decodedText}?`)) {
        alert(`Logged ID: ${decodedText}`);
    }
  };

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div>
           <div style={{ padding: '20px', textAlign: 'center' }}>
             <h2>WRC Scanner</h2>
             <p>Welcome, {user.displayName}</p>
             <button onClick={() => getAuth().signOut()}>Sign Out</button>
           </div>
           <Scanner onScanSuccess={handleScan} />
        </div>
      )}
    </div>
  );
}

export default App;
