import { useAuth0 } from "@auth0/auth0-react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useState } from "react";
import { Button, Textarea, Stack } from "@mantine/core";

interface CommentFormProps {
  projectId: string;
  onCommentAdded: (comment: any) => void;
}

const CommentForm = ({ projectId, onCommentAdded }: CommentFormProps) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const authFetch = useAuthenticatedFetch();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      onCommentAdded(response);
      setContent("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="md">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
          disabled={!isAuthenticated}
        />
        <Button
          type="submit"
          disabled={!isAuthenticated || !content.trim()}
          color="blue"
        >
          {isAuthenticated ? "Post Comment" : "Login to Comment"}
        </Button>
      </Stack>
    </form>
  );
};

export default CommentForm; 