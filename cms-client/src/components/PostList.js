// import React, { useEffect, useState } from 'react';

// function PostList({ user }) {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/posts')
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data.posts)) {
//           setPosts(data.posts);
//         } else {
//           console.warn("Unexpected response:", data);
//         }
//       })
//       .catch(err => {
//         console.error("Error fetching posts:", err);
//       });
//   }, []);

//   return (


//     <div style={{ padding: '20px' }}>
//   <h2>All Posts</h2>

//   {user && (
//     <h3 style={{ marginBottom: '20px' }}>
//     <h2>Welcome, <span style={{ color: 'teal' }}>{user.username}</span></h2> 
//     </h3>
//   )}

//   {posts.length === 0 ? (
//     <p>No posts available.</p>
//   ) : (
//     <div
//       style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//         gap: '20px'
//       }}
//     >
//       {posts.map((post) => (
//         <div
//           key={post._id}
//           style={{
//             border: '1px solid teal',
//             padding: '15px',
//             borderRadius: '10px',
//             backgroundColor: '#f9f9f9'
//           }}
//         >
//           <h3>{post.title}</h3>
//           <p>{post.content}</p>

//           {(post.mediaUrl || post.imageUrl) && (
//             (post.mediaUrl || post.imageUrl).match(/\.(mp4|webm)$/i) ? (
//               <video
//                 controls
//                 style={{ width: '100%', maxHeight: '250px', borderRadius: '8px' }}
//               >
//                 <source
//                   src={`http://localhost:5000/uploads/${post.mediaUrl || post.imageUrl}`}
//                   type="video/mp4"
//                 />
//                 Your browser does not support the video tag.
//               </video>
//             ) : (
//               <img
//                 src={`http://localhost:5000/uploads/${post.mediaUrl || post.imageUrl}`}
//                 alt="Post"
//                 style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px' }}
//               />
//             )
//           )}

//           <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
//             <strong>By:</strong> {post.username || 'Unknown'}<br />
//             <strong>At:</strong> {new Date(post.createdAt).toLocaleString()}
//           </p>
//         </div>
//       ))}
//     </div>
//   )}
// </div>

//   );
// }

// export default PostList;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      });
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleEdit = (post) => {
    navigate('/create', { state: { postToEdit: post } });
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (res.ok) {
      setPosts(posts.filter(post => post._id !== postId));
    } else {
      alert('❌ Failed to delete post');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FEE3D8', minHeight: '100vh' }}>
      <h2>All Posts</h2>

      {user && (
        <h2 style={{ marginBottom: '20px' }}>
          👋 Welcome, <span style={{ color: 'teal' }}>{user.username}</span>
        </h2>
      )}

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}
        >
          {posts.map((post) => {
            const isExpanded = expandedPostId === post._id;
            const shouldTruncate = post.content.length > 150;

            return (
              <div className="post-card" key={post._id}>
                <h3>{post.title}</h3>

                <div
                  className="post-content"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '10px',
                  }}
                >
                  {post.content}
                </div>

                {shouldTruncate && (
                  <button className="toggle-btn" onClick={() => toggleExpand(post._id)}>
                    {isExpanded ? 'Less' : 'More'}
                  </button>
                )}

                {(post.mediaUrl || post.imageUrl) &&
                  ((post.mediaUrl || post.imageUrl).match(/\.(mp4|webm)$/i) ? (
                    <video
                      controls
                      style={{ width: '100%', maxHeight: '250px', borderRadius: '8px' }}
                    >
                      <source
                        src={`http://localhost:5000/uploads/${post.mediaUrl || post.imageUrl}`}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      src={`http://localhost:5000/uploads/${post.mediaUrl || post.imageUrl}`}
                      alt="Post"
                      style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <p className="info">
                    <strong>By:</strong> {post.username || 'Unknown'} <br />
                    <strong>At:</strong> {new Date(post.createdAt).toLocaleString()}
                  </p>

                  {/* Role-Based Actions */}
                  <div>
                    {(user && (user.role === 'editor' || user.role === 'admin')) && (
                      <button
                        style={{
                          backgroundColor: '#FDA481',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                    )}

                    {user && user.role === 'admin' && (
                      <button
                        style={{
                          backgroundColor: '#B4182D',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          .post-card {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 15px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .post-card:hover {
            background-color: #F3DADF;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }

          .info {
            font-size: 14px;
            color: #555;
          }

          .toggle-btn {
            background: none;
            border: none;
            color: #0D1E4C;
            font-weight: bold;
            margin-bottom: 10px;
            cursor: pointer;
            padding: 0;
          }

          .toggle-btn:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
}

export default PostList;
