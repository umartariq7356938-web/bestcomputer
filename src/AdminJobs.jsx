import { useState, useEffect } from 'react';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '', department: '', organization: '', province: 'Federal',
    city: 'Any', vacancies: 1, education: '', experience: 'Fresh',
    ageLimit: '', sourceUrl: '', lastDate: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch('http://localhost:5000/api/jobs/all', {
      headers: { 'x-auth-token': localStorage.getItem('adminToken') }
    });
    if(res.ok) {
      const data = await res.json();
      setJobs(data);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Are you sure you want to delete this job?')) {
      await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') }
      });
      fetchJobs();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('adminToken') 
      },
      body: JSON.stringify(formData)
    });
    setShowForm(false);
    fetchJobs();
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div>
      <div className="topbar">
        <h2>Jobs Management</h2>
        <button className="button button-wa" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Job'}
        </button>
      </div>

      {showForm && (
        <form className="card" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input name="title" placeholder="Job Title" onChange={handleChange} required />
            <input name="department" placeholder="Department" onChange={handleChange} required />
            <input name="organization" placeholder="Organization (e.g. WAPDA, FPSC)" onChange={handleChange} required />
            <input name="education" placeholder="Education Required" onChange={handleChange} required />
            <input name="province" placeholder="Province" defaultValue="Federal" onChange={handleChange} />
            <input name="city" placeholder="City" defaultValue="Any" onChange={handleChange} />
            <input name="vacancies" type="number" placeholder="Vacancies" defaultValue={1} onChange={handleChange} />
            <input name="experience" placeholder="Experience" defaultValue="Fresh" onChange={handleChange} />
            <input name="ageLimit" placeholder="Age Limit" onChange={handleChange} />
            <input name="sourceUrl" placeholder="Official Source URL" onChange={handleChange} required />
            <input name="lastDate" type="date" onChange={handleChange} required />
          </div>
          <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', background: '#0d2b4c', color:'white', border:'none', borderRadius:'4px' }}>Save Job</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Title</th>
            <th style={{ padding: '10px' }}>Organization</th>
            <th style={{ padding: '10px' }}>Last Date</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{job.title}</td>
              <td style={{ padding: '10px' }}>{job.organization}</td>
              <td style={{ padding: '10px' }}>{new Date(job.lastDate).toLocaleDateString()}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => handleDelete(job._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No jobs found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
