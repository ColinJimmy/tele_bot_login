import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [telegramAvailable, setTelegramAvailable] = useState(false);

  // Check if Telegram WebApp is available on component mount
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log('Telegram WebApp initialized');
      setTelegramAvailable(true);
      
      // Set the WebApp properties
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.ready();
    } else {
      console.warn('Telegram WebApp is not available');
      setTelegramAvailable(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setError('');
      
      if (!username || !password) {
        setError('Please enter both username and password');
        return;
      }
      
      console.log('Attempting login...');
      const response = await fetch('https://api.voxcue.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Login response received:', response.ok);

      if (response.ok && data.token) {
        console.log('Login successful, token received');
        
        if (window.Telegram && window.Telegram.WebApp) {
          console.log('Preparing to send data to Telegram');
          // Send properly formatted data as JSON string with token property
          const dataToSend = JSON.stringify({ token: data.token });
          console.log('Sending data to Telegram:', dataToSend);
          
          window.Telegram.WebApp.sendData(dataToSend);
          console.log('Data sent, preparing to close WebApp');
          window.Telegram.WebApp.close();
        } else {
          console.error('Telegram WebApp not available for sending data');
          setError('Cannot communicate with Telegram. Please try again or restart the app.');
        }
      } else {
        console.error('Login failed:', data.error);
        setError(data.error || 'Invalid login credentials!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Login to Diary Bot</h2>
      {!telegramAvailable && (
        <div style={styles.warning}>
          Warning: Not running in Telegram environment.
        </div>
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>Login</button>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  input: {
    width: '250px',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    width: '250px',
    padding: '12px',
    marginTop: '15px',
    backgroundColor: '#0088cc', // Telegram blue
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: '15px',
    textAlign: 'center',
  },
  warning: {
    backgroundColor: '#ffd700',
    color: '#333',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    textAlign: 'center',
    width: '250px',
  }
};

export default App;