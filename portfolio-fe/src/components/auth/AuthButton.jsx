import { useAuth0 } from '@auth0/auth0-react';

const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <img 
            src={user?.picture} 
            alt={user?.name}
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Log Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default AuthButton; 