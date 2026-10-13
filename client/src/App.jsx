
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentCourse, setStudentCourse] = useState("BCA");

  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobCompanyId, setJobCompanyId] = useState("");

  async function fetchData() {
    try {
      setError("");

      const endpoints = [
        "/api/students",
        "/api/companies",
        "/api/jobs",
        "/api/applications",
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(`${API}${endpoint}`, { cache: "no-store" })
        )
      );

      const data = await Promise.all(
        responses.map(async (response) => {
          const result = await response.json();

          if (!response.ok) {
            throw new Error("Could not load project data.");
          }

          return result;
        })
      );

      setStudents(Array.isArray(data[0]) ? data[0] : []);
      setCompanies(Array.isArray(data[1]) ? data[1] : []);
      setJobs(Array.isArray(data[2]) ? data[2] : []);
      setApplications(Array.isArray(data[3]) ? data[3] : []);
    } catch (err) {
      setError(
        "Could not connect to the backend. Make sure MySQL and the server are running."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function sendRequest(url, method, body) {
    const response = await fetch(`${API}${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || result.error || "The request failed."
      );
    }

    return result;
  }

  async function addStudent(event) {
    event.preventDefault();
    setFormMessage("");

    try {
      await sendRequest("/api/students", "POST", {
        name: studentName.trim(),
        email: studentEmail.trim(),
        course: studentCourse,
      });

      setStudentName("");
      setStudentEmail("");
      setStudentCourse("BCA");
      setShowStudentForm(false);
      setFormMessage("Student added successfully!");

      await fetchData();
    } catch (err) {
      setFormMessage(`Error: ${err.message}`);
    }
  }

  async function addCompany(event) {
    event.preventDefault();
    setFormMessage("");

    try {
      await sendRequest("/api/companies", "POST", {
        name: companyName.trim(),
        location: companyLocation.trim(),
        website: companyWebsite.trim(),
      });

      setCompanyName("");
      setCompanyLocation("");
      setCompanyWebsite("");
      setShowCompanyForm(false);
      setFormMessage("Company added successfully!");

      await fetchData();
    } catch (err) {
      setFormMessage(`Error: ${err.message}`);
    }
  }

  async function addJob(event) {
    event.preventDefault();
    setFormMessage("");

    try {
      if (!jobCompanyId) {
        throw new Error("Please select a company.");
      }

      await sendRequest("/api/jobs", "POST", {
        title: jobTitle.trim(),
        location: jobLocation.trim(),
        salary: jobSalary === "" ? null : Number(jobSalary),
        companyId: Number(jobCompanyId),
      });

      setJobTitle("");
      setJobLocation("");
      setJobSalary("");
      setJobCompanyId("");
      setShowJobForm(false);
      setFormMessage("Job opening added successfully!");

      await fetchData();
    } catch (err) {
      setFormMessage(`Error: ${err.message}`);
    }
  }

  async function updateApplicationStatus(id, status) {
    setFormMessage("");

    try {
      await sendRequest(
        `/api/applications/${id}/status`,
        "PUT",
        { status }
      );

      setFormMessage("Application status updated successfully!");
      await fetchData();
    } catch (err) {
      setFormMessage(`Error: ${err.message}`);
    }
  }

  function openForm(formName) {
    setShowStudentForm(formName === "student" ? !showStudentForm : false);
    setShowCompanyForm(formName === "company" ? !showCompanyForm : false);
    setShowJobForm(formName === "job" ? !showJobForm : false);
    setFormMessage("");
  }

  function getCompanyName(job) {
    return job.Company?.name || job.company?.name || "Company";
  }

  function getStudentName(application) {
    return (
      application.Student?.name ||
      application.student?.name ||
      `Student #${application.studentId}`
    );
  }

  function getJobTitle(application) {
    const job =
      application.JobOpening ||
      application.jobOpening ||
      application.Job ||
      application.job;

    return job?.title || `Job #${application.jobOpeningId}`;
  }

  function getApplicationCompany(application) {
    const job =
      application.JobOpening ||
      application.jobOpening ||
      application.Job ||
      application.job;

    return (
      job?.Company?.name ||
      job?.company?.name ||
      application.Company?.name ||
      "—"
    );
  }

  function formatSalary(salary) {
    if (salary === null || salary === undefined || salary === "") {
      return "Not specified";
    }

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  }

  function renderStudentsTable() {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderCompaniesTable() {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Location</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id}>
                  <td>#{company.id}</td>
                  <td>{company.name}</td>
                  <td>{company.location || "—"}</td>
                  <td>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit website
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderJobsTable() {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No job openings found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>#{job.id}</td>
                  <td>{job.title}</td>
                  <td>{getCompanyName(job)}</td>
                  <td>{job.location || "—"}</td>
                  <td>{formatSalary(job.salary)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderApplicationsTable() {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Job Opening</th>
              <th>Company</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr key={application.id}>
                  <td>{getStudentName(application)}</td>
                  <td>{getJobTitle(application)}</td>
                  <td>{getApplicationCompany(application)}</td>
                  <td>
                    <span
                      className={`status-badge ${(application.status || "Applied")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {application.status || "Applied"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={application.status || "Applied"}
                      onChange={(event) =>
                        updateApplicationStatus(
                          application.id,
                          event.target.value
                        )
                      }
                      aria-label={`Update status for application ${application.id}`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderFormMessage() {
    if (!formMessage) return null;

    return (
      <p
        className={`form-message ${
          formMessage.startsWith("Error:") ? "form-error" : ""
        }`}
      >
        {formMessage}
      </p>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <h2>CampusTrack</h2>
            <p>Placement Management</p>
          </div>
        </div>

        <p className="menu-label">MENU</p>

        <nav className="navigation">
          {[
            { name: "Dashboard", icon: "▦" },
            { name: "Students", icon: "♙" },
            { name: "Companies", icon: "▤" },
            { name: "Job Openings", icon: "▣" },
            { name: "Applications", icon: "☷" },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              className={`nav-link ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.name);
                setFormMessage("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-avatar">RK</div>
          <div>
            <strong>Admin</strong>
            <p>Placement Cell</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Pages / {activePage}</p>
            <h1>{activePage}</h1>
          </div>
          <div className="admin-label">
            <span className="online-dot"></span>
            Admin Panel
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}
        {renderFormMessage()}

        {loading ? (
          <section className="content-card">
            <p>Loading your placement data...</p>
          </section>
        ) : (
          <>
            {activePage === "Dashboard" && (
              <>
                <section className="welcome-section">
                  <div>
                    <h2>Welcome back, Admin! 👋</h2>
                    <p>
                      Here is an overview of your campus placement activities.
                    </p>
                  </div>
                  <button
                    className="refresh-button"
                    type="button"
                    onClick={fetchData}
                  >
                    ↻ Refresh Data
                  </button>
                </section>

                <section className="stats-grid">
                  <div className="stat-card purple">
                    <div className="stat-top">
                      <span>Total Students</span>
                      <span className="stat-icon">♙</span>
                    </div>
                    <h2>{students.length}</h2>
                    <p>Registered students</p>
                  </div>

                  <div className="stat-card blue">
                    <div className="stat-top">
                      <span>Companies</span>
                      <span className="stat-icon">▤</span>
                    </div>
                    <h2>{companies.length}</h2>
                    <p>Registered companies</p>
                  </div>

                  <div className="stat-card orange">
                    <div className="stat-top">
                      <span>Job Openings</span>
                      <span className="stat-icon">▣</span>
                    </div>
                    <h2>{jobs.length}</h2>
                    <p>Available opportunities</p>
                  </div>

                  <div className="stat-card green">
                    <div className="stat-top">
                      <span>Applications</span>
                      <span className="stat-icon">☷</span>
                    </div>
                    <h2>{applications.length}</h2>
                    <p>Student applications</p>
                  </div>
                </section>

                <section className="content-card">
                  <div className="section-heading">
                    <div>
                      <h2>Recent Job Openings</h2>
                      <p>Latest opportunities available to students</p>
                    </div>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => setActivePage("Job Openings")}
                    >
                      View all →
                    </button>
                  </div>
                  {renderJobsTable()}
                </section>

                <section className="content-card">
                  <div className="section-heading">
                    <div>
                      <h2>Recent Applications</h2>
                      <p>Track student application progress</p>
                    </div>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => setActivePage("Applications")}
                    >
                      View all →
                    </button>
                  </div>
                  {renderApplicationsTable()}
                </section>
              </>
            )}

            {activePage === "Students" && (
              <>
                <div className="student-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => openForm("student")}
                  >
                    {showStudentForm ? "Cancel" : "+ Add Student"}
                  </button>
                </div>

                {showStudentForm && (
                  <section className="content-card">
                    <div className="section-heading">
                      <div>
                        <h2>Add New Student</h2>
                        <p>Enter the student's details below.</p>
                      </div>
                    </div>

                    <form className="student-form" onSubmit={addStudent}>
                      <label>
                        Student Name
                        <input
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </label>

                      <label>
                        Email
                        <input
                          type="email"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="student@example.com"
                          required
                        />
                      </label>

                      <label>
                        Course
                        <select
                          value={studentCourse}
                          onChange={(e) => setStudentCourse(e.target.value)}
                          required
                        >
                          <option value="BCA">BCA</option>
                          <option value="BSc">BSc</option>
                          <option value="BBA">BBA</option>
                        </select>
                      </label>

                      <button className="primary-button" type="submit">
                        Save Student
                      </button>
                    </form>
                  </section>
                )}

                <section className="content-card">
                  <div className="section-heading">
                    <div>
                      <h2>All Students</h2>
                      <p>Manage registered students</p>
                    </div>
                    <span className="count-label">
                      {students.length} students
                    </span>
                  </div>
                  {renderStudentsTable()}
                </section>
              </>
            )}

            {activePage === "Companies" && (
              <>
                <div className="student-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => openForm("company")}
                  >
                    {showCompanyForm ? "Cancel" : "+ Add Company"}
                  </button>
                </div>

                {showCompanyForm && (
                  <section className="content-card">
                    <div className="section-heading">
                      <div>
                        <h2>Add New Company</h2>
                        <p>Enter company information.</p>
                      </div>
                    </div>

                    <form className="student-form" onSubmit={addCompany}>
                      <label>
                        Company Name
                        <input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter company name"
                          required
                        />
                      </label>

                      <label>
                        Location
                        <input
                          value={companyLocation}
                          onChange={(e) => setCompanyLocation(e.target.value)}
                          placeholder="e.g. Goa"
                        />
                      </label>

                      <label>
                        Website
                        <input
                          type="url"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </label>

                      <button className="primary-button" type="submit">
                        Save Company
                      </button>
                    </form>
                  </section>
                )}

                <section className="content-card">
                  <div className="section-heading">
                    <div>
                      <h2>All Companies</h2>
                      <p>Companies offering placement opportunities</p>
                    </div>
                    <span className="count-label">
                      {companies.length} companies
                    </span>
                  </div>
                  {renderCompaniesTable()}
                </section>
              </>
            )}

            {activePage === "Job Openings" && (
              <>
                <div className="student-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => openForm("job")}
                  >
                    {showJobForm ? "Cancel" : "+ Add Job Opening"}
                  </button>
                </div>

                {showJobForm && (
                  <section className="content-card">
                    <div className="section-heading">
                      <div>
                        <h2>Add Job Opening</h2>
                        <p>Create a new placement opportunity.</p>
                      </div>
                    </div>

                    {companies.length === 0 ? (
                      <p>
                        Please add a company first, then create a job opening.
                      </p>
                    ) : (
                      <form className="student-form" onSubmit={addJob}>
                        <label>
                          Job Title
                          <input
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g. Web Developer Intern"
                            required
                          />
                        </label>

                        <label>
                          Location
                          <input
                            value={jobLocation}
                            onChange={(e) => setJobLocation(e.target.value)}
                            placeholder="e.g. Goa"
                          />
                        </label>

                        <label>
                          Salary (₹)
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={jobSalary}
                            onChange={(e) => setJobSalary(e.target.value)}
                            placeholder="e.g. 15000"
                          />
                        </label>

                        <label>
                          Company
                          <select
                            value={jobCompanyId}
                            onChange={(e) => setJobCompanyId(e.target.value)}
                            required
                          >
                            <option value="">Select a company</option>
                            {companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <button className="primary-button" type="submit">
                          Save Job Opening
                        </button>
                      </form>
                    )}
                  </section>
                )}

                <section className="content-card">
                  <div className="section-heading">
                    <div>
                      <h2>All Job Openings</h2>
                      <p>Current placement opportunities</p>
                    </div>
                    <span className="count-label">{jobs.length} jobs</span>
                  </div>
                  {renderJobsTable()}
                </section>
              </>
            )}

            {activePage === "Applications" && (
              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>All Applications</h2>
                    <p>Review applications and update their status.</p>
                  </div>
                  <span className="count-label">
                    {applications.length} applications
                  </span>
                </div>
                {renderApplicationsTable()}
              </section>
            )}
          </>
        )}

        <footer className="page-footer">
          CampusTrack © 2026 | Campus Placement & Interview Tracker
        </footer>
      </main>
    </div>
  );
}

export default App;
