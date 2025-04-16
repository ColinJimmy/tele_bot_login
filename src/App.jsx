import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const response = await fetch('https://api.voxcue.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Log success to console
      console.log('Login successful');

      // Check if Telegram.WebApp is available (i.e., running inside Telegram app)
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
        window.Telegram.WebApp.sendData(data.token); // Send token to Telegram bot
      } else {
        console.warn('Telegram WebApp is not available. The user may not be in the Telegram app.');
        // Handle fallback behavior, like showing a message or redirecting to a Telegram app if needed.
      }
    } else {
      // Show error in popup if login failed
      alert(data.error || 'Invalid login credentials!');
      setError(data.error || 'Invalid login credentials!');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Login</h2>
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
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  input: {
    width: '250px',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    width: '250px',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
  },
};

export default App;
