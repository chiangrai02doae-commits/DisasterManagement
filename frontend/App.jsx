import React, { useState } from 'react';

export default function App() {
  // จำลองสิทธิ์ผู้ใช้งาน: 'admin' | 'officer' | 'user' | 'executive'
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  // ฟอร์มข้อมูลเคสภัยพิบัติ
  const [formData, setFormData] = useState({
    disasterType: 'อุทกภัย',
    province: 'เชียงใหม่',
    district: 'เมืองเชียงใหม่',
    subdistrict: 'สุเทพ',
    households: '15',
    damagedArea: '50 ไร่',
    budgetAmount: '100,000 บาท',
    budgetType: 'งบกลาง',
    status: 'รอดำเนินการ',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [disasters, setDisasters] = useState([]);

  // ฟังก์ชันคำนวณวันอัตโนมัติ
  const calculateDates = (start) => {
    const sDate = new Date(start);
    
    // วันครบกำหนด (+30 วัน)
    const dueDate = new Date(sDate);
    dueDate.setDate(dueDate.getDate() + 30);

    // วันขอขยายระยะเวลา (วันครบกำหนด - 25 วัน หรือ +5 วันจากวันเริ่ม)
    const extendDate = new Date(dueDate);
    extendDate.setDate(extendDate.getDate() - 25);

    return {
      dueDate: dueDate.toISOString().split('T')[0],
      extendDate: extendDate.toISOString().split('T')[0],
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { dueDate, extendDate } = calculateDates(formData.startDate);
    const newRecord = {
      ...formData,
      id: Date.now(),
      dueDate,
      extendDate,
    };
    setDisasters([newRecord, ...disasters]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>ระบบติดตามการช่วยเหลือผู้ประสบภัยพิบัติ</h2>

      {/* แผงควบคุมจำลองสิทธิ์ผู้ใช้งาน */}
      <div style={{ background: '#f0f2f5', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <strong>🔍 จำลองสิทธิ์ผู้ใช้งานปัจจุบัน:</strong>
        <select 
          value={currentUserRole} 
          onChange={(e) => setCurrentUserRole(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px' }}
        >
          <option value="admin">Admin (ผู้ดูแลระบบสูงสุด)</option>
          <option value="officer">เจ้าหน้าที่ (บันทึก/แก้ไขข้อมูล)</option>
          <option value="user">ผู้ใช้งานทั่วไป (ดูข้อมูล)</option>
          <option value="executive">ผู้บริหาร (ดู Dashboard/รายงาน)</option>
        </select>
      </div>

      {/* เมนูเฉพาะสิทธิ์ Admin หรือ Officer (สิทธิ์บันทึกข้อมูล) */}
      {(currentUserRole === 'admin' || currentUserRole === 'officer') && (
        <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <legend><strong>บันทึกเคสภัยพิบัติใหม่</strong></legend>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="ประเภทภัย" 
              value={formData.disasterType} 
              onChange={e => setFormData({...formData, disasterType: e.target.value})} 
              required
            />
            <input 
              type="text" 
              placeholder="จังหวัด" 
              value={formData.province} 
              onChange={e => setFormData({...formData, province: e.target.value})} 
              required
            />
            <input 
              type="text" 
              placeholder="อำเภอ" 
              value={formData.district} 
              onChange={e => setFormData({...formData, district: e.target.value})} 
              required
            />
            <input 
              type="text" 
              placeholder="ตำบล" 
              value={formData.subdistrict} 
              onChange={e => setFormData({...formData, subdistrict: e.target.value})} 
              required
            />
            <input 
              type="text" 
              placeholder="จำนวนครัวเรือน" 
              value={formData.households} 
              onChange={e => setFormData({...formData, households: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="พื้นที่เสียหาย" 
              value={formData.damagedArea} 
              onChange={e => setFormData({...formData, damagedArea: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="วงเงินช่วยเหลือ" 
              value={formData.budgetAmount} 
              onChange={e => setFormData({...formData, budgetAmount: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="ประเภทงบ" 
              value={formData.budgetType} 
              onChange={e => setFormData({...formData, budgetType: e.target.value})} 
            />
            <input 
              type="date" 
              value={formData.startDate} 
              onChange={e => setFormData({...formData, startDate: e.target.value})} 
              required
            />
            <button type="submit" style={{ gridColumn: 'span 3', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              บันทึกข้อมูลและคำนวณวันอัตโนมัติ
            </button>
          </form>
        </fieldset>
      )}

      {/* มุมมองสำหรับผู้บริหาร (Executive Dashboard) */}
      {currentUserRole === 'executive' && (
        <div style={{ background: '#e2f0d9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>📊 Executive Dashboard & Summary</h3>
          <p>สรุปภาพรวมวงเงินช่วยเหลือและความเสียหายทั้งหมด (สิทธิ์ผู้บริหารเห็นส่วนนี้)</p>
        </div>
      )}

      {/* ตารางแสดงข้อมูล */}
      <h3>รายการข้อมูลการช่วยเหลือ</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th>ประเภทภัย</th>
            <th>พื้นที่ (จว./อ./ต.)</th>
            <th>วันที่เกิดภัย</th>
            <th>วันครบกำหนด (+30วัน)</th>
            <th>วันขอขยายเวลา</th>
            <th>ครัวเรือน/พื้นที่</th>
            <th>วงเงิน/งบ</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {disasters.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', color: '#777' }}>ยังไม่มีข้อมูลในระบบ</td>
            </tr>
          ) : (
            disasters.map(item => (
              <tr key={item.id}>
                <td>{item.disasterType}</td>
                <td>{item.province} / {item.district} / {item.subdistrict}</td>
                <td>{item.startDate}</td>
                <td style={{ color: 'red', fontWeight: 'bold' }}>{item.dueDate}</td>
                <td style={{ color: 'orange' }}>{item.extendDate}</td>
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
