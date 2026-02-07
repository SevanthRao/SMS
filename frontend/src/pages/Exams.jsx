import { useEffect, useState } from "react";
import API from "../api/axios";
import useAuth from "../auth/useAuth";

const Exams = () => {
  const { user } = useAuth();
  const role = user?.role;
  const canMutate = role === "admin" || role === "faculty";
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ examName: "", course: "", examDate: "", totalMarks: 100 });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchExams = async () => {
    try { const res = await API.get("/exams"); setExams(res.data.data); }
    catch { setError("Failed to fetch exams"); }
  };

  const fetchCourses = async () => {
    try { const res = await API.get("/courses"); setCourses(res.data.data); }
    catch { /* ignore */ }
  };

  useEffect(() => { fetchExams(); if (canMutate) fetchCourses(); }, [canMutate]);

  const resetForm = () => {
    setForm({ examName: "", course: "", examDate: "", totalMarks: 100 });
    setEditingId(null); setShowForm(false); setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    try {
      if (editingId) await API.put(`/exams/${editingId}`, form);
      else await API.post("/exams", form);
      resetForm(); fetchExams();
    } catch (err) { setError(err.response?.data?.message || "Operation failed"); }
  };

  const handleEdit = (ex) => {
    setForm({
      examName: ex.examName,
      course: ex.course?._id || ex.course,
      examDate: ex.examDate ? ex.examDate.substring(0, 10) : "",
      totalMarks: ex.totalMarks,
    });
    setEditingId(ex._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try { await API.delete(`/exams/${id}`); fetchExams(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exams</h1>
        {canMutate && (
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
            {showForm ? "Cancel" : "+ Add Exam"}
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      {canMutate && showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Exam Name" value={form.examName}
            onChange={(e) => setForm({ ...form, examName: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
            <option value="">Select Course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.courseCode} — {c.courseName}</option>)}
          </select>
          <input type="date" required value={form.examDate}
            onChange={(e) => setForm({ ...form, examDate: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          <input type="number" required min="1" placeholder="Total Marks" value={form.totalMarks}
            onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
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
              <th className="px-6 py-3">Exam Name</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total Marks</th>
              {canMutate && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {exams.map((ex, i) => (
              <tr key={ex._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{i + 1}</td>
                <td className="px-6 py-3 font-medium">{ex.examName}</td>
                <td className="px-6 py-3">{ex.course?.courseName || "–"}</td>
                <td className="px-6 py-3">{ex.examDate ? new Date(ex.examDate).toLocaleDateString() : "–"}</td>
                <td className="px-6 py-3">{ex.totalMarks}</td>
                {canMutate && (
                  <td className="px-6 py-3 flex gap-2">
                    <button onClick={() => handleEdit(ex)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(ex._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {exams.length === 0 && (
              <tr><td colSpan={canMutate ? 6 : 5} className="text-center py-6 text-gray-400">No exams found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Exams;
