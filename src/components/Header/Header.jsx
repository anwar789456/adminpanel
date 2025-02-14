import { Sun, Moon, Menu } from 'lucide-react';
import './Header.scss';

const Header = ({ isDarkMode, toggleTheme, toggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1>Admin Panel</h1>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
