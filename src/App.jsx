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
      
      // Set background color to match Telegram theme
      if (window.Telegram.WebApp.colorScheme) {
        document.body.style.backgroundColor = 
          window.Telegram.WebApp.colorScheme === 'dark' ? '#212121' : '#f4f4f4';
      }
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
      
      const response = await fetch('https://api.voxcue.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        if (window.Telegram && window.Telegram.WebApp) {
          // Get the Telegram user ID from initData
          const initData = window.Telegram.WebApp.initData;
          const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
          const userId = initDataUnsafe?.user?.id;
          
          console.log('Telegram User ID:', userId);
          
          // Send both token and Telegram user ID
          const dataToSend = {
            token: data.token,
            telegram_user_id: userId,
            initData: initData  // Send the entire initData for verification
          };
          
          console.log('Sending data to bot:', dataToSend);
          window.Telegram.WebApp.sendData(JSON.stringify(dataToSend));
          
          // Close the WebApp after a small delay
          setTimeout(() => {
            window.Telegram.WebApp.close();
          }, 300);
        }
      } else {
        setError(data.error || 'Invalid login credentials!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    }
  };

  // Dynamic styles based on Telegram theme
  const getStyles = () => {
    const isDark = window.Telegram?.WebApp?.colorScheme === 'dark';
    
    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: isDark ? '#212121' : '#f4f4f4',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        color: isDark ? '#ffffff' : '#000000',
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
        backgroundColor: isDark ? '#333333' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
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
        color: '#ff4444',
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
  };

  const styles = getStyles();

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

export default App;