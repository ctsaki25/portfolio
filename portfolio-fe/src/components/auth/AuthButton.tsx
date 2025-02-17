import { useAuth0 } from "@auth0/auth0-react";
import { Button, Avatar, Group } from "@mantine/core";
import { LogoutOptions } from '@auth0/auth0-react';

const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <Group>
      {isAuthenticated ? (
        <>
          <Avatar src={user?.picture} alt={user?.name || ""} radius="xl" />
          <Button
            variant="filled"
            color="red"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </>
      ) : (
        <Button
          variant="filled"
          color="blue"
          onClick={() => loginWithRedirect()}
        >
          Log In
        </Button>
      )}
    </Group>
  );
};

export default AuthButton; 