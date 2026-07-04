import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    const res = await fetch('http://localhost:5000/attendance');
    const data = await res.json();
    setRecords(data);
  };

  const markPresent = async () => {
    await fetch('http://localhost:5000/mark-present', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setName('');
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Attendance System 📋hello</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={markPresent}>Mark Present</button>

      <h2>Today's Attendance:</h2>
      <ul>
        {records.map((r) => (
          <li key={r._id}>{r.name} — {new Date(r.presentOn).toLocaleTimeString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;