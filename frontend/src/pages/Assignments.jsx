import { useEffect, useState } from "react";
import API from "../api/axios";
import useAuth from "../auth/useAuth";

const Assignments = () => {
  const { user } = useAuth();
  const role = user?.role;
  const canMutate = role === "admin" || role === "faculty";
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", course: "", faculty: "", dueDate: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try { const res = await API.get("/assignments"); setAssignments(res.data.data); }
    catch { setError("Failed to fetch assignments"); }
  };

  const fetchMeta = async () => {
    try {
      const [cRes, fRes] = await Promise.all([API.get("/courses"), API.get("/faculty")]);
      setCourses(cRes.data.data);
      setFacultyList(fRes.data.data);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchAssignments(); if (canMutate) fetchMeta(); }, [canMutate]);

  const resetForm = () => {
    setForm({ title: "", description: "", course: "", faculty: "", dueDate: "" });
    setEditingId(null); setShowForm(false); setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    try {
      if (editingId) await API.put(`/assignments/${editingId}`, form);
      else await API.post("/assignments", form);
      resetForm(); fetchAssignments();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      description: a.description || "",
      course: a.course?._id || a.course,
      faculty: a.faculty?._id || a.faculty,
      dueDate: a.dueDate ? a.dueDate.substring(0, 10) : "",
    });
    setEditingId(a._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try { await API.delete(`/assignments/${id}`); fetchAssignments(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        {canMutate && (
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
            {showForm ? "Cancel" : "+ Add Assignment"}
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      {canMutate && showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input type="date" required placeholder="Due Date" value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
            <option value="">Select Course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.courseCode} — {c.courseName}</option>)}
          </select>
          {role === "admin" && (
            <select required value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
              <option value="">Select Faculty</option>
              {facultyList.map((f) => <option key={f._id} value={f._id}>{f.user?.name || "–"}</option>)}
            </select>
          )}
          <textarea placeholder="Description (optional)" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
            className="sm:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
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
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Faculty</th>
              <th className="px-6 py-3">Due Date</th>
              {canMutate && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={a._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{i + 1}</td>
                <td className="px-6 py-3 font-medium">{a.title}</td>
                <td className="px-6 py-3">{a.course?.courseName || "–"}</td>
                <td className="px-6 py-3">{a.faculty?.user?.name || "–"}</td>
                <td className="px-6 py-3">{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "–"}</td>
                {canMutate && (
                  <td className="px-6 py-3 flex gap-2">
                    <button onClick={() => handleEdit(a)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(a._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr><td colSpan={canMutate ? 6 : 5} className="text-center py-6 text-gray-400">No assignments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
