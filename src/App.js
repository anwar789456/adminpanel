import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Dashboard from './pages/dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Clients from './pages/users/Clients';
import Admins from './pages/users/Admins';
import QrCode from './pages/qrcode/Qrcode';
import Carousel from './pages/carousel/Carousel';
import ProductList from './pages/productlist/ProductList';
import Popups from './pages/popups/Popups';
import Commandes from './pages/commandes/Commandes';
import ProductManagement from './pages/productmanagement/productManagement';
import Chat from './pages/chat/Chat';
import Options from './pages/options/Options';
import Category from './pages/category/Category'
import './styles/global.scss';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [user, setUser] = useState(null);

  // Theme toggle logic
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Sidebar toggle logic
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Restore user session on page refresh
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser)); // Load user data from session if available
    }

    // Check if the theme is saved in localStorage and apply it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to light mode if no theme is saved
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // Logout functionality
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    window.location.href = '/admin';
  };

  // Login Component
  function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
      e.preventDefault();
      if (username === 'admin' && password === 'satraco2013') {
        const userData = { username, role: 'admin' };
        sessionStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData); // Pass the user data to parent
      } else {
        alert('Invalid username or password');
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '🙉'}
              </button>
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter basename="/admin">
        <div className={`app-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
          {user ? (
            <>
              <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} onLogout={handleLogout} />
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
              <main className="main-content">
                <Routes>
                  <Route path="/admin/secure-dashboard-9281/dashboard" element={<Dashboard />} />
                  <Route path="/admin/users-clients-45812/users/clients" element={<Clients />} />
                  <Route path="/admin/users-admins-95841/users/admins" element={<Admins />} />
                  <Route path="/admin/generate-qrcode-89431/qrcode" element={<QrCode />} />
                  <Route path="/admin/homepage-carousel-43912/carouselhomepage" element={<Carousel />} />
                  <Route path="/admin/product-list-78234/productlist" element={<ProductList />} />
                  <Route path="/admin/custom-popups-58193/popups" element={<Popups />} />
                  <Route path="/admin/manage-commandes-28493/commandes" element={<Commandes />} />
                  <Route path="/admin/product-management-49182/productManagement" element={<ProductManagement />} />
                  <Route path="/admin/chat-support-98241/chat" element={<Chat />} />
                  <Route path="/admin/settings-38129/settings" element={<Settings />} />
                  <Route path="/admin/options-96257/options" element={<Options />} />
                  <Route path="/admin/categories-68583/categories" element={<Category />} />
                </Routes>
              </main>
            </>
          ) : (
            <Login onLogin={setUser} />
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
