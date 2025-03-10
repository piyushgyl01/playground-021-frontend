import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice.js";

export default function AppBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light position-sticky top-0 z-3 py-3 shadow-sm"
        style={{
          backgroundColor: "#f8f9fc",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="container-fluid px-4">
          <Link
            className="navbar-brand d-flex align-items-center fs-3 fw-bold text-decoration-none 
              text-dark
              transition transform hover:scale-105 hover:opacity-80"
            to="/"
          >
            <i className="bi bi-image-fill me-3 text-primary"></i>
            Picsilfy
          </Link>

          <button
            className="navbar-toggler p-2 border-0 
              bg-light 
              focus:ring-2 focus:ring-primary 
              transition-all duration-300"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <Link
                  className="nav-link text-dark px-3 py-2 rounded-3 
                    transition-all duration-300 
                    hover:bg-light 
                    hover:text-primary"
                  to="/albums"
                >
                  Albums
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-dark px-3 py-2 rounded-3 
                    transition-all duration-300 
                    hover:bg-light 
                    hover:text-primary"
                  to="/albums/shared"
                >
                  Shared
                </Link>
              </li>

              {user ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-dark px-3 py-2 rounded-3 
                      d-flex align-items-center 
                      transition-all duration-300 
                      hover:bg-light 
                      hover:text-primary"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i
                      className="bi bi-person-circle me-2 text-primary"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                    {user.name}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end 
                    bg-white border-light shadow-lg rounded-4 p-2 mt-2"
                    style={{
                      backgroundColor: "#f8f9fc",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item rounded-3 d-flex align-items-center 
                          text-dark
                          transition-all duration-300 
                          hover:bg-light"
                        to="/profile"
                      >
                        <i className="bi bi-person me-3 text-primary"></i>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item rounded-3 d-flex align-items-center 
                          text-dark
                          transition-all duration-300 
                          hover:bg-light"
                        to="/settings"
                      >
                        <i className="bi bi-gear me-3 text-primary"></i>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger rounded-3 d-flex align-items-center 
                          transition-all duration-300 
                          hover:bg-light"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-3"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-dark px-3 py-2 rounded-3 
                        transition-all duration-300 
                        hover:bg-light 
                        hover:text-primary"
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-primary rounded-pill px-4 py-2 
                        shadow-sm border-0 
                        transition-all duration-300 
                        hover:shadow-lg 
                        active:scale-95"
                      to="/register"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
