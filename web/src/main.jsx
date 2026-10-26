import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const response = await fetch('/api/incidents');
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      setIncidents(await response.json()); setError('');
    } catch (err) { setError('Cannot reach the API. Verify the database and backend are running.'); }
  }
  useEffect(() => { refresh(); }, []);

  async function addIncident(event) {
    event.preventDefault(); setBusy(true);
    try {
      const response = await fetch('/api/incidents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, severity }) });
      if (!response.ok) throw new Error((await response.json()).error || 'Could not save incident');
      setTitle(''); await refresh();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  async function updateStatus(id, status) {
    try {
      const response = await fetch(`/api/incidents/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error('Could not update incident');
      await refresh();
    } catch (err) { setError(err.message); }
  }
  return <main className="layout">
    <header><span className="eyebrow">PORTFOLIO PROJECT • CLOUD / DEVOPS</span><h1>CloudOps Incident Tracker</h1><p>Track operational incidents, assess severity, and resolve issues.</p></header>
    <section className="metrics"><div><span>Total incidents</span><strong>{incidents.length}</strong></div><div><span>Open / investigating</span><strong>{incidents.filter(i=>i.status!=='resolved').length}</strong></div><div><span>Resolved</span><strong>{incidents.filter(i=>i.status==='resolved').length}</strong></div></section>
    <section className="panel"><h2>Report an incident</h2><form onSubmit={addIncident}><label>Incident title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Example: API latency above threshold" minLength="3" maxLength="150" required /></label><label>Severity<select value={severity} onChange={e=>setSeverity(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label><button disabled={busy}>{busy?'Saving…':'Create incident'}</button></form></section>
    {error && <p className="error" role="alert">{error}</p>}
    <section className="panel"><div className="sectionHeading"><h2>Incident log</h2><button className="secondary" onClick={refresh}>Refresh</button></div>{incidents.length === 0 ? <p className="empty">No incidents yet. Create your first incident above.</p> : <div className="incidentList">{incidents.map(incident=><article className="incident" key={incident.id}><div><strong>{incident.title}</strong><small>#{incident.id} · {new Date(incident.created_at).toLocaleString()}</small><div className="badges"><span className={`severity ${incident.severity}`}>{incident.severity}</span><span className="status">{incident.status}</span></div></div><label>Update status<select aria-label={`Status for incident ${incident.id}`} value={incident.status} onChange={e=>updateStatus(incident.id,e.target.value)}><option value="open">Open</option><option value="investigating">Investigating</option><option value="resolved">Resolved</option></select></label></article>)}</div>}</section>
    <footer>React • Node.js • Express • PostgreSQL • Docker (coming next)</footer>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
