import { useState, useContext, useEffect } from "react";
import { Link, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Profile from './pages/Profile';
// import "./form.css"; // Old theme - commented out
import FormPage from "./pages/FormPage";
import Dashboard from "./pages/Dashboard";
import ThemeSettings from './components/shared/ThemeSettings';
import './App.css'; // App specific styles, kept for now

// Jules Theme CSS Files
import "./jules_tokens.css";
import "./jules_base.css";
import "./jules_layout.css";
import "./jules_button.css";
import "./jules_input.css";
import "./jules_stepper.css";
import "./jules_section.css";
import "./jules_groupfield.css";
import "./jules_tablelayout.css";
import "./jules_misc.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [currentId, setCurrentId] = useState(null);
  const [currentService, setCurrentService] = useState('childcare');
  const [theme, setTheme] = useState('system');
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const server = process.env.REACT_APP_SERVER_URL || '';

  useEffect(() => {
    const applySystemTheme = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    };

    if (theme === 'system') {
      applySystemTheme();
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', applySystemTheme);
      return () => mq.removeEventListener('change', applySystemTheme);
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem('themePreference');
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const handleThemeChange = (value) => {
    setTheme(value);
    if (value === 'system') {
      localStorage.removeItem('themePreference');
    } else {
      localStorage.setItem('themePreference', value);
    }
  };

  const startApplication = (serviceKey, id) => {
    setCurrentService(serviceKey);
    setCurrentId(id);
    setPage('form');
  };

  const exitForm = () => {
    setPage('dashboard');
  };

  return (
    <div className="page-container">
      <header className="form-header">
        <div className="header-left">
          <button
            className="hamburger"
            aria-label="Main menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <div className="brand">ModelCity Services</div>
        </div>

        <nav className={`right ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </Link>
          {!user && (
            <a href={`${server}/auth/login`}>Login</a>
          )}
          {user && (
            <div className="user-menu">
              <button
                type="button"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                className="avatar"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user.first_name ? user.first_name[0] : 'U'}
              </button>
              {userMenuOpen && (
                <div className="dropdown" role="menu">
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                  <a href={`${server}/auth/logout`}>Logout</a>
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setThemeModalOpen(true)}
            className="theme-toggle"
          >
            Day/Night View
          </button>
        </nav>
      </header>
      <ThemeSettings
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        value={theme}
        onChange={handleThemeChange}
      />

      <main className="form-main">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route
            path="*"
            element={
              page === 'dashboard' ? (
                <Dashboard onStart={startApplication} />
              ) : (
                <FormPage
                  applicationId={currentId}
                  service={currentService}
                  onExit={exitForm}
                />
              )
            }
          />
        </Routes>
      </main>

      <footer className="form-footer">
        <span>© 2025 City of Service</span>
        <a href="#privacy">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default App;



