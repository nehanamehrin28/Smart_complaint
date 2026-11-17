
import { useEffect, useState } from "react";

type Status = "Pending" | "In Progress" | "Resolved";

type Complaint = {
  id: string;
  name: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  location: string;
  status: Status;
  date: string;
};

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("smartcare_complaints") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Infrastructure",
    priority: "Medium",
    title: "",
    description: "",
    location: ""
  });

  useEffect(() => {
    localStorage.setItem(
      "smartcare_complaints",
      JSON.stringify(complaints)
    );
  }, [complaints]);

  const total = complaints.length;
  const pending = complaints.filter(
    c => c.status === "Pending"
  ).length;
  const progress = complaints.filter(
    c => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter(
    c => c.status === "Resolved"
  ).length;

  const submitComplaint = (e: React.FormEvent) => {
    e.preventDefault();

    const newComplaint: Complaint = {
      ...form,
      id: "SC-" + Date.now().toString().slice(-6),
      status: "Pending",
      date: new Date().toLocaleDateString()
    };

    setComplaints(prev => [newComplaint, ...prev]);

    alert(
      "Complaint submitted successfully! Your ID is " +
      newComplaint.id
    );

    setForm({
      name: "",
      category: "Infrastructure",
      priority: "Medium",
      title: "",
      description: "",
      location: ""
    });

    setPage("complaints");
  };

  const updateStatus = (id: string, status: Status) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status } : c
      )
    );
  };

  const filtered = complaints.filter(c =>
    [
      c.id,
      c.name,
      c.title,
      c.category,
      c.status
    ].some(value =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="app">

      <aside className="sidebar">
        <h2>Smart<span>Care</span></h2>
        <p className="tagline">Your Complaint, Our Responsibility.</p>

        <nav>
          <button onClick={() => setPage("dashboard")}>
            🏠 Dashboard
          </button>

          <button onClick={() => setPage("submit")}>
            ✍️ Submit Complaint
          </button>

          <button onClick={() => setPage("complaints")}>
            📋 My Complaints
          </button>
        </nav>

        <div className="sidebar-bottom">
          <p>SmartCare System</p>
          <small>College Complaint Portal</small>
        </div>
      </aside>

      <main className="main">

        <header className="topbar">
          <div>
            <h2>SmartCare Portal</h2>
            <p>Manage and track your complaints</p>
          </div>
          <div className="profile">SC</div>
        </header>

        {page === "dashboard" && (
          <section>
            <div className="welcome">
              <h1>Welcome to SmartCare 👋</h1>
              <p>
                Submit your complaints and track their
                progress easily.
              </p>
              <button onClick={() => setPage("submit")}>
                + Submit a Complaint
              </button>
            </div>

            <h2 className="section-title">
              Complaint Overview
            </h2>

            <div className="stats">
              <div className="stat-card">
                <h3>Total Complaints</h3>
                <h1>{total}</h1>
                <span>All complaints</span>
              </div>

              <div className="stat-card">
                <h3>Pending</h3>
                <h1>{pending}</h1>
                <span>Awaiting action</span>
              </div>

              <div className="stat-card">
                <h3>In Progress</h3>
                <h1>{progress}</h1>
                <span>Being processed</span>
              </div>

              <div className="stat-card">
                <h3>Resolved</h3>
                <h1>{resolved}</h1>
                <span>Successfully completed</span>
              </div>
            </div>

            <h2 className="section-title">
              Recent Complaints
            </h2>

            <ComplaintList
              complaints={complaints.slice(0, 5)}
              updateStatus={updateStatus}
            />
          </section>
        )}

        {page === "submit" && (
          <section className="form-section">
            <h1>Submit a Complaint</h1>
            <p>Provide the details of your issue below.</p>

            <form onSubmit={submitComplaint}>
              <label>Student Name</label>
              <input
                required
                placeholder="Enter your name"
                value={form.name}
                onChange={e =>
                  setForm({...form, name: e.target.value})
                }
              />

              <label>Complaint Category</label>
              <select
                value={form.category}
                onChange={e =>
                  setForm({...form, category: e.target.value})
                }
              >
                <option>Infrastructure</option>
                <option>Hostel</option>
                <option>Library</option>
                <option>Transport</option>
                <option>Canteen</option>
                <option>Academics</option>
                <option>Other</option>
              </select>

              <label>Priority</label>
              <select
                value={form.priority}
                onChange={e =>
                  setForm({...form, priority: e.target.value})
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <label>Complaint Title</label>
              <input
                required
                placeholder="Enter complaint title"
                value={form.title}
                onChange={e =>
                  setForm({...form, title: e.target.value})
                }
              />

              <label>Location</label>
              <input
                required
                placeholder="Enter location"
                value={form.location}
                onChange={e =>
                  setForm({...form, location: e.target.value})
                }
              />

              <label>Description</label>
              <textarea
                required
                rows={5}
                placeholder="Describe your problem..."
                value={form.description}
                onChange={e =>
                  setForm({...form, description: e.target.value})
                }
              />

              <button type="submit">
                Submit Complaint
              </button>
            </form>
          </section>
        )}

        {page === "complaints" && (
          <section>
            <h1>Complaint Management</h1>
            <p>Search and track your submitted complaints.</p>

            <input
              className="search"
              placeholder="Search by complaint ID, title or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <ComplaintList
              complaints={filtered}
              updateStatus={updateStatus}
            />
          </section>
        )}

      </main>
    </div>
  );
}

function ComplaintList({
  complaints,
  updateStatus
}: {
  complaints: Complaint[];
  updateStatus: (id: string, status: Status) => void;
}) {
  if (complaints.length === 0) {
    return (
      <div className="empty">
        <h3>No complaints found</h3>
        <p>Submitted complaints will appear here.</p>
      </div>
    );
  }

  return (
    <div className="complaint-list">
      {complaints.map(c => (
        <div className="complaint-card" key={c.id}>
          <div className="complaint-header">
            <div>
              <h3>{c.title}</h3>
              <small>{c.id} • {c.date}</small>
            </div>

            <span className={`status ${c.status.toLowerCase().replace(" ", "-")}`}>
              {c.status}
            </span>
          </div>

          <p>{c.description}</p>

          <div className="details">
            <span>👤 {c.name}</span>
            <span>📂 {c.category}</span>
            <span>📍 {c.location}</span>
            <span>⚡ {c.priority} Priority</span>
          </div>

          <label>Update Status (Demo Admin)</label>
          <select
            value={c.status}
            onChange={e =>
              updateStatus(c.id, e.target.value as Status)
            }
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default App;
