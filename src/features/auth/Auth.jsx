import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser } from "./authSlice";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "succeeded" && isAuthenticated) {
      navigate("/");
    }
  }, [status, isAuthenticated, navigate]);

  useEffect(() => {
    if (status === "succeeded" && !isLogin && !isAuthenticated) {
      setSuccess(
        "Registration successful! Please login with your credentials."
      );
      setIsLogin(true);
      setUserData({
        name: "",
        username: userData.username,
        password: "",
      });
    }
  }, [status, isLogin, isAuthenticated, userData.username]);

  const handleChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");

    if (isLogin) {
      dispatch(loginUser(userData));
    } else {
      dispatch(registerUser(userData));
    }
  };

  const isLoggedIn =
    isAuthenticated ||
    (localStorage.getItem("token") && localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {isLoggedIn ? (
            <div className="text-center">
              <p className="mb-4">
                Logged in as:{" "}
                <span className="fw-bold">
                  {userData.username || localStorage.getItem("user")}
                </span>
              </p>
              <button
                onClick={handleLogout}
                className="btn btn-danger w-100 mb-3"
              >
                Logout
              </button>
              <button
                onClick={() => navigate("/protected")}
                className="btn btn-secondary w-100"
              >
                Access Protected Route
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Login/Register"
                >
                  <input
                    type="radio"
                    className="btn-check"
                    name="authType"
                    id="login"
                    autoComplete="off"
                    checked={isLogin}
                    onChange={() => setIsLogin(true)}
                  />
                  <label className="btn btn-outline-primary" htmlFor="login">
                    Login
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="authType"
                    id="register"
                    autoComplete="off"
                    checked={!isLogin}
                    onChange={() => setIsLogin(false)}
                  />
                  <label className="btn btn-outline-primary" htmlFor="register">
                    Register
                  </label>
                </div>
              </div>

              <h2 className="text-center mb-4">
                {isLogin ? "Login" : "Register"}
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={userData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label htmlFor="username" className="form-label">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={userData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={userData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === "loading"}
                  >
                    {status === "loading"
                      ? "Loading..."
                      : isLogin
                      ? "Login"
                      : "Register"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
