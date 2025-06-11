import { useState } from "react";
import "./form.css";
import FormPage from "./pages/FormPage";
import Dashboard from "./pages/Dashboard";
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [currentId, setCurrentId] = useState(null);
  const [currentService, setCurrentService] = useState('childcare');

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

          <a href="#settings">Profile</a>
        </nav>
      </header>

      <main className="form-body">
        {page === 'dashboard' ? (
          <Dashboard onStart={startApplication} />
        ) : (
          <FormPage
            applicationId={currentId}
            service={currentService}
            onExit={exitForm}
          />
        )}
      </main>

      <footer className="form-footer">
        <span>© 2025 City of New York</span>
        <a href="#privacy">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default App;



