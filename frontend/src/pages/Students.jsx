import { useEffect, useState } from "react";
import API from "../api/axios";
import useAuth from "../auth/useAuth";

const Students = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user: "", enrollmentNumber: "", department: "", year: 1, guardianName: "", guardianContact: "", feeStatus: "unpaid",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data);
    } catch { setError("Failed to fetch students"); }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.data.filter((u) => u.role === "student"));
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchStudents(); if (isAdmin) fetchUsers(); }, [isAdmin]);

  const resetForm = () => {
    setForm({ user: "", enrollmentNumber: "", department: "", year: 1, guardianName: "", guardianContact: "", feeStatus: "unpaid" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await API.put(`/students/${editingId}`, form);
      } else {
        await API.post("/students", form);
      }
      resetForm();
      fetchStudents();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
  };

  const handleEdit = (s) => {
    setForm({
      user: s.user?._id || s.user,
      enrollmentNumber: s.enrollmentNumber,
      department: s.department,
      year: s.year,
      guardianName: s.guardianName,
      guardianContact: s.guardianContact,
      feeStatus: s.feeStatus,
    });
    setEditingId(s._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try { await API.delete(`/students/${id}`); fetchStudents(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
            {showForm ? "Cancel" : "+ Add Student"}
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
          <input required placeholder="Enrollment Number" value={form.enrollmentNumber}
            onChange={(e) => setForm({ ...form, enrollmentNumber: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required placeholder="Department" value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required type="number" min="1" max="6" placeholder="Year" value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required placeholder="Guardian Name" value={form.guardianName}
            onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required placeholder="Guardian Contact" value={form.guardianContact}
            onChange={(e) => setForm({ ...form, guardianContact: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <select value={form.feeStatus} onChange={(e) => setForm({ ...form, feeStatus: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
          <button type="submit" className="sm:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Enrollment</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Fee Status</th>
              {isAdmin && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{s.user?.name || "–"}</td>
                <td className="px-4 py-3">{s.enrollmentNumber}</td>
                <td className="px-4 py-3">{s.department}</td>
                <td className="px-4 py-3">{s.year}</td>
                <td className="px-4 py-3 capitalize">{s.feeStatus}</td>
                {isAdmin && (
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={isAdmin ? 7 : 6} className="text-center py-6 text-gray-400">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
