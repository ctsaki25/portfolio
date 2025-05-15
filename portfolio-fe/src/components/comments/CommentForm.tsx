import { useState } from "react";
import { Button, Textarea, Stack } from "@mantine/core";

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface CommentFormProps {
  projectId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm = ({ projectId, onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );
      const data = await response.json();
      onCommentAdded(data);
      setContent("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button type="submit" disabled={!content.trim()} color="blue">
          Post Comment
        </Button>
      </Stack>
    </form>
  );
};

export default CommentForm; 