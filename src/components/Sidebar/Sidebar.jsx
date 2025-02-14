import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ChevronDown, ChevronRight, LayoutDashboard, Users, Settings, QrCode, BedDouble, AppWindow, BaggageClaim, MessageCircleMore, ClipboardList, NotebookText } from 'lucide-react';
import LogoutButton from '../LogoutBtn/logout';
import { motion } from 'framer-motion';
import './Sidebar.scss';

const Sidebar = ({ isExpanded, onToggle, onLogout }) => {
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isHomePageOpen, setIsHomePageOpen] = useState(false);
  const textAnimation = {hidden: { opacity: 0, x: -40 },visible: {opacity: 1,x: 0,transition: {delayChildren: 0.5,delay:0.3,staggerChildren: 0.05,},},};
  const textAnimationDropDown = {hidden: { opacity: 0, x: -10 },visible: {opacity: 1,x: 0,transition: {delayChildren: 0.1,staggerChildren: 0.05,},},};

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={onToggle}>
        <Menu size={24} />
      </button>
      <nav className="nav-menu">
        {/* <NavLink to="/admin/secure-dashboard-9281/dashboard" className="nav-link">
          <LayoutDashboard size={20} />
          {isExpanded && (
            <motion.span variants={textAnimation} initial="hidden" animate="visible">
              Dashboard
            </motion.span>
          )}
        </NavLink> */}

        {/* <div className="nav-dropdown">
          <button className="dropdown-trigger" onClick={() => setIsUsersOpen(!isUsersOpen)} >
            <Users size={20} />
            {isExpanded && (
              <>
                <motion.span variants={textAnimation} initial="hidden" animate="visible">
                  Users
                </motion.span>
                {isUsersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </button>

          {isUsersOpen && isExpanded && (
            <div className="dropdown-content">
              <NavLink to="/admin/users-clients-45812/users/clients" className="nav-link">
                <motion.span variants={textAnimationDropDown} initial="hidden" animate="visible" >
                  Clients
                </motion.span>
              </NavLink>
              
              <NavLink to="/admin/users-admins-95841/users/admins" className="nav-link">
                <motion.span variants={textAnimationDropDown} initial="hidden" animate="visible">
                  Admins
                </motion.span>
              </NavLink>
            </div>
          )}
        </div> */}

        <div className="nav-dropdown">
          <button className="dropdown-trigger" onClick={() => setIsProductsOpen(!isProductsOpen)}>
            <BedDouble size={20} />
            {isExpanded && (
              <>
                <motion.span variants={textAnimation} initial="hidden" animate="visible">
                  Products
                </motion.span>
                {isProductsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </button>

          {isProductsOpen && isExpanded && (
            <div className="dropdown-content">
              <NavLink to="/admin/product-list-78234/productlist" className="nav-link">
                <motion.span variants={textAnimationDropDown} initial="hidden" animate="visible">
                  Product List
                </motion.span>
              </NavLink>
              <NavLink to="/admin/product-management-49182/productManagement" className="nav-link">
                <motion.span variants={textAnimationDropDown} initial="hidden" animate="visible" >
                  Product Management
                </motion.span>
              </NavLink>
              <NavLink to="/admin/custom-popups-58193/popups" className="nav-link">
                <motion.span variants={textAnimationDropDown} initial="hidden" animate="visible">
                  Pop-Ups
                </motion.span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-dropdown">
          <button
            className="dropdown-trigger"
            onClick={() => setIsHomePageOpen(!isHomePageOpen)}
          >
            <AppWindow size={20} />
            {isExpanded && (
              <>
                <motion.span variants={textAnimation} initial="hidden" animate="visible">
                  Home Page
                </motion.span>
                {isHomePageOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </button>
          
          {isHomePageOpen && isExpanded && (
            <div className="dropdown-content">
              <NavLink to="/admin/homepage-carousel-43912/carouselhomepage" className="nav-link">
                <motion.span variants={textAnimationDropDown} initial="hidden" animate="visible" >
                  Carousel
                </motion.span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/generate-qrcode-89431/qrcode" className="nav-link">
          <QrCode size={20} />
          {isExpanded && (
            <motion.span variants={textAnimation} initial="hidden" animate="visible" >
              QrCode
            </motion.span>
          )}
        </NavLink>

        <NavLink to="/admin/manage-commandes-28493/commandes" className="nav-link">
          <BaggageClaim size={20} />
          {isExpanded && (
            <motion.span variants={textAnimation} initial="hidden" animate="visible">
              Commandes
            </motion.span>
          )}
        </NavLink>

        <NavLink to="/admin/chat-support-98241/chat" className="nav-link">
          <MessageCircleMore size={20} />
          {isExpanded && (
            <motion.span variants={textAnimation} initial="hidden" animate="visible" >
              Chat
            </motion.span>
          )}
        </NavLink>

        <NavLink to="/admin/options-96257/options" className="nav-link">
          <ClipboardList size={20} />
          {isExpanded && (
            <motion.span variants={textAnimation} initial="hidden" animate="visible" >
              Options
            </motion.span>
          )}
        </NavLink>

        <NavLink to="/admin/categories-68583/categories" className="nav-link">
          <NotebookText size={20} />
          {isExpanded && (
            <motion.span variants={textAnimation} initial="hidden" animate="visible" >
              Categories
            </motion.span>
          )}
        </NavLink>

        <NavLink to="/admin/settings-38129/settings" className="nav-link">
          <Settings size={20} />
          {isExpanded && (
            <motion.span variants={textAnimation} initial="hidden" animate="visible" >
              Settings
            </motion.span>
          )}
        </NavLink>

        <div className="logoutBtnStyle" onClick={onLogout}>
          <LogoutButton/>
        </div>

      </nav>
    </aside>
  );
};

export default Sidebar;