import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

function DSAProgress() {
  const [progressList, setProgressList] = useState([]);

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

      setMessage("DSA progress saved successfully");

      setForm({
        topic: "",
        total_questions: "",
        solved_questions: "",
      });

      fetchProgress();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save DSA progress");
    }
  };

  const deleteProgress = async (progressId) => {
    setMessage("");
    setError("");

    try {
      await API.delete(`/dsa/${progressId}`);
      setMessage("DSA progress deleted successfully");
      fetchProgress();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete progress");
    }
  };

  const editProgress = (item) => {
    setForm({
      topic: item.topic,
      total_questions: item.total_questions,
      solved_questions: item.solved_questions,
    });
  };

  const getPercentage = (solved, total) => {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  };

  return (
    <>
      <Navbar />

      <div className="table-container">
        <h1>DSA Progress Tracker</h1>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <div className="form-container">
          <h2>Add / Update Progress</h2>

          <form onSubmit={addOrUpdateProgress}>
            <input
              type="text"
              name="topic"
              placeholder="Topic e.g. Arrays"
              value={form.topic}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="total_questions"
              placeholder="Total Questions"
              value={form.total_questions}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="solved_questions"
              placeholder="Solved Questions"
              value={form.solved_questions}
              onChange={handleChange}
              required
            />

            <button type="submit">Save Progress</button>
          </form>
        </div>

        <h2>My DSA Topics</h2>

        {progressList.length === 0 && (
          <p>No DSA progress added yet.</p>
        )}

        {progressList.map((item) => {
          const percentage = getPercentage(
            item.solved_questions,
            item.total_questions
          );

          return (
            <div className="company-card" key={item.id}>
              <h3>{item.topic}</h3>

              <p>
                <strong>Solved:</strong> {item.solved_questions} /{" "}
                {item.total_questions}
              </p>

              <p>
                <strong>Completion:</strong> {percentage}%
              </p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage}%
                </div>
              </div>

              <button
                className="secondary-btn"
                onClick={() => editProgress(item)}
              >
                Edit
              </button>

              <button
                className="danger-btn"
                onClick={() => deleteProgress(item.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DSAProgress;
