import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const role = user.role; // admin | faculty | student

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/dashboard" className="text-xl font-bold tracking-wide">
            📚 EduTrack
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link to="/dashboard" className="hover:text-indigo-200 transition">
              Dashboard
            </Link>

            {role === "admin" && (
              <Link to="/users" className="hover:text-indigo-200 transition">
                Users
              </Link>
            )}

            {(role === "admin" || role === "faculty") && (
              <>
                <Link to="/students" className="hover:text-indigo-200 transition">
                  Students
                </Link>
                <Link to="/faculty" className="hover:text-indigo-200 transition">
                  Faculty
                </Link>
              </>
            )}

            <Link to="/courses" className="hover:text-indigo-200 transition">
              Courses
            </Link>
            <Link to="/assignments" className="hover:text-indigo-200 transition">
              Assignments
            </Link>
            <Link to="/exams" className="hover:text-indigo-200 transition">
              Exams
            </Link>
          </div>

          {/* User info & logout */}
          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-500 rounded-full px-3 py-1 capitalize">
              {role}
            </span>
            <span className="text-sm hidden sm:inline">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
