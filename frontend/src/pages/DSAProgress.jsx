import { useEffect, useState } from "react";
import API from "../api/api";

function DSAProgress() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    topic: "",
    total_questions: "",
    solved_questions: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProgress = async () => {
    try {
      const response = await API.get("/dsa/my");
      setProgressList(response.data);
    } catch (err) {
      setError("Failed to load DSA progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addOrUpdateProgress = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/dsa/", {
        topic: form.topic,
        total_questions: Number(form.total_questions),
        solved_questions: Number(form.solved_questions),
      });

      setMessage("Progress saved successfully!");
      setForm({ topic: "", total_questions: "", solved_questions: "" });
      fetchProgress();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save DSA progress");
    }
  };

  const deleteProgress = async (progressId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await API.delete(`/dsa/${progressId}`);
      fetchProgress();
    } catch (err) {
      setError("Failed to delete progress");
    }
  };

  const editProgress = (item) => {
    setForm({
      topic: item.topic,
      total_questions: item.total_questions,
      solved_questions: item.solved_questions,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPercentage = (solved, total) => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((solved / total) * 100));
  };

  if (loading) return <div className="loading-container"><p>Loading DSA stats...</p></div>;

  return (
    <div className="page-container">
      <div className="header-section">
        <h1>DSA Mastery Tracker</h1>
        <p className="subtitle">Monitor your data structures and algorithms preparation progress.</p>
      </div>

      <div className="dsa-layout">
        <div className="card dsa-form-card">
          <h3>Update Progress</h3>
          <form onSubmit={addOrUpdateProgress}>
            <div className="form-group">
              <label>Topic Name</label>
              <input
                type="text"
                name="topic"
                placeholder="e.g. Arrays, Dynamic Programming"
                value={form.topic}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Total Questions</label>
                <input
                  type="number"
                  name="total_questions"
                  placeholder="0"
                  value={form.total_questions}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Solved</label>
                <input
                  type="number"
                  name="solved_questions"
                  placeholder="0"
                  value={form.solved_questions}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary block">Save Topic Progress</button>
          </form>
          {message && <p className="success-msg mt-2">{message}</p>}
          {error && <p className="error-msg mt-2">{error}</p>}
        </div>

        <div className="dsa-list">
          <h3>Your Topics</h3>
          {progressList.length === 0 ? (
            <p className="empty-msg">No topics added yet. Start by adding one!</p>
          ) : (
            <div className="topics-grid">
              {progressList.map((item) => {
                const percentage = getPercentage(item.solved_questions, item.total_questions);
                return (
                  <div className="topic-card card" key={item.id}>
                    <div className="topic-header">
                      <h4>{item.topic}</h4>
                      <div className="topic-actions">
                        <button className="icon-btn edit" onClick={() => editProgress(item)} title="Edit">✎</button>
                        <button className="icon-btn delete" onClick={() => deleteProgress(item.id)} title="Delete">🗑</button>
                      </div>
                    </div>
                    <div className="topic-stats">
                      <span>{item.solved_questions} / {item.total_questions} Solved</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DSAProgress;
