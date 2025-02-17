import { useAuth0 } from '@auth0/auth0-react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';

const CommentForm = ({ projectId, onCommentAdded }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const authFetch = useAuthenticatedFetch();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      onCommentAdded(response);
      setContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
        className="w-full p-2 border rounded"
        disabled={!isAuthenticated}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!isAuthenticated || !content.trim()}
      >
        {isAuthenticated ? 'Post Comment' : 'Login to Comment'}
      </button>
    </form>
  );
};

export default CommentForm; 