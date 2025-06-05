import { useState } from "react";
import "./form.css";
import FormPage from "./pages/FormPage";
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page-container">
      <header className="form-header">
        <div className="header-left">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <div className="brand">MyCity Childcare</div>
        </div>

        <nav className={`right ${menuOpen ? "open" : ""}`}>
          <a href="#account">Dashboard</a>
          <a href="#settings">Profile</a>
        </nav>
      </header>

      <main className="form-body">
        <FormPage />
      </main>

      <footer className="form-footer">
        <span>© 2025 City of New York</span>
        <a href="#privacy">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default App;



