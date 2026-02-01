import { useState } from 'react';

const API_URL = '';

function App() {
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/kayitol`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(`Registered: ${data.username}`);
      setRegisterForm({ username: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/giris`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);

      setMessage(data.message);
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const loadUsers = async () => {
    const res = await fetch(`${API_URL}/api/kullanicilar`);
    const data = await res.json();
    setUsers(data);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1e1e1e',
        color: '#fff',
      }}
    >
      <div style={{ width: 500 }}>
        <h1 style={{ textAlign: 'center' }}>Can Deneme</h1>

        {message && <p style={{ color: 'lightgreen', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ color: 'salmon', textAlign: 'center' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          {/* REGISTER */}
          <form onSubmit={handleRegister} style={{ flex: 1 }}>
            <h3>Register</h3>
            <input name="username" placeholder="Username" onChange={handleRegisterChange} value={registerForm.username} />
            <input name="email" placeholder="Email" onChange={handleRegisterChange} value={registerForm.email} />
            <input type="password" name="password" placeholder="Password" onChange={handleRegisterChange} value={registerForm.password} />
            <button type="submit">Register</button>
          </form>

          {/* LOGIN */}
          <form onSubmit={handleLogin} style={{ flex: 1 }}>
            <h3>Login</h3>
            <input name="email" placeholder="Email" onChange={handleLoginChange} value={loginForm.email} />
            <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} value={loginForm.password} />
            <button type="submit">Login</button>
          </form>
        </div>

        <hr style={{ margin: '20px 0' }} />

        <button onClick={loadUsers} style={{ width: '100%' }}>
          Load Users
        </button>

        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.username} — {u.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
