import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ดึง URL จาก Environment Variable ของ Vercel หรือใช้ Localhost ตอนทดสอบ
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [disasters, setDisasters] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    disaster_type: 'อุทกภัย',
    province: 'เชียงใหม่',
    district: 'เมืองเชียงใหม่',
    subdistrict: 'ช้างเผือก',
    incident_date: '',
    households_affected: '',
    budget_amount: '',
    budget_type: 'งบฉุกเฉิน'
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/disasters?search=${search}`);
      setDisasters(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/disasters`, form);
      alert('บันทึกข้อมูลสำเร็จ');
      fetchData();
    } catch (err) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>ระบบติดตามการช่วยเหลือผู้ประสบภัยพิบัติ</h2>
      
      {/* ฟอร์มเพิ่มข้อมูล */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>บันทึกเคสภัยพิบัติใหม่</h3>
        <input type="text" placeholder="ประเภทภัย" value={form.disaster_type} onChange={e => setForm({...form, disaster_type: e.target.value})} required style={{marginRight: '10px'}} />
        <input type="text" placeholder="จังหวัด" value={form.province} onChange={e => setForm({...form, province: e.target.value})} required style={{marginRight: '10px'}} />
        <input type="text" placeholder="อำเภอ" value={form.district} onChange={e => setForm({...form, district: e.target.value})} required style={{marginRight: '10px'}} />
        <input type="date" value={form.incident_date} onChange={e => setForm({...form, incident_date: e.target.value})} required style={{marginRight: '10px'}} />
        <button type="submit">บันทึกข้อมูล</button>
      </form>

      {/* ช่องค้นหา */}
      <input 
        type="text" 
        placeholder="ค้นหาประเภทภัย หรือ อำเภอ..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        style={{ padding: '8px', width: '100%', marginBottom: '20px', boxSizing: 'border-box' }}
      />

      {/* ตารางแสดงผล */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ประเภทภัย</th>
            <th>พื้นที่ (จังหวัด/อำเภอ)</th>
            <th>วันที่เกิดภัย</th>
            <th>วันครบกำหนด (+30 วัน)</th>
            <th>ครัวเรือน</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {disasters.map((item) => (
            <tr key={item._id}>
              <td>{item.disaster_type}</td>
              <td>{item.province} / {item.district}</td>
              <td>{new Date(item.incident_date).toLocaleDateString()}</td>
              <td>{item.due_date ? new Date(item.due_date).toLocaleDateString() : '-'}</td>
              <td>{item.households_affected}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;