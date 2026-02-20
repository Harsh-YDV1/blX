import { useState, useEffect, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/likeComment.css";

function LikeCommentSection({ itemId, itemType }) {
  const { user } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch likes and comments
  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [itemId, itemType, user]);

  const fetchLikes = async () => {
    try {
      const q = query(
        collection(db, "likes"),
        where("itemId", "==", itemId),
        where("itemType", "==", itemType)
      );
      const snap = await getDocs(q);
      setLikeCount(snap.size);

      if (user) {
        const userLike = snap.docs.find((d) => d.data().userEmail === user.email);
        setIsLiked(!!userLike);
      }
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, "itemComments"),
        where("itemId", "==", itemId),
        where("itemType", "==", itemType)
      );
      const snap = await getDocs(q);
      setComments(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like");
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        const q = query(
          collection(db, "likes"),
          where("itemId", "==", itemId),
          where("itemType", "==", itemType),
          where("userEmail", "==", user.email)
        );
        const snap = await getDocs(q);
        snap.docs.forEach((d) => deleteDoc(d.ref));
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        // Like
        await addDoc(collection(db, "likes"), {
          itemId,
          itemType,
          userEmail: user.email,
          userName: user.displayName || user.email.split("@")[0],
          userPhotoURL: user.photoURL,
          timestamp: new Date(),
        });
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "itemComments"), {
        itemId,
        itemType,
        text: newComment,
        userEmail: user.email,
        userName: user.displayName || user.email.split("@")[0],
        userPhotoURL: user.photoURL,
        timestamp: new Date(),
      });

      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId, commentEmail) => {
    if (user?.email !== commentEmail) {
      alert("You can only delete your own comments");
      return;
    }

    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteDoc(doc(db, "itemComments", commentId));
      await fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="like-comment-section">
      <div className="like-comment-buttons">
        {/* Like Button */}
        <button
          className={`like-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
          title={isLiked ? "Unlike" : "Like"}
        >
          <span className="heart-icon">♥</span>
          <span className="count">{likeCount}</span>
        </button>

        {/* Comment Button */}
        <button
          className="comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="comment-icon">💬</span>
          <span className="count">{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <h4>Comments ({comments.length})</h4>

          {user ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="comment-input"
              />
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={loading || !newComment.trim()}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </form>
          ) : (
            <p className="login-prompt">Login to comment</p>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <img
                      src={comment.userPhotoURL || "https://i.imgur.com/6VBx3io.png"}
                      alt={comment.userName}
                      className="comment-avatar"
                    />
                    <div className="comment-info">
                      <strong>{comment.userName}</strong>
                      <small>
                        {comment.timestamp
                          ? new Date(comment.timestamp).toLocaleDateString()
                          : "Just now"}
                      </small>
                    </div>
                    {user?.email === comment.userEmail && (
                      <button
                        className="delete-comment-btn"
                        onClick={() =>
                          handleDeleteComment(comment.id, comment.userEmail)
                        }
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

export default LikeCommentSection;
