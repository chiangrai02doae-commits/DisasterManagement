import React, { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`เข้าสู่ระบบด้วย ID: ${username}`);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      margin: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: 'hidden',
      background: '#ffffff'
    }}>
      
      {/* --- ส่วนฟอร์ม Login ด้านซ้าย --- */}
      <div style={{
        flex: '0 0 42%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
        boxSizing: 'border-box',
        background: '#ffffff',
        zIndex: 2
      }}>
        {/* โลโก้จำลองระบบ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <div style={{
            background: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '18px',
            letterSpacing: '1px'
          }}>
            DISASTERS
          </div>
          <span style={{ fontWeight: '600', color: '#333', fontSize: '18px' }}>Chiang Rai Center</span>
        </div>

        {/* ข้อความต้อนรับและชื่อระบบ */}
        <h1 style={{
          fontSize: '28px',
          color: '#1a1a1a',
          marginBottom: '8px',
          fontWeight: '700',
          lineHeight: '1.3'
        }}>
          ระบบติดตามการให้ความช่วยเหลือภัยพิบัติ
        </h1>
        <p style={{
          color: '#555',
          fontSize: '15px',
          marginBottom: '35px',
          fontWeight: '500'
        }}>
          จังหวัดเชียงราย — Sign into your account
        </p>

        {/* ฟอร์มเข้าสู่ระบบ */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '380px' }}>
          <div>
            <input 
              type="text" 
              placeholder="Phone or Email address" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '8px',
                border: '1px solid #dcedfc',
                background: '#f8fbff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border 0.2s'
              }}
            />
          </div>

          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '8px',
                border: '1px solid #dcedfc',
                background: '#f8fbff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border 0.2s'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
              transition: 'transform 0.1s ease'
            }}
          >
            Log In
          </button>

          <div style={{ textAlign: 'left', marginTop: '5px' }}>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('ระบบกู้คืนรหัสผ่าน'); }} style={{
              color: '#007bff',
              fontSize: '13px',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Forgot password?
            </a>
          </div>
        </form>
      </div>

      {/* --- ส่วนภาพประกอบกราฟิกโทนสีฟ้าด้านขวา (Isometric Theme) --- */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #007bff 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* วงกลมแสงเรืองแสงตกแต่งพื้นหลัง */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none'
        }}></div>

        {/* จำลองภาพกราฟิกไอโซเมตริกแดชบอร์ดและการวิเคราะห์ข้อมูล */}
        <div style={{
          textAlign: 'center',
          color: '#fff',
          padding: '40px',
          zIndex: 2,
          maxWidth: '500px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', fontWeight: '600' }}>
              Platform มอนิเตอร์ข้อมูลภัยพิบัติ
            </h2>
            <p style={{ fontSize: '14px', color: '#e0e0e0', lineHeight: '1.6', margin: 0 }}>
              ระบบรายงานและติดตามพื้นที่เสียหาย งบประมาณเยียวยาเกษตรกร 
              รวมถึงการบริหารจัดการเวลาช่วยเหลืออย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}