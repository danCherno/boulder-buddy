import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE as string;

export default function Auth() {
  const { user, loading } = useAuth();

  const handleLogin = () => {
    window.location.href = `${API_URL}/accounts/google/login/`;
  };

  const handleLogout = () => {
    window.location.href = `${API_URL}/accounts/logout/`;
  };

  if (loading) {
    return <div style={{ fontSize: 14, color: '#666' }}>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, color: '#666' }}>{user.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          style={{
            padding: '6px 12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Login with Google
        </button>
      )}
    </div>
  );
}