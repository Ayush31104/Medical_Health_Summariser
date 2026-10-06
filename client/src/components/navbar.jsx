import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("mediclarity_token");
  const storedUser = localStorage.getItem("mediclarity_user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const isLoggedIn = Boolean(token && user);

  const handleLogout = () => {
    localStorage.removeItem("mediclarity_token");
    localStorage.removeItem("mediclarity_user");

    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
            <img
  src="/logo.png"
  alt="MediClarity"
  className="h-11 w-11 rounded-xl object-cover"
/>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              MediClarity
            </h1>

            <p className="text-sm text-slate-500">
              Medical Health Summariser
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">

          <Link
            to="/"
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              isActive("/")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            Home
          </Link>

          <Link
            to="/patients"
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              isActive("/patients")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            Patients
          </Link>

          <Link
            to="/upload-report"
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              isActive("/upload-report")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            Upload Report
          </Link>

        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">

          {isLoggedIn ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">
                  {user.name || "User"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {user.role || "Healthcare User"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "U"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;