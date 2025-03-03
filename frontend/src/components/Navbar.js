import { useState } from "react";

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      {/* Navbar Brand */}
      <a className="navbar-brand ps-3" href="/">Church Management</a>

      {/* Search Bar */}
      <form className="d-none d-md-inline-block form-inline ms-auto me-3">
        <div className="input-group">
          <input className="form-control" type="text" placeholder="Search..." aria-label="Search" />
          <button className="btn btn-primary" type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>

      {/* User Dropdown */}
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <a 
            className="nav-link dropdown-toggle" 
            id="userDropdown" 
            href="#" 
            role="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
          </a>

          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Logout</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
