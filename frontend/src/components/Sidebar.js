import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          <div className="sb-sidenav-menu-heading">Core</div>
          <Link className="nav-link" to="/admin/dashboard"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
            Dashboard
          </Link>
          <Link className="nav-link" to="/admin/users"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>
            Users
          </Link>

          <div className="sb-sidenav-menu-heading">Church Management</div>
          <Link className="nav-link" to="/admin/members"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-users"></i></div>
            Church Members
          </Link>
          <Link className="nav-link" to="/admin/visitors"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-user-plus"></i></div>
            Visitors
          </Link>
          <Link className="nav-link" to="/admin/departments"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-layer-group"></i></div>
            Departments
          </Link>
          <Link className="nav-link" to="/admin/daughter-churches"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-church"></i></div>
            Daughter Churches
          </Link>

          <div className="sb-sidenav-menu-heading">Operations</div>
          <Link className="nav-link" to="/admin/attendance"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-clipboard-check"></i></div>
            Attendance System
          </Link>
          <Link className="nav-link" to="/admin/finance"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-coins"></i></div>
            Finance
          </Link>
          <Link className="nav-link" to="/admin/inventory"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-boxes"></i></div>
            Church Inventory
          </Link>

          <div className="sb-sidenav-menu-heading">Spiritual Growth</div>
          <Link className="nav-link" to="/admin/sermons"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
            Sermons
          </Link>
          <Link className="nav-link" to="/admin/events"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-calendar-alt"></i></div>
            Events
          </Link>

          <div className="sb-sidenav-menu-heading">System</div>
          <Link className="nav-link" to="/admin/settings"> {/* Updated path */}
            <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
            System Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;