import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../../assets/logo3.svg";
import logos from "../../assets/images";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>AccessHub</h1>
          <p className="hero-subtitle">
            Streamlined User Access Management for Modern Organizations
          </p>
          <div className="cta-buttons">
            <button className="primary-btn" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src={logo} alt="AccessHub dashboard preview" />
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Authentication</h3>
            <p>JWT-based authentication with role-based access control</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Role Management</h3>
            <p>
              Employee, Manager, and Admin roles with appropriate permissions
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Access Requests</h3>
            <p>Employees can request software access with detailed reasons</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Approval Workflow</h3>
            <p>Managers can review and approve/reject access requests</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section">
        <h2>Built With Modern Technologies</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <img src={logos.react} alt="React" />
            <span>React</span>
          </div>
          <div className="tech-item">
            <img src={logos.nodelogo} alt="Node.js" />
            <span>Node.js</span>
          </div>
          <div className="tech-item">
            <img src={logos.postgresqllogo} alt="PostgreSQL" />
            <span>PostgreSQL</span>
          </div>
          <div className="tech-item">
            <img src={logos.typeorm} alt="TypeORM" />
            <span>TypeORM</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to streamline your access management?</h2>
        <button
          className="primary-btn large-btn"
          onClick={() => navigate("/signup")}
        >
          Start Free Trial
        </button>
      </section>
    </div>
  );
};

export default Home;
