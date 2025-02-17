import { useAuth0 } from "@auth0/auth0-react";
import { Button, Avatar, Group } from "@mantine/core";

const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <Group>
      {isAuthenticated ? (
        <>
          <Avatar src={user?.picture} alt={user?.name || ""} radius="xl" />
          <Button
            variant="filled"
            color="red"
            onClick={() => logout({ returnTo: window.location.origin })}
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