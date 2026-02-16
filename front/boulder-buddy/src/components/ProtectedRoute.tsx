import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE as string;

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const handleLogin = () => {
    window.location.href = `${API_URL}/accounts/google/login/`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <div style={{ fontSize: 18, color: '#666' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        gap: 16
      }}>
        <h2 style={{ fontSize: 24, color: '#333', margin: 0 }}>Please log in to continue</h2>
        <p style={{ fontSize: 16, color: '#666' }}>You need to be logged in to use Boulder Buddy</p>
        <button
          onClick={handleLogin}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Login with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}