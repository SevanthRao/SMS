import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import API from "../api/axios";

const StatCard = ({ title, count, emoji }) => (
  <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
    <span className="text-4xl">{emoji}</span>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    faculty: 0,
    courses: 0,
    assignments: 0,
    exams: 0,
  });

  const role = user?.role;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Only fetch endpoints the current role has access to
        const allEndpoints = [
          { key: "users", url: "/users", roles: ["admin"] },
          { key: "students", url: "/students", roles: ["admin", "faculty"] },
          { key: "faculty", url: "/faculty", roles: ["admin", "faculty"] },
          { key: "courses", url: "/courses", roles: ["admin", "faculty", "student"] },
          { key: "assignments", url: "/assignments", roles: ["admin", "faculty", "student"] },
          { key: "exams", url: "/exams", roles: ["admin", "faculty", "student"] },
        ];
        const endpoints = allEndpoints.filter((ep) => ep.roles.includes(role));
        const results = await Promise.allSettled(
          endpoints.map((ep) => API.get(ep.url))
        );
        const newStats = {};
        endpoints.forEach((ep, i) => {
          if (results[i].status === "fulfilled") {
            const d = results[i].value.data;
            newStats[ep.key] = d.count ?? d.data?.length ?? 0;
          } else {
            newStats[ep.key] = "–";
          }
        });
        setStats(newStats);
      } catch {
        /* ignore */
      }
    };
    fetchStats();
  }, [role]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome back, {user?.name} 👋
      </h1>
      <p className="text-gray-500 mb-6 capitalize">Role: {user?.role}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {role === "admin" && <StatCard title="Users" count={stats.users} emoji="👤" />}
        {(role === "admin" || role === "faculty") && (
          <>
            <StatCard title="Students" count={stats.students} emoji="🎓" />
            <StatCard title="Faculty" count={stats.faculty} emoji="🧑‍🏫" />
          </>
        )}
        <StatCard title="Courses" count={stats.courses} emoji="📖" />
        <StatCard title="Assignments" count={stats.assignments} emoji="📝" />
        <StatCard title="Exams" count={stats.exams} emoji="📋" />
      </div>
    </div>
  );
};

export default Dashboard;
