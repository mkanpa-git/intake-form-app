import { useState, useContext, useEffect } from "react";
import { Link, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LanguageSelect from './components/shared/LanguageSelect/LanguageSelect';
import { useTranslation } from 'react-i18next';
import Profile from './pages/Profile';
// import "./form.css"; // Old theme - commented out
import FormPage from "./pages/FormPage";
import Dashboard from "./pages/Dashboard";
import BusinessProfile from "./pages/BusinessProfile";
import ThemeToggle from './components/shared/ThemeToggle';
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
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
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

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    handleThemeChange(next);
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
          <div className="brand">{t('brand')}</div>
        </div>

        <nav className={`right ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setPage('dashboard')}>
            {t('dashboard')}
          </Link>
          {!user && (
            <a href={`${server}/auth/login`}>{t('login')}</a>
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
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                    {t('profile')}
                  </Link>
                  <a href={`${server}/auth/logout`}>{t('logout')}</a>
                </div>
              )}
            </div>
          )}
          <LanguageSelect />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </nav>
      </header>


      <main className="form-main">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/business/:businessId" element={<BusinessProfile />} />
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
        <a href="#privacy">{t('privacyPolicy')}</a>
      </footer>
    </div>
  );
}

export default App;



