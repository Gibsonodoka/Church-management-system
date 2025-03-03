import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          <div className="sb-sidenav-menu-heading">Core</div>
          <Link className="nav-link" to="/dashboard">
            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
            Dashboard
          </Link>
          <Link className="nav-link" to="/members">
            <div className="sb-nav-link-icon"><i className="fas fa-users"></i></div>
            Members
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
