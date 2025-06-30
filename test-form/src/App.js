import { useState, useContext } from "react";
import { Link, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Profile from './pages/Profile';
// import "./form.css"; // Old theme - commented out
import FormPage from "./pages/FormPage";
import Dashboard from "./pages/Dashboard";
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
  const { user } = useContext(AuthContext);

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
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <div className="brand">MyCity Services</div>
        </div>

        <nav className={`right ${menuOpen ? "open" : ""}`}>
          <a
            href="#dashboard"
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </a>
          {!user && (
            <a href="/auth/google">Login</a>
          )}
          {user && (
            <div className="user-menu">
              <button
                type="button"
                aria-label="user menu"
                className="avatar"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user.first_name ? user.first_name[0] : 'U'}
              </button>
              {userMenuOpen && (
                <div className="dropdown">
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                  <a href="/auth/logout">Logout</a>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

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
        <span>© 2025 City of New York</span>
        <a href="#privacy">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default App;



