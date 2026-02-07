import { useEffect, useState } from "react";
import API from "../api/axios";
import useAuth from "../auth/useAuth";

const Faculty = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [faculty, setFaculty] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user: "", department: "", designation: "", experienceYears: 0 });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchFaculty = async () => {
    try { const res = await API.get("/faculty"); setFaculty(res.data.data); }
    catch { setError("Failed to fetch faculty"); }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.data.filter((u) => u.role === "faculty"));
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchFaculty(); if (isAdmin) fetchUsers(); }, [isAdmin]);

  const resetForm = () => {
    setForm({ user: "", department: "", designation: "", experienceYears: 0 });
    setEditingId(null); setShowForm(false); setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    try {
      if (editingId) await API.put(`/faculty/${editingId}`, form);
      else await API.post("/faculty", form);
      resetForm(); fetchFaculty();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
  };

  const handleEdit = (f) => {
    setForm({
      user: f.user?._id || f.user,
      department: f.department,
      designation: f.designation,
      experienceYears: f.experienceYears,
    });
    setEditingId(f._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty?")) return;
    try { await API.delete(`/faculty/${id}`); fetchFaculty(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty</h1>
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
            {showForm ? "Cancel" : "+ Add Faculty"}
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      {isAdmin && showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select required value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
            <option value="">Select User</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
          </select>
          <input required placeholder="Department" value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required placeholder="Designation" value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required type="number" min="0" placeholder="Experience (years)" value={form.experienceYears}
            onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <button type="submit" className="sm:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Designation</th>
              <th className="px-6 py-3">Experience</th>
              {isAdmin && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {faculty.map((f, i) => (
              <tr key={f._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{i + 1}</td>
                <td className="px-6 py-3 font-medium">{f.user?.name || "–"}</td>
                <td className="px-6 py-3">{f.department}</td>
                <td className="px-6 py-3">{f.designation}</td>
                <td className="px-6 py-3">{f.experienceYears} yrs</td>
                {isAdmin && (
                  <td className="px-6 py-3 flex gap-2">
                    <button onClick={() => handleEdit(f)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(f._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {faculty.length === 0 && (
              <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-6 text-gray-400">No faculty found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faculty;
