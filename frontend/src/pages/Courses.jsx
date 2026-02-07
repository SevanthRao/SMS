import { useEffect, useState } from "react";
import API from "../api/axios";
import useAuth from "../auth/useAuth";

const Courses = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [form, setForm] = useState({ courseCode: "", courseName: "", credits: 3, department: "", faculty: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try { const res = await API.get("/courses"); setCourses(res.data.data); }
    catch { setError("Failed to fetch courses"); }
  };

  const fetchFaculty = async () => {
    try { const res = await API.get("/faculty"); setFacultyList(res.data.data); }
    catch { /* ignore */ }
  };

  useEffect(() => { fetchCourses(); if (isAdmin) fetchFaculty(); }, [isAdmin]);

  const resetForm = () => {
    setForm({ courseCode: "", courseName: "", credits: 3, department: "", faculty: "" });
    setEditingId(null); setShowForm(false); setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    try {
      const payload = { ...form };
      if (!payload.faculty) delete payload.faculty;
      if (editingId) await API.put(`/courses/${editingId}`, payload);
      else await API.post("/courses", payload);
      resetForm(); fetchCourses();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
  };

  const handleEdit = (c) => {
    setForm({
      courseCode: c.courseCode,
      courseName: c.courseName,
      credits: c.credits,
      department: c.department,
      faculty: c.faculty?._id || c.faculty || "",
    });
    setEditingId(c._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await API.delete(`/courses/${id}`); fetchCourses(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
            {showForm ? "Cancel" : "+ Add Course"}
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      {isAdmin && showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Course Code" value={form.courseCode}
            onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required placeholder="Course Name" value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required type="number" min="1" max="10" placeholder="Credits" value={form.credits}
            onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input required placeholder="Department" value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
            <option value="">Select Faculty (optional)</option>
            {facultyList.map((f) => <option key={f._id} value={f._id}>{f.user?.name || "–"} — {f.department}</option>)}
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
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Credits</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Faculty</th>
              {isAdmin && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{i + 1}</td>
                <td className="px-6 py-3 font-mono">{c.courseCode}</td>
                <td className="px-6 py-3 font-medium">{c.courseName}</td>
                <td className="px-6 py-3">{c.credits}</td>
                <td className="px-6 py-3">{c.department}</td>
                <td className="px-6 py-3">{c.faculty?.user?.name || "–"}</td>
                {isAdmin && (
                  <td className="px-6 py-3 flex gap-2">
                    <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan={isAdmin ? 7 : 6} className="text-center py-6 text-gray-400">No courses found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;
