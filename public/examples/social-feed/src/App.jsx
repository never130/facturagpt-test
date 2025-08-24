import React, { useState, useEffect } from 'react';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import { getPosts } from './utils/posts';
import { getCurrentUser } from './utils/userData';
import './styles/Social.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, userData] = await Promise.all([
          getPosts(),
          getCurrentUser()
        ]);
        setPosts(postsData);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreatePost = (newPost) => {
    const postWithUser = {
      ...newPost,
      id: Date.now(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isShared: false
    };
    setPosts(prevPosts => [postWithUser, ...prevPosts]);
    setShowCreatePost(false);
  };

  const handleLikePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked
            }
          : post
      )
    );
  };

  const handleCommentPost = (postId, comment) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, {
                id: Date.now(),
                text: comment,
                author: currentUser,
                createdAt: new Date().toISOString()
              }]
            }
          : post
      )
    );
  };

  const handleSharePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              shares: post.isShared ? post.shares - 1 : post.shares + 1,
              isShared: !post.isShared
            }
          : post
      )
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando feed...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📱</span>
            <h1>SocialFeed</h1>
          </div>
          
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              🏠 Inicio
            </button>
            <button
              className={`nav-tab ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              🔥 Trending
            </button>
            <button
              className={`nav-tab ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              👥 Siguiendo
            </button>
          </nav>
          
          <div className="header-actions">
            <button
              className="create-post-btn"
              onClick={() => setShowCreatePost(true)}
            >
              ✏️ Crear Post
            </button>
            
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => setShowProfile(!showProfile)}
              >
                {currentUser?.avatar || '👤'}
              </button>
              <span className="username">{currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <div className="sidebar-section">
              <h3>📊 Estadísticas</h3>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {posts.reduce((total, post) => total + post.likes, 0)}
                  </span>
                  <span className="stat-label">Likes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {posts.reduce((total, post) => total + post.comments.length, 0)}
                  </span>
                  <span className="stat-label">Comentarios</span>
                </div>
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>🔥 Trending Topics</h3>
              <div className="trending-topics">
                <div className="topic">#ReactJS</div>
                <div className="topic">#JavaScript</div>
                <div className="topic">#WebDev</div>
                <div className="topic">#Programming</div>
                <div className="topic">#TechNews</div>
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>👥 Sugerencias</h3>
              <div className="suggestions">
                <div className="suggestion-item">
                  <span className="suggestion-avatar">👨‍💻</span>
                  <div className="suggestion-info">
                    <div className="suggestion-name">John Doe</div>
                    <div className="suggestion-bio">Desarrollador Full Stack</div>
                  </div>
                  <button className="follow-btn">Seguir</button>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-avatar">👩‍💻</span>
                  <div className="suggestion-info">
                    <div className="suggestion-name">Jane Smith</div>
                    <div className="suggestion-bio">UX Designer</div>
                  </div>
                  <button className="follow-btn">Seguir</button>
                </div>
              </div>
            </div>
          </aside>
          
          <div className="feed-container">
            {showCreatePost && (
              <CreatePost
                currentUser={currentUser}
                onSubmit={handleCreatePost}
                onCancel={() => setShowCreatePost(false)}
              />
            )}
            
            <Feed
              posts={posts}
              currentUser={currentUser}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onShare={handleSharePost}
              activeTab={activeTab}
            />
          </div>
          
          {showProfile && (
            <Profile
              user={currentUser}
              posts={posts.filter(post => post.author.id === currentUser.id)}
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>SocialFeed</h4>
            <p>Conectando personas a través de la tecnología</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="#about">Acerca de</a></li>
              <li><a href="#privacy">Privacidad</a></li>
              <li><a href="#terms">Términos</a></li>
              <li><a href="#help">Ayuda</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📧 support@socialfeed.com</p>
            <p>📞 +1 234 567 890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SocialFeed. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 