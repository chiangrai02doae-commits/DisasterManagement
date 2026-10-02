import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentUserRole, setCurrentUserRole] = useState('admin');
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  const [rawDistricts, setRawDistricts] = useState([]);
  const [rawSubdistricts, setRawSubdistricts] = useState([]);

  const [formData, setFormData] = useState({
    disasterType: 'อุทกภัย',
    province: '',
    district: '',
    subdistrict: '',
    households: '15',
    damagedArea: '50 ไร่',
    budgetAmount: '100,000 บาท',
    budgetType: 'งบกลาง',
    status: 'รอดำเนินการ',
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    // โหลดข้อมูลจังหวัด อำเภอ ตำบล เตรียมไว้ล่วงหน้า
    fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error('Error loading provinces:', err));

    fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json')
      .then(res => res.json())
      .then(data => setRawDistricts(data))
      .catch(err => console.error('Error loading districts:', err));

    fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json')
      .then(res => res.json())
      .then(data => setRawSubdistricts(data))
      .catch(err => console.error('Error loading subdistricts:', err));

    fetchDisasters();
  }, []);

  const handleProvinceChange = (e) => {
    const selectedProvName = e.target.value;
    setFormData({
      ...formData,
      province: selectedProvName,
      district: '',
      subdistrict: ''
    });
    setSubdistricts([]);

    const foundProv = provinces.find(p => p.name.th === selectedProvName);
    if (foundProv) {
      const filtered = rawDistricts.filter(d => d.province_id === foundProv.id);
      setDistricts(filtered);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistName = e.target.value;
    setFormData({
      ...formData,
      district: selectedDistName,
      subdistrict: ''
    });

    const foundDist = rawDistricts.find(d => d.name.th === selectedDistName);
    if (foundDist) {
      const filtered = rawSubdistricts.filter(s => s.district_id === foundDist.id);
      setSubdistricts(filtered);
    } else {
      setSubdistricts([]);
    }
  };

  const fetchDisasters = async () => {
    try {
      const res = await fetch('/api/disasters');
      const data = await res.json();
      setDisasters(data);
    } catch (err) {
      console.error('Failed to fetch disasters', err);
    }
  };

  const calculateDates = (start) => {
    const sDate = new Date(start);
    const dueDate = new Date(sDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const extendDate = new Date(dueDate);
    extendDate.setDate(extendDate.getDate() - 25);
    return {
      dueDate: dueDate.toISOString().split('T')[0],
      extendDate: extendDate.toISOString().split('T')[0],
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { dueDate, extendDate } = calculateDates(formData.startDate);
    const newRecord = { ...formData, dueDate, extendDate };

    try {
      const res = await fetch('/api/disasters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });

      if (res.ok) {
        setFormData({
          disasterType: 'อุทกภัย',
          province: '',
          district: '',
          subdistrict: '',
          households: '15',
          damagedArea: '50 ไร่',
          budgetAmount: '100,000 บาท',
          budgetType: 'งบกลาง',
          status: 'รอดำเนินการ',
          startDate: new Date().toISOString().split('T')[0],
        });
        setDistricts([]);
        setSubdistricts([]);
        fetchDisasters();
      }
    } catch (err) {
      console.error('Failed to save data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>ระบบติดตามการช่วยเหลือผู้ประสบภัยพิบัติ</h2>

      <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <legend><strong>บันทึกเคสภัยพิบัติใหม่</strong></legend>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <input type="text" placeholder="ประเภทภัย" value={formData.disasterType} onChange={e => setFormData({...formData, disasterType: e.target.value})} required />
          
          <select value={formData.province} onChange={handleProvinceChange} required style={{ padding: '6px' }}>
            <option value="">-- เลือกจังหวัด --</option>
            {provinces.map(p => (
              <option key={p.id} value={p.name.th}>{p.name.th}</option>
            ))}
          </select>

          <select value={formData.district} onChange={handleDistrictChange} required disabled={!formData.province} style={{ padding: '6px' }}>
            <option value="">-- เลือกอำเภอ/เขต --</option>
            {districts.map(d => (
              <option key={d.id} value={d.name.th}>{d.name.th}</option>
            ))}
          </select>

          <select value={formData.subdistrict} onChange={e => setFormData({...formData, subdistrict: e.target.value})} required disabled={!formData.district} style={{ padding: '6px' }}>
            <option value="">-- เลือกตำบล/แขวง --</option>
            {subdistricts.map(s => (
              <option key={s.id} value={s.name.th}>{s.name.th}</option>
            ))}
          </select>

          <input type="text" placeholder="จำนวนครัวเรือน" value={formData.households} onChange={e => setFormData({...formData, households: e.target.value})} />
          <input type="text" placeholder="พื้นที่เสียหาย" value={formData.damagedArea} onChange={e => setFormData({...formData, damagedArea: e.target.value})} />
          <input type="text" placeholder="วงเงินช่วยเหลือ" value={formData.budgetAmount} onChange={e => setFormData({...formData, budgetAmount: e.target.value})} />
          <input type="text" placeholder="ประเภทงบ" value={formData.budgetType} onChange={e => setFormData({...formData, budgetType: e.target.value})} />
          <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
          
          <button type="submit" disabled={loading} style={{ gridColumn: 'span 3', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลลงฐานข้อมูล'}
          </button>
        </form>
      </fieldset>

      <h3>รายการข้อมูลการช่วยเหลือ</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th>ประเภทภัย</th>
            <th>พื้นที่ (จว./อ./ต.)</th>
            <th>วันที่เกิดภัย</th>
            <th>วันครบกำหนด (+30วัน)</th>
            <th>ครัวเรือน/พื้นที่</th>
            <th>วงเงิน/งบ</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {disasters.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center', color: '#777' }}>ยังไม่มีข้อมูลในฐานข้อมูล</td></tr>
          ) : (
            disasters.map(item => (
              <tr key={item._id}>
                <td>{item.disasterType}</td>
                <td>{item.province} / {item.district} / {item.subdistrict}</td>
                <td>{item.startDate}</td>
                <td style={{ color: 'red', fontWeight: 'bold' }}>{item.dueDate}</td>
                <td>{item.households} ครัวเรือน ({item.damagedArea})</td>
                <td>{item.budgetAmount} ({item.budgetType})</td>
                <td>{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}