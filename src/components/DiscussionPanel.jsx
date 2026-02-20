import { useState, useEffect, useContext } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/discussion.css";

function DiscussionPanel() {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, "culturalComments"),
          orderBy("timestamp", "desc")
        );
        const snap = await getDocs(q);
        setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
    // Refresh comments every 5 seconds
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "culturalComments"), {
        text: newComment,
        userName: user.displayName || user.email?.split("@")[0],
        userEmail: user.email,
        userPhotoURL: user.photoURL,
        timestamp: serverTimestamp(),
      });

      setNewComment("");
      // Refresh comments immediately after adding
      const q = query(
        collection(db, "culturalComments"),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  // Delete comment (only own comments)
  const handleDeleteComment = async (commentId, commentEmail) => {
    if (user?.email !== commentEmail) {
      alert("You can only delete your own comments");
      return;
    }

    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteDoc(doc(db, "culturalComments", commentId));
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="discussion-container">
      <button
        className="discussion-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        💬 Cultural Discussion
        <span className="comment-badge">{comments.length}</span>
      </button>

      {isExpanded && (
        <div className="discussion-panel">
          <h3>Community Discussion</h3>
          <p className="discussion-subtitle">Share your thoughts about our culture</p>

          {user ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your cultural insights..."
                className="comment-input"
                rows="3"
              />
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={loading || !newComment.trim()}
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="login-prompt">Login to share your thoughts</p>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to share!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <img
                      src={comment.userPhotoURL || "https://i.imgur.com/6VBx3io.png"}
                      alt={comment.userName}
                      className="comment-avatar"
                    />
                    <div className="comment-user-info">
                      <strong>{comment.userName}</strong>
                      <small>
                        {comment.timestamp
                          ? new Date(comment.timestamp.toDate()).toLocaleDateString()
                          : "Just now"}
                      </small>
                    </div>
                    {user?.email === comment.userEmail && (
                      <button
                        className="delete-comment-btn"
                        onClick={() => handleDeleteComment(comment.id, comment.userEmail)}
                        title="Delete comment"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscussionPanel;
