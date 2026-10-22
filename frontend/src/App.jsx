import React, { useState, useEffect } from 'react';

export default function App() {
  const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px', color: '#333' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInputId, setLoginInputId] = useState('cri001');
  const [loginInputPass, setLoginInputPass] = useState('111111');
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

  const [disasters, setDisasters] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allSubdistricts, setAllSubdistricts] = useState([]);
  
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubdistricts, setFilteredSubdistricts] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [selectedSubItemIds, setSelectedSubItemIds] = useState([]);
  
  const [hoveredDistrictInfo, setHoveredDistrictInfo] = useState(null);
  const [hoveredDetailTooltip, setHoveredDetailTooltip] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [showOwlMascot, setShowOwlMascot] = useState(false);
  const [bottomRightNotifyAlert, setBottomRightNotifyAlert] = useState(null);
  const [isBottomRightNotifyFading, setIsBottomRightNotifyFading] = useState(false);

  const [chartMetric, setChartMetric] = useState('damagedArea');

  const [globalSearchKeyword, setGlobalSearchKeyword] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBudgetType, setFilterBudgetType] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterStatusDate, setFilterStatusDate] = useState('');

  const [viewMode, setViewMode] = useState('all');

  const [isExtensionReportModalOpen, setIsExtensionReportModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPromptInfoModalOpen, setIsPromptInfoModalOpen] = useState(false);

  const officialStatuses = [
    'อยู่ระหว่างสำรวจ',
    'อยู่ระหว่างบันทึกข้อมูล/ประชาคม',
    'ประชุม ก.ช.ภ.อ.',
    'ประชุม ก.ช.ภ.จ.',
    'จังหวัดรับเอกสาร',
    'ประชุมกลั่นกรอง',
    'จัดส่งเอกสารให้ กสก./ปภ.',
    'งบ อปท.',
    'โอนเงินเข้าบัญชีเกษตรกรแล้ว'
  ];

  const chiangRaiDistricts = [
    'แม่สาย', 'แม่ฟ้าหลวง', 'เชียงแสน', 'แม่จัน', 'เชียงของ', 
    'เวียงแก่น', 'พญาเม็งราย', 'ดอยหลวง', 'เมืองเชียงราย', 'เวียงเชียงรุ้ง', 
    'พาน', 'แม่ลาว', 'เวียงชัย', 'ขุนตาล', 'ป่าแดด', 
    'แม่สรวย', 'เวียงป่าเป้า', 'เทิง'
  ];

  const [officersList, setOfficersList] = useState(() => {
    const savedOfficers = localStorage.getItem('officersList');
    if (savedOfficers) {
      try {
        return JSON.parse(savedOfficers);
      } catch (e) {
        console.error('Error parsing officersList:', e);
      }
    }
    return chiangRaiDistricts.map((dist, idx) => ({
      id: `off_${idx}`,
      username: `CRD${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      password: 'abc123',
      firstName: 'จนท.',
      lastName: dist,
      province: 'เชียงราย',
      district: dist
    }));
  });

  useEffect(() => {
    localStorage.setItem('officersList', JSON.stringify(officersList));
  }, [officersList]);

  // ปรับค่า Default ให้ตรงกับสิทธิ์ Viewer ตามที่ตั้งค่าหน้า Login ไว้
  const [currentUserRole, setCurrentUserRole] = useState('viewer');

  const [isLoginRegisterOpen, setIsLoginRegisterOpen] = useState(false);
  const [isUsersInfoModalOpen, setIsUsersInfoModalOpen] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    province: 'เชียงราย',
    district: chiangRaiDistricts[0]
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  const [formData, setFormData] = useState({
    disasterType: 'อุทกภัยด้านพืช',
    province: 'เชียงราย',
    district: '',
    subdistrict: '',
    startDate: '',
    households: '',
    damagedArea: '',
    budgetAmount: '',
    budgetType: '',
    status: 'อยู่ระหว่างสำรวจ',
    statusDate: '',
    calculatedDueDate: ''
  });

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cHM6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjM0IiBoZWlnaHQ9IjM0Ij48cGF0aCBmaWxsPSIjMjhhNzQ1IiBkPSJNMzIwIDMzOC43QzI0MC42IDMxNy.1IDE4MCAyMzMuNyAxODAgMTI0aC-2MEMxMjAgMjY2LjggMjQyLjggMzgwIDM5MiAzODBoMzh2LTQxLjNDMzYzLjMgMzM4LjcgMzQwIDMzOC43IDMyMCAzMzguN3oiLz48cGF0aCBmaWxsPSIjMjhhNzQ1IiBkPSJNMjU2IDcwYzAgMCA5MC02MCAxNjAgMTItNDAtNjAtMTIwLTIwLTE2MC0xMnptMCAwIi8+PC9zdmc+';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  const triggerOwlFlight = () => {
    setShowOwlMascot(false);
    setTimeout(() => {
      setShowOwlMascot(true);
    }, 50);
  };

  useEffect(() => {
    const scheduleRandomOwl = () => {
      const randomTime = (Math.random() * (8 - 4) + 4) * 60 * 1000; 
      return setTimeout(() => {
        triggerOwlFlight();
        scheduleRandomOwl();
      }, randomTime);
    };

    const timerId = scheduleRandomOwl();
    return () => clearTimeout(timerId);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    fetchThailandData();
    loadExcelData();
  }, []);

  // คีย์ลัด Ctrl + Shift + L สำหรับ Log out และ Ctrl + Shift + U สำหรับเข้าสู่ระบบ Admin ด่วน
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        setLoginInputId('cri001');
        setLoginInputPass('111111');
        setIsLoggedIn(false);
        showNotification('ออกจากระบบเรียบร้อยแล้ว (Ctrl+Shift+L)', 'success');
      }
      if (!isLoggedIn && e.ctrlKey && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        setCurrentUserRole('admin');
        setCurrentLoggedInUser({ username: 'ADMIN', firstName: 'ผู้ดูแลระบบ', lastName: '', district: '' });
        setIsLoggedIn(true);
        showNotification('เข้าสู่ระบบอัตโนมัติสำเร็จ (Admin)', 'success');
        triggerOwlFlight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn]);

  const fetchThailandData = async () => {
    try {
      const [provRes, distRes, subRes] = await Promise.all([
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/latest/province.json'),
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/latest/district.json'),
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/latest/sub_district.json')
      ]);

      setProvinces(await provRes.json());
      setAllDistricts(await distRes.json());
      setAllSubdistricts(await subRes.json());
    } catch (err) {
      console.error('Error fetching Thailand geography data:', err);
    }
  };

  const calculateDueDate = (startDateStr, addDays = 90) => {
    if (!startDateStr) return '';
    const parts = startDateStr.split('-');
    if (parts.length !== 3) return '';
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    
    const dateObj = new Date(y, m, d);
    if (isNaN(dateObj)) return '';
    
    dateObj.setDate(dateObj.getDate() + addDays);
    
    const yr = dateObj.getFullYear();
    const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
    const da = String(dateObj.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  const loadExcelData = () => {
    try {
      const excelRows = [
        { id: 1, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'เวียง', startDate: '2026-05-03', households: 29, damagedArea: '156.0000', budgetAmount: '310948', budgetType: 'เงินทดรอง ผวจ.', status: 'โอนเงินเข้าบัญชีเกษตรกรแล้ว', statusDate: '2026-05-10' },
        { id: 2, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'ศรีดอนมูล', startDate: '2026-05-03', households: 14, damagedArea: '89.0000', budgetAmount: '148700', budgetType: 'เงินทดรอง ผวจ.', status: 'โอนเงินเข้าบัญชีเกษตรกรแล้ว', statusDate: '2026-05-10' },
        { id: 3, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'โยนก', startDate: '2026-05-14', households: 5, damagedArea: '52.5000', budgetAmount: '70350', budgetType: 'เงินทดรอง ผวจ.', status: 'โอนเงินเข้าบัญชีเกษตรกรแล้ว', statusDate: '2026-05-20' },
        { id: 4, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'แม่เปา', startDate: '2026-07-13', households: 32, damagedArea: '169.9825', budgetAmount: '254840.57', budgetType: 'เงินทดรอง สปกษ.', status: 'ประชุม ก.ช.ภ.อ.', statusDate: '2026-07-20' },
        { id: 5, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'ดอยงาม', startDate: '2026-07-28', households: 34, damagedArea: '168.7500', budgetAmount: '226125', budgetType: 'เงินทดรอง สปกษ.', status: 'จังหวัดรับเอกสาร', statusDate: '2026-08-01' },
        { id: 6, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'หัวง้ม', startDate: '2026-07-28', households: 131, damagedArea: '874.5000', budgetAmount: '1171830', budgetType: 'เงินทดรอง สปกษ.', status: 'จังหวัดรับเอกสาร', statusDate: '2026-08-01' },
        { id: 7, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'ม่วงคำ', startDate: '2026-07-28', households: 35, damagedArea: '347.7500', budgetAmount: '465985', budgetType: 'เงินทดรอง สปกษ.', status: 'จังหวัดรับเอกสาร', statusDate: '2026-08-01' },
        { id: 8, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'ทานตะวัน', startDate: '2026-07-28', households: 93, damagedArea: '933.0000', budgetAmount: '1250220', budgetType: 'เงินทดรอง สปกษ.', status: 'จังหวัดรับเอกสาร', statusDate: '2026-08-01' },
        { id: 9, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'เวียงห้าว', startDate: '2026-07-28', households: 19, damagedArea: '82.2500', budgetAmount: '110215', budgetType: 'เงินทดรอง สปกษ.', status: 'จังหวัดรับเอกสาร', statusDate: '2026-08-01' },
        { id: 10, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'สันมะเค็ด', startDate: '2026-07-28', households: 19, damagedArea: '104.7500', budgetAmount: '140845', budgetType: 'เงินทดรอง สปกษ.', status: 'จังหวัดรับเอกสาร', statusDate: '2026-08-01' },
        { id: 11, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'เวียง', startDate: '2026-07-30', households: 87, damagedArea: '597.0000', budgetAmount: '1152940', budgetType: 'เงินทดรอง สปกษ.', status: 'ประชุมกลั่นกรอง', statusDate: '2026-08-05' },
        { id: 12, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'ป่าสัก', startDate: '2026-07-30', households: 15, damagedArea: '69.2500', budgetAmount: '96635', budgetType: 'เงินทดรอง สปกษ.', status: 'ประชุมกลั่นกรอง', statusDate: '2026-08-05' },
        { id: 13, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'ศรีดอนมูล', startDate: '2026-07-30', households: 96, damagedArea: '1026.5000', budgetAmount: '1383190', budgetType: 'เงินทดรอง สปกษ.', status: 'ประชุมกลั่นกรอง', statusDate: '2026-08-05' },
        { id: 14, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'โยนก', startDate: '2026-07-30', households: 61, damagedArea: '412.2500', budgetAmount: '694963', budgetType: 'เงินทดรอง สปกษ.', status: 'ประชุมกลั่นกรอง', statusDate: '2026-08-05' },
        { id: 15, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เมืองเชียงราย', subdistrict: 'ท่าสาย', startDate: '2026-07-31', households: 10, damagedArea: '80.2500', budgetAmount: '107535', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-01' },
        { id: 16, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'จันจว้า', startDate: '2026-08-01', households: 31, damagedArea: '244.2500', budgetAmount: '327295', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 17, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'แม่คำ', startDate: '2026-08-01', households: 31, damagedArea: '199.7500', budgetAmount: '269745', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 18, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'ท่าข้าวเปลือก', startDate: '2026-08-01', households: 195, damagedArea: '1548.2500', budgetAmount: '2074655', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 19, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'จันจว้าใต้', startDate: '2026-08-01', households: 10, damagedArea: '44.2500', budgetAmount: '59295', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 20, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'จอมสวรรค์', startDate: '2026-08-01', households: 7, damagedArea: '20.5000', budgetAmount: '27470', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 21, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่สาย', subdistrict: 'โป่งผา', startDate: '2026-08-01', households: 35, damagedArea: '303.0000', budgetAmount: '406020', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 22, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่สาย', subdistrict: 'บ้านด้าย', startDate: '2026-08-01', households: 118, damagedArea: '728.0000', budgetAmount: '2001625', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 23, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่สาย', subdistrict: 'โป่งงาม', startDate: '2026-08-01', households: 18, damagedArea: '180.0000', budgetAmount: '241200', budgetType: 'งบท้องถิ่น', status: 'งบ อปท.', statusDate: '2026-08-02' },
        { id: 24, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'บ้านแซว', startDate: '2026-08-08', households: 25, damagedArea: '178.0000', budgetAmount: '352440', budgetType: 'เงินทดรอง สปกษ.', status: 'จัดส่งเอกสารให้ กสก./ปภ.', statusDate: '2026-08-12' },
        { id: 25, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เวียงชัย', subdistrict: 'เมืองชุม', startDate: '2026-08-08', households: 19, damagedArea: '67.0000', budgetAmount: '89780', budgetType: 'เงินทดรอง สปกษ.', status: 'จัดส่งเอกสารให้ กสก./ปภ.', statusDate: '2026-08-12' },
        { id: 26, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'แม่ต๋ำ', startDate: '2026-08-10', households: 8, damagedArea: '89.5000', budgetAmount: '119930', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างบันทึกข้อมูล/ประชาคม', statusDate: '2026-08-11' },
        { id: 27, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'ไม้ยา', startDate: '2026-08-10', households: 20, damagedArea: '144.5000', budgetAmount: '193630', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างบันทึกข้อมูล/ประชาคม', statusDate: '2026-08-11' },
        { id: 28, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'เม็งราย', startDate: '2026-08-10', households: 198, damagedArea: '3138.2500', budgetAmount: '5905010', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างบันทึกข้อมูล/ประชาคม', statusDate: '2026-08-11' },
        { id: 29, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'สถาน', startDate: '2026-08-08', households: 16, damagedArea: '65.5500', budgetAmount: '129798', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-09' },
        { id: 30, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'ครึ่ง', startDate: '2026-08-08', households: 30, damagedArea: '188.9900', budgetAmount: '346995', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-09' },
        { id: 31, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'บุญเรือง', startDate: '2026-08-08', households: 58, damagedArea: '392.0600', budgetAmount: '559676', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-09' },
        { id: 32, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'เวียง', startDate: '2026-08-08', households: 3, damagedArea: '25.0000', budgetAmount: '49500', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-09' },
        { id: 33, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'ห้วยซ้อ', startDate: '2026-08-08', households: 198, damagedArea: '1362.7500', budgetAmount: '2295747', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-09' },
        { id: 34, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'ศรีดอนชัย', startDate: '2026-08-08', households: 210, damagedArea: '572.2100', budgetAmount: '1401924', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-09' },
        { id: 35, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'ปงน้อย', startDate: '2026-08-07', households: 1, damagedArea: '1.0000', budgetAmount: '1980', budgetType: 'งบ อปท.', status: 'งบ อปท.', statusDate: '2026-08-08' },
        { id: 36, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'หนองป่าก่อ', startDate: '2026-08-07', households: 8, damagedArea: '60.0000', budgetAmount: '118800', budgetType: 'งบ อปท.', status: 'งบ อปท.', statusDate: '2026-08-08' },
        { id: 37, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'ปงน้อย', startDate: '2026-08-04', households: 13, damagedArea: '45.0000', budgetAmount: '60300', budgetType: 'งบ อปท.', status: 'งบ อปท.', statusDate: '2026-08-05' },
        { id: 38, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'โชคชัย', startDate: '2026-08-04', households: 24, damagedArea: '48.5000', budgetAmount: '112380', budgetType: 'งบ อปท.', status: 'งบ อปท.', statusDate: '2026-08-05' },
        { id: 39, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'หนองป่าก่อ', startDate: '2026-08-04', households: 6, damagedArea: '7.2500', budgetAmount: '22504', budgetType: 'งบ อปท.', status: 'งบ อปท.', statusDate: '2026-08-05' },
        { id: 40, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'เวียง', startDate: '2026-08-10', households: 112, damagedArea: '797.9700', budgetAmount: '1305612', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-11' },
        { id: 41, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'ปล้อง', startDate: '2026-08-10', households: 77, damagedArea: '982.8200', budgetAmount: '1318535', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-11' },
        { id: 42, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'สันทรายงาม', startDate: '2026-08-10', households: 18, damagedArea: '247.8400', budgetAmount: '481443', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-11' },
        { id: 43, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'งิ้ว', startDate: '2026-08-10', households: 92, damagedArea: '1168.8400', budgetAmount: '1568158', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-11' },
        { id: 44, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'ศรีดอนไชย', startDate: '2026-08-10', households: 4, damagedArea: '51.5000', budgetAmount: '69010', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-11' },
        { id: 45, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'เมืองพาน', startDate: '2026-08-12', households: 50, damagedArea: '210.0000', budgetAmount: '350000', budgetType: 'งบท้องถิ่น', status: 'อยู่ระหว่างสำรวจ', statusDate: '2026-08-13' },
        { id: 46, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่สาย', subdistrict: 'เวียงพางคำ', startDate: '2026-08-14', households: 80, damagedArea: '450.5000', budgetAmount: '750000', budgetType: 'เงินทดรอง ผวจ.', status: 'ประชุม ก.ช.ภ.อ.', statusDate: '2026-08-18' },
        { id: 47, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เมืองเชียงราย', subdistrict: 'รอบเวียง', startDate: '2026-08-15', households: 45, damagedArea: '180.2500', budgetAmount: '290000', budgetType: 'เงินทดรอง ผวจ.', status: 'โอนเงินเข้าบัญชีเกษตรกรแล้ว', statusDate: '2026-08-20' }
      ];

      const savedData = localStorage.getItem('disasters');
      if (!savedData || JSON.parse(savedData).length === 0) {
        const processed = excelRows.map(item => {
          let dateStr = item.startDate;
          if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              let y = parts[2];
              if (y.length === 2) y = '20' + y;
              const m = parts[0].padStart(2, '0');
              const d = parts[1].padStart(2, '0');
              dateStr = `${y}-${m}-${d}`;
            }
          }
          const dueDateStr = calculateDueDate(dateStr, 90);
          return {
            ...item,
            startDate: dateStr,
            statusDate: item.statusDate || '',
            _id: item.id ? item.id.toString() : Date.now().toString() + Math.random(),
            calculatedDueDate: dueDateStr
          };
        });
        localStorage.setItem('disasters', JSON.stringify(processed));
        setDisasters(processed);
      } else {
        const parsed = JSON.parse(savedData).map(item => ({
          ...item,
          statusDate: item.statusDate || '',
          calculatedDueDate: item.calculatedDueDate || calculateDueDate(item.startDate, 90)
        }));
        setDisasters(parsed);
      }
    } catch (err) {
      console.error('Error loading Excel data:', err);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const id = loginInputId.trim().toUpperCase();
    const pass = loginInputPass.trim();

    if (id === 'ADMIN' && pass === '053152682') {
      setCurrentUserRole('admin');
      setCurrentLoggedInUser({ username: 'ADMIN', firstName: 'ผู้ดูแลระบบ', lastName: '', district: '' });
      setIsLoggedIn(true);
      showNotification('เข้าสู่ระบบสำเร็จ (Admin)', 'success');
      return;
    }

    if (id === 'CRI001' && pass === '111111') {
      setCurrentUserRole('viewer');
      setCurrentLoggedInUser({ username: 'cri001', firstName: 'ผู้ดูรายงาน', lastName: '', district: '' });
      setIsLoggedIn(true);
      showNotification('เข้าสู่ระบบสำเร็จ (Viewer cri001)', 'success');
      return;
    }

    const foundOfficer = officersList.find(o => o.username.toUpperCase() === id && o.password === pass);
    if (foundOfficer) {
      setCurrentUserRole('officer');
      setCurrentLoggedInUser(foundOfficer);
      setIsLoggedIn(true);
      showNotification(`เข้าสู่ระบบสำเร็จ (Officer อ.${foundOfficer.district})`, 'success');
      return;
    }

    showNotification('ID หรือ Password ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง', 'error');
  };

  const officerAssignedDistrict = currentUserRole === 'officer' && currentLoggedInUser ? currentLoggedInUser.district : '';

  const handleProvinceChange = (provinceName, selectedDistrictToSet = '') => {
    setFormData(prev => ({ ...prev, province: provinceName, district: selectedDistrictToSet, subdistrict: '' }));
    setFilteredSubdistricts([]);

    const selectedProvObj = provinces.find(p => p.name.th === provinceName);
    if (selectedProvObj) {
      const dists = allDistricts.filter(d => d.province_id === selectedProvObj.id);
      if (currentUserRole === 'officer') {
        setFilteredDistricts(dists.filter(d => d.name.th === officerAssignedDistrict));
      } else {
        setFilteredDistricts(dists);
      }

      if (selectedDistrictToSet) {
        const selectedDistObj = dists.find(d => d.name.th === selectedDistrictToSet);
        if (selectedDistObj) {
          setFilteredSubdistricts(allSubdistricts.filter(s => s.district_id === selectedDistObj.id));
        }
      }
    } else {
      setFilteredDistricts([]);
    }
  };

  const handleDistrictChange = (districtName, selectedSubdistrictToSet = '') => {
    setFormData(prev => ({ ...prev, district: districtName, subdistrict: selectedSubdistrictToSet }));
    const selectedDistObj = allDistricts.find(d => d.name.th === districtName);
    if (selectedDistObj) {
      const subs = allSubdistricts.filter(s => s.district_id === selectedDistObj.id);
      setFilteredSubdistricts(subs);
    } else {
      setFilteredSubdistricts([]);
    }
  };

  const formatDateThai = (dateString) => {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const y = parseInt(parts[0], 10) + 543;
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return `${d} ${thaiMonths[m]} ${y}`;
  };

  const calculateRemainingDays = (dueDateString, status) => {
    if (status === 'งบ อปท.' || status === 'โอนเงินเข้าบัญชีเกษตรกรแล้ว' || status === 'เสร็จสิ้น') return 'ดำเนินการเสร็จสิ้น';
    if (!dueDateString) return '-';
    
    const parts = dueDateString.split('-');
    if (parts.length !== 3) return '-';
    const due = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `เกินกำหนด ${Math.abs(diffDays)} วัน`;
    if (diffDays === 0) return 'ครบกำหนดวันนี้';
    return `เหลือเวลา ${diffDays} วัน`;
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 6; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
  };

  const generateCRDId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randStr = '';
    for (let i = 0; i < 3; i++) randStr += chars.charAt(Math.floor(Math.random() * chars.length));
    return 'CRD' + randStr;
  };

  const handleDownloadExcel = () => {
    try {
      let csvContent = '\uFEFF';
      csvContent += 'ลำดับ,ประเภทภัยพิบัติ,จังหวัด,อำเภอ,ตำบล,วันที่เกิดภัย,วันครบระยะเวลา,จำนวนครัวเรือน,พื้นที่เสียหาย (ไร่),งบประมาณ (บาท),ประเภทงบประมาณ,สถานะการดำเนินการ,วันที่สถานะ\n';

      disasters.forEach((item, index) => {
        const effectiveDue = item.calculatedDueDate || calculateDueDate(item.startDate, 90);
        const row = [
          index + 1,
          `"${item.disasterType || ''}"`,
          `"${item.province || ''}"`,
          `"${item.district || ''}"`,
          `"${item.subdistrict || ''}"`,
          `"${item.startDate || ''}"`,
          `"${effectiveDue}"`,
          item.households || 0,
          item.damagedArea || 0,
          item.budgetAmount || 0,
          `"${item.budgetType || ''}"`,
          `"${item.status || ''}"`,
          `"${item.statusDate || ''}"`
        ];
        csvContent += row.join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `disaster_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('ดาวน์โหลดไฟล์ข้อมูลสำเร็จ!', 'success');
    } catch (err) {
      console.error('Error downloading excel:', err);
      showNotification('ดาวน์โหลดไฟล์ไม่สำเร็จ', 'error');
    }
  };

  const handleRegisterOfficer = (e) => {
    e.preventDefault();
    const formattedId = registerForm.username.trim().toUpperCase();
    if (!formattedId || formattedId.length !== 6 || !formattedId.startsWith('CRD')) {
      showNotification('ID ต้องมีความยาว 6 ตัว และขึ้นต้นด้วย CRD', 'error');
      return;
    }
    if (!registerForm.password || registerForm.password.length !== 6) {
      showNotification('Pass ต้องมีความยาวครบ 6 ตัวอักษร', 'error');
      return;
    }

    const newOfficer = {
      id: Date.now().toString(),
      username: formattedId,
      password: registerForm.password,
      firstName: registerForm.firstName || 'จนท.',
      lastName: registerForm.lastName || '',
      province: registerForm.province,
      district: registerForm.district
    };

    setOfficersList([...officersList, newOfficer]);
    setIsLoginRegisterOpen(false);
    showNotification('ลงทะเบียน Officer สำเร็จ! สามารถเข้าสู่ระบบได้ทันที', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUserRole === 'viewer') {
      showNotification('ผู้ใช้งานระดับ Viewer ไม่มีสิทธิ์เพิ่มหรือแก้ไขข้อมูล', 'error');
      return;
    }
    if (currentUserRole === 'officer' && formData.district !== officerAssignedDistrict) {
      showNotification(`Officer สามารถบันทึกข้อมูลได้เฉพาะอำเภอ ${officerAssignedDistrict} เท่านั้น`, 'error');
      return;
    }

    const isNumeric = (val) => /^\d+(\.\d+)?$/.test(val);
    if (formData.households && !isNumeric(formData.households)) {
      showNotification('กรุณากรอก "จำนวนครัวเรือน" เป็นตัวเลขเท่านั้น', 'error');
      return;
    }
    if (formData.damagedArea && !isNumeric(formData.damagedArea)) {
      showNotification('กรุณากรอก "พื้นที่เสียหาย" เป็นตัวเลขเท่านั้น', 'error');
      return;
    }
    if (formData.budgetAmount && !isNumeric(formData.budgetAmount)) {
      showNotification('กรุณากรอก "งบประมาณ" เป็นตัวเลขเท่านั้น', 'error');
      return;
    }

    const confirmMsg = editingId ? 'คุณต้องการบันทึกการแก้ไขข้อมูลนี้ใช่หรือไม่?' : 'คุณต้องการเพิ่มข้อมูลภัยพิบัติด้านพืชนี้ใช่หรือไม่?';
    
    setConfirmModal({
      show: true,
      message: confirmMsg,
      onConfirm: () => {
        setConfirmModal({ show: false, message: '', onConfirm: null });
        try {
          const formattedArea = formData.damagedArea ? Number(formData.damagedArea).toFixed(4) : '0.0000';
          let updatedList = [];

          if (editingId) {
            updatedList = disasters.map(item => {
              if (item._id === editingId) {
                return { 
                  ...item, 
                  disasterType: formData.disasterType,
                  province: formData.province,
                  district: formData.district,
                  subdistrict: formData.subdistrict,
                  startDate: formData.startDate,
                  households: formData.households,
                  damagedArea: formattedArea,
                  budgetAmount: formData.budgetAmount,
                  budgetType: formData.budgetType
                };
              }
              return item;
            });
          } else {
            const newDisaster = { 
              _id: Date.now().toString(), 
              ...formData, 
              damagedArea: formattedArea, 
              status: 'อยู่ระหว่างสำรวจ', 
              statusDate: '', 
              calculatedDueDate: calculateDueDate(formData.startDate, 90) 
            };
            updatedList = [newDisaster, ...disasters];
          }
          
          localStorage.setItem('disasters', JSON.stringify(updatedList));
          setDisasters(updatedList);
          showNotification('บันทึกข้อมูลสำเร็จ!', 'success');
          setIsOpenModal(false);
          setEditingId(null);

          if (detailModalData) {
            const refreshedGroupItems = updatedList.filter(i => i.disasterType === detailModalData.disasterType && i.startDate === detailModalData.startDate);
            setDetailModalData({ ...detailModalData, items: refreshedGroupItems });
          }
        } catch (err) {
          console.error('Error submitting form:', err);
          showNotification('บันทึกข้อมูลไม่สำเร็จ', 'error');
        }
      }
    });
  };

  const handleSelectedExtensionUpdate = (newDate) => {
    if (currentUserRole === 'viewer') {
      showNotification('ผู้ใช้งานระดับ Viewer ไม่มีสิทธิ์แก้ไขข้อมูล', 'error');
      return;
    }
    if (selectedSubItemIds.length === 0) {
      showNotification('กรุณาเลือก Checkbox รายการที่ต้องการก่อนอัปเดตวันขยายเวลา', 'error');
      return;
    }

    const updatedList = disasters.map(item => {
      if (selectedSubItemIds.includes(item._id)) {
        return { ...item, calculatedDueDate: newDate };
      }
      return item;
    });

    localStorage.setItem('disasters', JSON.stringify(updatedList));
    setDisasters(updatedList);
    showNotification(`อัปเดตวันขยายเวลาสำเร็จ (${selectedSubItemIds.length} รายการ)`, 'success');

    if (detailModalData) {
      const refreshedGroupItems = updatedList.filter(i => i.disasterType === detailModalData.disasterType && i.startDate === detailModalData.startDate);
      setDetailModalData({ ...detailModalData, items: refreshedGroupItems });
    }
  };

  const handleSelectedStatusUpdate = (newStatus, newStatusDate) => {
    if (currentUserRole === 'viewer') {
      showNotification('ผู้ใช้งานระดับ Viewer ไม่มีสิทธิ์แก้ไขข้อมูล', 'error');
      return;
    }
    if (selectedSubItemIds.length === 0) {
      showNotification('กรุณาเลือก Checkbox รายการที่ต้องการก่อนอัปเดตสถานะ', 'error');
      return;
    }

    const updatedList = disasters.map(item => {
      if (selectedSubItemIds.includes(item._id)) {
        return { 
          ...item, 
          status: newStatus !== undefined ? newStatus : item.status, 
          statusDate: newStatusDate !== undefined ? newStatusDate : item.statusDate 
        };
      }
      return item;
    });

    localStorage.setItem('disasters', JSON.stringify(updatedList));
    setDisasters(updatedList);
    showNotification(`อัปเดตสถานะสำเร็จ (${selectedSubItemIds.length} รายการ)`, 'success');

    if (detailModalData) {
      const refreshedGroupItems = updatedList.filter(i => i.disasterType === detailModalData.disasterType && i.startDate === detailModalData.startDate);
      setDetailModalData({ ...detailModalData, items: refreshedGroupItems });
    }
  };

  const handleGroupSelectedItems = () => {
    if (selectedSubItemIds.length < 2) {
      showNotification('กรุณาเลือกรายการอย่างน้อย 2 รายการเพื่อจัดกลุ่ม', 'error');
      return;
    }

    showNotification(`จัดกลุ่มสำเร็จ ${selectedSubItemIds.length} รายการ`, 'success');
    setSelectedSubItemIds([]);
  };

  const handleDelete = (id, itemDistrict = '') => {
    if (currentUserRole === 'viewer') {
      showNotification('ผู้ใช้งานระดับ Viewer ไม่มีสิทธิ์ลบข้อมูล', 'error');
      return;
    }
    if (currentUserRole === 'officer' && itemDistrict !== officerAssignedDistrict) {
      showNotification(`Officer สามารถลบข้อมูลได้เฉพาะในอำเภอ ${officerAssignedDistrict} เท่านั้น`, 'error');
      return;
    }

    setConfirmModal({
      show: true,
      message: 'คุณต้องการลบข้อมูลรายการนี้ใช่หรือไม่?',
      onConfirm: () => {
        setConfirmModal({ show: false, message: '', onConfirm: null });
        const updatedList = disasters.filter(item => item._id !== id);
        localStorage.setItem('disasters', JSON.stringify(updatedList));
        setDisasters(updatedList);
        showNotification('ลบข้อมูลเรียบร้อยแล้ว', 'success');

        if (detailModalData) {
          const remainingItems = updatedList.filter(i => i.disasterType === detailModalData.disasterType && i.startDate === detailModalData.startDate);
          if (remainingItems.length === 0) setDetailModalData(null);
          else setDetailModalData({ ...detailModalData, items: remainingItems });
        }
      }
    });
  };

  const handleEditClick = (item) => {
    if (currentUserRole === 'viewer') {
      showNotification('ผู้ใช้งานระดับ Viewer ไม่มีสิทธิ์แก้ไขข้อมูล', 'error');
      return;
    }
    if (currentUserRole === 'officer' && item.district !== officerAssignedDistrict) {
      showNotification(`Officer สามารถแก้ไขข้อมูลได้เฉพาะในอำเภอ ${officerAssignedDistrict} เท่านั้น`, 'error');
      return;
    }

    setEditingId(item._id);
    setFormData({
      disasterType: item.disasterType || '',
      province: item.province || 'เชียงราย',
      district: item.district || '',
      subdistrict: item.subdistrict || '',
      startDate: item.startDate || '',
      households: item.households || '',
      damagedArea: item.damagedArea || '',
      budgetAmount: item.budgetAmount || '',
      budgetType: item.budgetType || '',
      status: item.status || 'อยู่ระหว่างสำรวจ',
      statusDate: item.statusDate || '',
      calculatedDueDate: item.calculatedDueDate || ''
    });

    const selectedProvObj = provinces.find(p => p.name.th === (item.province || 'เชียงราย'));
    if (selectedProvObj) {
      const dists = allDistricts.filter(d => d.province_id === selectedProvObj.id);
      setFilteredDistricts(currentUserRole === 'officer' ? dists.filter(d => d.name.th === officerAssignedDistrict) : dists);

      const selectedDistObj = dists.find(d => d.name.th === item.district);
      if (selectedDistObj) {
        const subs = allSubdistricts.filter(s => s.district_id === selectedDistObj.id);
        setFilteredSubdistricts(subs);
      } else {
        setFilteredSubdistricts([]);
      }
    }

    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setEditingId(null);
    setSelectedSubItemIds([]);
    setFormData({
      disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: currentUserRole === 'officer' ? officerAssignedDistrict : '', subdistrict: '',
      startDate: '', households: '', damagedArea: '', budgetAmount: '', budgetType: '', status: 'อยู่ระหว่างสำรวจ', statusDate: '', calculatedDueDate: ''
    });
    setFilteredDistricts([]);
    setFilteredSubdistricts([]);
  };

  // --- หน้า Login Page ---
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", overflow: 'hidden', background: '#ffffff', position: 'relative' }}>
        
        {showOwlMascot && (
          <div style={{
            position: 'fixed',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'owlFlyAcross 7s cubic-bezier(0.3, 0, 0.2, 1) forwards'
          }}>
            <div style={{
              position: 'relative',
              fontSize: '65px',
              filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.2))',
              animation: 'owlFlapWings 0.3s infinite ease-in-out'
            }}>
              🦉
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                right: '-28px',
                fontSize: '30px',
                animation: 'fishWiggle 0.4s infinite ease-in-out'
              }}>
                🐟
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes owlFlyAcross {
            0% { transform: translate(-120px, 80vh) scaleX(1); }
            30% { transform: translate(30vw, 15vh) scaleX(1); }
            60% { transform: translate(70vw, 50vh) scaleX(1); }
            85% { transform: translate(40vw, 30vh) scaleX(-1); }
            100% { transform: translate(110vw, -50px) scaleX(-1); }
          }
          @keyframes owlFlapWings {
            0%, 100% { transform: translateY(0px) rotate(-3deg); }
            50% { transform: translateY(-15px) rotate(4deg); }
          }
          @keyframes fishWiggle {
            0%, 100% { transform: translateY(0) rotate(-10deg) scale(1); }
            50% { transform: translateY(-20px) rotate(15deg) scale(1.15); }
          }
        `}</style>

        {bottomRightNotifyAlert && (
          <div style={{
            position: 'fixed',
            bottom: '25px',
            right: '25px',
            background: '#fff3cd',
            border: '1px solid #ffeeba',
            color: '#856404',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 2500,
            fontSize: '13px',
            fontWeight: 'bold',
            maxWidth: '350px',
            opacity: isBottomRightNotifyFading ? 0 : 1,
            transition: 'opacity 0.8s ease-in-out'
          }}>
            {bottomRightNotifyAlert}
          </div>
        )}

        {notification.show && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 2000, background: notification.type === 'success' ? '#28a745' : '#dc3545', color: '#fff', padding: '12px 20px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 'bold', fontSize: '14px' }}>
            {notification.type === 'success' ? '✅ ' : '⚠️ '} {notification.message}
          </div>
        )}

        <div style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px', boxSizing: 'border-box', background: '#ffffff', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#28a745', color: '#fff', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', fontSize: '16px' }}>CR-DISASTER</div>
            <span style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>Chiang Rai Center</span>
          </div>
          
          <h1 style={{ fontSize: '22px', color: '#1a1a1a', marginBottom: '8px', fontWeight: '700', lineHeight: '1.4', textAlign: 'center' }}>
            ระบบติดตามการให้ความช่วยเหลือภัยพิบัติจังหวัดเชียงราย
          </h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px', fontWeight: '500', textAlign: 'center' }}>
            Sign into your account
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '380px', margin: '0 auto', width: '100%' }}>
            <div>
              <input type="text" placeholder="ID (เช่น admin, cri001, CRD...)" value={loginInputId} onChange={(e) => setLoginInputId(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #dcedfc', background: '#f8fbff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <input type="password" placeholder="PASSWORD (รหัส 6 หลัก)" value={loginInputPass} onChange={(e) => setLoginInputPass(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #dcedfc', background: '#f8fbff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)' }}>Log In</button>
            
            <button type="button" onClick={() => {
              setRegisterForm({ username: generateCRDId(), password: generateRandomPassword(), firstName: '', lastName: '', province: 'เชียงราย', district: chiangRaiDistricts[0] });
              setIsLoginRegisterOpen(true);
            }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #17a2b8', background: '#e0f7fa', color: '#006064', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              + ลงทะเบียนเข้าใช้งาน
            </button>

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '15px' }}>
              contact us : ***********.****@*****.***
            </div>
          </form>
        </div>

        <div style={{
          flex: '1',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#00bcd4',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          padding: '40px'
        }}>
          <div style={{ textAlign: 'center', color: '#fff', maxWidth: '500px', background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '25px', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', fontWeight: '600' }}>จังหวัดเชียงราย</h2>
            <p style={{ fontSize: '13px', color: '#f0f0f0', lineHeight: '1.5', margin: 0 }}>
              ระบบบูรณาการข้อมูลภัยพิบัติด้านพืช ติดตามงบประมาณเยียวยา และบริหารจัดการเวลาช่วยเหลืออย่างแม่นยำ
            </p>
          </div>
        </div>

        {isLoginRegisterOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1600 }}>
            <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '420px', maxWidth: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>ลงทะเบียนเข้าใช้งาน Officer</h3>
                <button onClick={() => setIsLoginRegisterOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
              </div>
              <form onSubmit={handleRegisterOfficer} style={{ display: 'grid', gap: '10px', textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>ID (6 ตัวอักษร, ขึ้นต้น CRD):</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input type="text" maxLength={6} value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })} required style={{ ...inputStyle, flex: '1', fontWeight: 'bold', letterSpacing: '1px' }} />
                    <button type="button" onClick={() => setRegisterForm({ ...registerForm, username: generateCRDId() })} style={{ padding: '6px 10px', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>สุ่ม ID</button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Pass (รหัส 6 หลัก):</label>
                  <input type="text" maxLength={6} placeholder="PASSWORD (รหัส 6 หลัก)" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>ชื่อ:</label>
                  <input type="text" placeholder="ชื่อจริง" value={registerForm.firstName} onChange={e => setRegisterForm({ ...registerForm, firstName: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>นามสกุล (ไม่บังคับ):</label>
                  <input type="text" placeholder="นามสกุล" value={registerForm.lastName} onChange={e => setRegisterForm({ ...registerForm, lastName: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>จังหวัด:</label>
                  <select value={registerForm.province} disabled style={{ ...inputStyle, background: '#e9ecef' }}>
                    <option value="เชียงราย">เชียงราย</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>อำเภอ:</label>
                  <select value={registerForm.district} onChange={e => setRegisterForm({ ...registerForm, district: e.target.value })} required style={inputStyle}>
                    {chiangRaiDistricts.map(d => (<option key={d} value={d}>อ.{d}</option>))}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsLoginRegisterOpen(false)} style={{ padding: '8px 14px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
                  <button type="submit" style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>บันทึกข้อมูล</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- หน้า Dashboard หลัก ---
  const scopedDisasters = currentUserRole === 'officer' 
    ? disasters.filter(item => item.district === officerAssignedDistrict)
    : disasters;

  const searchedDisasters = scopedDisasters.filter(item => {
    if (viewMode === 'pending') {
      const isCompleted = item.status === 'โอนเงินเข้าบัญชีเกษตรกรแล้ว' || item.status === 'เสร็จสิ้น' || item.status === 'งบ อปท.' || (item.budgetType && (item.budgetType.includes('อปท') || item.budgetType.includes('ท้องถิ่น')));
      if (isCompleted) return false;
    }

    if (globalSearchKeyword.trim() !== '') {
      const kw = globalSearchKeyword.trim().toLowerCase();
      const matchType = (item.disasterType || '').toLowerCase().includes(kw);
      const matchDist = (item.district || '').toLowerCase().includes(kw);
      const matchSub = (item.subdistrict || '').toLowerCase().includes(kw);
      const matchStatus = (item.status || '').toLowerCase().includes(kw);
      const matchBudgetType = (item.budgetType || '').toLowerCase().includes(kw);
      const matchDate = (item.startDate || '').includes(kw);
      const matchStatusDate = (item.statusDate || '').includes(kw);
      const matchBudget = String(item.budgetAmount || '').includes(kw);
      const matchHouseholds = String(item.households || '').includes(kw);
      const matchArea = String(item.damagedArea || '').includes(kw);

      if (!matchType && !matchDist && !matchSub && !matchStatus && !matchBudgetType && !matchDate && !matchStatusDate && !matchBudget && !matchHouseholds && !matchArea) {
        return false;
      }
    }

    if (currentUserRole === 'admin' && filterDistrict && item.district !== filterDistrict) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterBudgetType && !((item.budgetType || '').includes(filterBudgetType))) return false;
    if (filterStartDate && item.startDate !== filterStartDate) return false;
    if (filterStatusDate && item.statusDate !== filterStatusDate) return false;

    return true;
  });

  const groupedDataMap = {};
  searchedDisasters.forEach(item => {
    const key = `${item.disasterType}_${item.startDate}`;
    if (!groupedDataMap[key]) {
      groupedDataMap[key] = {
        disasterType: item.disasterType,
        startDate: item.startDate,
        calculatedDueDate: item.calculatedDueDate || calculateDueDate(item.startDate, 90),
        totalHouseholds: 0,
        totalDamagedArea: 0,
        totalBudget: 0,
        hasCompleted: false,
        items: []
      };
    }
    groupedDataMap[key].totalHouseholds += (Number(item.households) || 0);
    groupedDataMap[key].totalDamagedArea += (Number(item.damagedArea) || 0);
    groupedDataMap[key].totalBudget += (Number(String(item.budgetAmount || 0).replace(/,/g, '')) || 0);
    if (item.status === 'โอนเงินเข้าบัญชีเกษตรกรแล้ว' || item.status === 'เสร็จสิ้น' || item.status === 'งบ อปท.') groupedDataMap[key].hasCompleted = true;
    groupedDataMap[key].items.push(item);
  });

  const mergedTableData = Object.values(groupedDataMap).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const totalUniqueDates = new Set(searchedDisasters.map(i => i.startDate)).size;
  const totalHouseholds = searchedDisasters.reduce((sum, item) => sum + (Number(item.households) || 0), 0);
  const totalDamagedArea = searchedDisasters.reduce((sum, item) => sum + (Number(item.damagedArea) || 0), 0);
  const totalBudget = searchedDisasters.reduce((sum, item) => sum + (Number(String(item.budgetAmount || 0).replace(/,/g, '')) || 0), 0);

  const advanceBudgetItems = scopedDisasters.filter(item => {
    const bType = (item.budgetType || '').toLowerCase();
    return bType.includes('เงินทดรอง') || bType.includes('ทดรอง');
  });

  const totalAdvanceBudget = advanceBudgetItems.reduce((sum, item) => sum + (Number(String(item.budgetAmount || 0).replace(/,/g, '')) || 0), 0);
  
  const totalPaidAdvanceBudget = advanceBudgetItems
    .filter(item => item.status === 'โอนเงินเข้าบัญชีเกษตรกรแล้ว' || item.status === 'เสร็จสิ้น')
    .reduce((sum, item) => sum + (Number(String(item.budgetAmount || 0).replace(/,/g, '')) || 0), 0);

  const progressPercentage = totalAdvanceBudget > 0 ? Math.min(100, Math.max(0, (totalPaidAdvanceBudget / totalAdvanceBudget) * 100)) : 0;

  // กราฟสถิติ
  const uniqueDatesList = [...new Set(scopedDisasters.map(i => i.startDate))].filter(Boolean).sort();
  const scopedDateSummary = {};
  uniqueDatesList.forEach(dateStr => {
    const matched = scopedDisasters.filter(i => i.startDate === dateStr);
    scopedDateSummary[dateStr] = {
      damagedArea: matched.reduce((s, i) => s + (Number(i.damagedArea) || 0), 0),
      budget: matched.reduce((s, i) => s + (Number(String(i.budgetAmount || 0).replace(/,/g, '')) || 0), 0)
    };
  });
  const scopedChartMaxVal = Math.max(...uniqueDatesList.map(d => scopedDateSummary[d]?.[chartMetric] || 0), 1);

  const provinceUniqueDates = [...new Set(disasters.map(i => i.startDate))].filter(Boolean).sort();
  const provinceDateSummary = {};
  provinceUniqueDates.forEach(dateStr => {
    const matched = disasters.filter(i => i.startDate === dateStr);
    provinceDateSummary[dateStr] = {
      damagedArea: matched.reduce((s, i) => s + (Number(i.damagedArea) || 0), 0),
      budget: matched.reduce((s, i) => s + (Number(String(i.budgetAmount || 0).replace(/,/g, '')) || 0), 0)
    };
  });
  const provinceChartMaxVal = Math.max(...provinceUniqueDates.map(d => provinceDateSummary[d]?.[chartMetric] || 0), 1);

  const districtSummaryMap = {};
  chiangRaiDistricts.forEach(dist => {
    const itemsInDist = disasters.filter(i => i.district === dist);
    const hasGreen = itemsInDist.length > 0 && itemsInDist.some(i => 
      i.status === 'โอนเงินเข้าบัญชีเกษตรกรแล้ว' || 
      i.status === 'งบ อปท.' ||
      (i.budgetType && (i.budgetType.includes('อปท') || i.budgetType.includes('ท้องถิ่น')))
    );

    const subdistrictsSet = [...new Set(itemsInDist.map(i => i.subdistrict).filter(Boolean))];
    const totalDistBudget = itemsInDist.reduce((s, i) => s + (Number(String(i.budgetAmount || 0).replace(/,/g, '')) || 0), 0);

    districtSummaryMap[dist] = {
      households: itemsInDist.reduce((s, i) => s + (Number(i.households) || 0), 0),
      damagedArea: itemsInDist.reduce((s, i) => s + (Number(i.damagedArea) || 0), 0),
      budget: totalDistBudget,
      count: itemsInDist.length,
      isGreen: hasGreen,
      subdistricts: subdistrictsSet
    };
  });

  let displayUserIdentifier = currentUserRole.toUpperCase();
  if (currentUserRole === 'admin') {
    displayUserIdentifier = 'ADMIN';
  } else if (currentUserRole === 'viewer') {
    displayUserIdentifier = 'CRI001';
  } else if (currentLoggedInUser) {
    displayUserIdentifier = `${currentLoggedInUser.username} (${currentLoggedInUser.firstName} ${currentLoggedInUser.lastName || ''})`;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
      
      {showOwlMascot && (
        <div style={{
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'none',
          animation: 'owlFlyAcross 7s cubic-bezier(0.3, 0, 0.2, 1) forwards'
        }}>
          <div style={{
            position: 'relative',
            fontSize: '65px',
            filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.2))',
            animation: 'owlFlapWings 0.3s infinite ease-in-out'
          }}>
            🦉
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              right: '-28px',
              fontSize: '30px',
              animation: 'fishWiggle 0.4s infinite ease-in-out'
            }}>
              🐟
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes owlFlyAcross {
          0% { transform: translate(-120px, 80vh) scaleX(1); }
          30% { transform: translate(30vw, 15vh) scaleX(1); }
          60% { transform: translate(70vw, 50vh) scaleX(1); }
          85% { transform: translate(40vw, 30vh) scaleX(-1); }
          100% { transform: translate(110vw, -50px) scaleX(-1); }
        }
        @keyframes owlFlapWings {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-15px) rotate(4deg); }
        }
        @keyframes fishWiggle {
          0%, 100% { transform: translateY(0) rotate(-10deg) scale(1); }
          50% { transform: translateY(-20px) rotate(15deg) scale(1.15); }
        }
      `}</style>

      {bottomRightNotifyAlert && (
        <div style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          background: '#fff3cd',
          border: '1px solid #ffeeba',
          color: '#856404',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 2500,
          fontSize: '13px',
          fontWeight: 'bold',
          maxWidth: '350px',
          opacity: isBottomRightNotifyFading ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out'
        }}>
          {bottomRightNotifyAlert}
        </div>
      )}

      {hoveredDistrictInfo && (
        <div style={{
          position: 'fixed',
          top: mousePosition.y - 85,
          left: mousePosition.x + 15,
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 3000,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          lineHeight: '1.4',
          maxWidth: '250px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#ffc107', marginBottom: '4px' }}>อำเภอ{hoveredDistrictInfo.dist}</div>
          <div><b>ตำบล:</b> {hoveredDistrictInfo.subdistricts.length > 0 ? hoveredDistrictInfo.subdistricts.join(', ') : 'ไม่มีข้อมูลตำบล'}</div>
          <div><b>วงเงินช่วยเหลือรวม:</b> {hoveredDistrictInfo.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</div>
        </div>
      )}

      {/* Tooltip สำหรับปุ่มแสดงรายละเอียด */}
      {hoveredDetailTooltip && (
        <div style={{
          position: 'fixed',
          top: mousePosition.y - 85,
          left: mousePosition.x + 15,
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 3500,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          lineHeight: '1.5',
          maxWidth: '280px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#ffc107', marginBottom: '4px' }}>รายละเอียดกลุ่มภัยพิบัติ:</div>
          {hoveredDetailTooltip.items.map((it, idx) => (
            <div key={idx} style={{ marginBottom: '2px' }}>
              • <b>อ.{it.district}:</b> <span style={{ color: '#20c997' }}>{it.status}</span>
            </div>
          ))}
        </div>
      )}

      {notification.show && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1500, background: notification.type === 'success' ? '#28a745' : '#dc3545', color: '#fff', padding: '12px 20px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 'bold', fontSize: '14px' }}>
          {notification.type === 'success' ? '✅ ' : '⚠️ '} {notification.message}
        </div>
      )}

      {confirmModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1400 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '400px', maxWidth: '90%', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>ยืนยันการทำรายการ</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '15px' }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={() => setConfirmModal({ show: false, message: '', onConfirm: null })} style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ยกเลิก</button>
              <button onClick={confirmModal.onConfirm} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal รายงาน */}
      {isReportModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1600 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '600px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>📊 รายงานสรุปผลการช่วยเหลือภัยพิบัติด้านพืช {currentUserRole === 'officer' && `(อำเภอ${officerAssignedDistrict})`}</h3>
              <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
              {currentUserRole === 'officer' ? `รายงานข้อมูลเฉพาะอำเภอ${officerAssignedDistrict}:` : 'รายงานภาพรวมจังหวัดเชียงราย:'}<br />
              - จำนวนข้อมูลกลุ่มภัยพิบัติทั้งหมด: <b>{mergedTableData.length} กลุ่ม</b><br />
              - ครัวเรือนที่ได้รับผลกระทบรวม: <b>{totalHouseholds.toLocaleString()} ครัวเรือน</b><br />
              - พื้นที่เสียหายรวม: <b>{totalDamagedArea.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ไร่</b><br />
              - งบประมาณเยียวยาทั้งหมด: <b>{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</b><br />
              - จ่ายเงินสำเร็จแล้ว (เงินทดรองราชการ): <b>{totalPaidAdvanceBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท ({progressPercentage.toFixed(2)}%)</b>
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setIsReportModalOpen(false)} style={{ padding: '8px 18px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ปิดรายงาน</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal รายงานการขยายระยะเวลา (Admin) */}
      {isExtensionReportModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1600 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '650px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#fd7e14' }}>⏱️ รายงานการขยายกรอบระยะเวลาช่วยเหลือ</h3>
              <button onClick={() => setIsExtensionReportModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
              รายการภัยพิบัติทั้งหมดในระบบได้รับการกำหนดกรอบระยะเวลาดำเนินงาน 90 วัน โดยมีรายการที่บันทึกข้อมูลรวมทั้งสิ้น <b>{disasters.length} รายการ</b> สามารถตรวจสอบรายละเอียดได้จากตารางสรุปหลัก
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setIsExtensionReportModalOpen(false)} style={{ padding: '8px 18px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Prompt Info */}
      {isPromptInfoModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1600 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '600px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>💡 Prompt Info / ข้อมูลระบบเบื้องต้น</h3>
              <button onClick={() => setIsPromptInfoModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.6' }}>
              ระบบติดตามและบริหารจัดการช่วยเหลือภัยพิบัติด้านพืช จังหวัดเชียงราย พัฒนาขึ้นเพื่อช่วยอำนวยความสะดวกแก่เจ้าหน้าที่ในการบันทึก ตรวจสอบ และติดตามกรอบระยะเวลาการช่วยเหลือภายใน 90 วัน พร้อมฟังก์ชันแผนที่แสดงความเสียหาย, ระบบค้นหาข้อมูล, กราฟสถิติ, และมาสคอตน้องฮูกบินจับปลา
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setIsPromptInfoModalOpen(false)} style={{ padding: '8px 18px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#e9ecef', padding: '12px 15px', borderRadius: '8px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#28a745', color: '#fff', fontWeight: 'bold', padding: '6px 10px', borderRadius: '6px', fontSize: '14px' }}>CR</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>ระบบติดตามการให้ความช่วยเหลือภัยพิบัติ จังหวัดเชียงราย</h2>
            <div style={{ fontSize: '12px', color: '#0056b3', fontWeight: 'bold', marginTop: '3px' }}>
              ชื่อผู้ใช้งาน: <b>{displayUserIdentifier}</b> {currentUserRole === 'officer' && `[อ.${officerAssignedDistrict}]`}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => {
            setLoginInputId('cri001');
            setLoginInputPass('111111');
            setIsLoggedIn(false);
          }} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            ออกจากระบบ (Ctrl+Shift+L)
          </button>
        </div>
      </div>

      {/* Modal ข้อมูลผู้ใช้งาน */}
      {isUsersInfoModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1600 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '700px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>👥 ข้อมูลผู้ใช้งานทั้งหมดในระบบ</h3>
              <button onClick={() => setIsUsersInfoModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#007bff' }}>สิทธิ์ระบบหลัก:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                <li><b>Admin:</b> ID: <code>ADMIN</code> | Pass: <code>053152682</code></li>
                <li><b>Viewer:</b> ID: <code>cri001</code> | Pass: <code>111111</code></li>
              </ul>
            </div>

            <h4 style={{ margin: '15px 0 5px 0', color: '#28a745', textAlign: 'left' }}>รายชื่อ Officer ({officersList.length} คน):</h4>
            {officersList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#777', padding: '15px' }}>ยังไม่มีบัญชี Officer ในระบบ</p>
            ) : (
              <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f1f1f1' }}>
                    <th style={{ width: '50px', textAlign: 'center' }}>ลำดับ</th>
                    <th>ID (ขึ้นต้น CRD)</th>
                    <th>Pass (รหัสผ่าน 6 หลัก)</th>
                    <th>ชื่อ - นามสกุล</th>
                    <th>อำเภอรับผิดชอบ</th>
                  </tr>
                </thead>
                <tbody>
                  {officersList.map((off, index) => (
                    <tr key={off.id}>
                      <td style={{ textAlign: 'center' }}>{index + 1}</td>
                      <td><code>{off.username}</code></td>
                      <td><code>{off.password}</code></td>
                      <td>{off.firstName} {off.lastName || '-'}</td>
                      <td><b>อำเภอ{off.district}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setIsUsersInfoModalOpen(false)} style={{ padding: '8px 18px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* ปุ่มเมนูก่อน Dashboard */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setIsReportModalOpen(true)} style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
          📋 รายงาน
        </button>
        <button onClick={() => setIsPromptInfoModalOpen(true)} style={{ padding: '8px 16px', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
          💡 Prompt Info
        </button>
        {currentUserRole === 'admin' && (
          <button onClick={() => setIsExtensionReportModalOpen(true)} style={{ padding: '8px 16px', background: '#fd7e14', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            ⏱️ รายงานการขยายระยะเวลา
          </button>
        )}
        <button onClick={triggerOwlFlight} style={{ padding: '8px 16px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
          🦉 เรียกน้องฮูก
        </button>
        {currentUserRole === 'admin' && (
          <button onClick={() => setIsUsersInfoModalOpen(true)} style={{ padding: '8px 16px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            👥 ข้อมูลผู้ใช้งาน
          </button>
        )}
        {currentUserRole === 'admin' && (
          <button onClick={handleDownloadExcel} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginLeft: 'auto' }}>
            📥 Download Data (Excel)
          </button>
        )}
      </div>

      {/* Dashboard Card */}
      <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333', borderBottom: '2px solid #dee2e6', paddingBottom: '8px' }}>
          📈 Dashboard ภาพรวมสถานการณ์ {currentUserRole === 'officer' && `(อำเภอ${officerAssignedDistrict})`}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#1565c0', fontWeight: 'bold' }}>จำนวนวันเกิดภัย</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0d47a1', marginTop: '4px' }}>{totalUniqueDates}</div>
          </div>
          <div style={{ background: '#fff9c4', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#f57f17', fontWeight: 'bold' }}>ครัวเรือนผลกระทบ</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f57f17' }}>{totalHouseholds.toLocaleString()}</div>
          </div>
          <div style={{ background: '#ffebee', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#c62828', fontWeight: 'bold' }}>พื้นที่เสียหายรวม (ไร่)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#b71c1c' }}>{totalDamagedArea.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
          </div>
          <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>งบประมาณรวม (บาท)</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b5e20' }}>{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>
            <span>📊 ความคืบหน้าการโอนเงินเยียวยา (เฉพาะเงินทดรองราชการ)</span>
            <span style={{ color: '#28a745' }}>{progressPercentage.toFixed(2)}% ({totalPaidAdvanceBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {totalAdvanceBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท)</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: '#e9ecef', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #dcdcdc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#2c3e50' }}>🗺️ ข้อมูลแสดงความเสียหายรายอำเภอ</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
          {chiangRaiDistricts.map((dist) => {
            const data = districtSummaryMap[dist];
            const hasDamage = data.count > 0;
            const isAssigned = currentUserRole === 'officer' && officerAssignedDistrict === dist;
            
            let bgColor = '#f9f9f9';
            let borderColor = '#ddd';
            if (isAssigned) {
              bgColor = '#d1ecf1';
              borderColor = '#17a2b8';
            } else if (hasDamage) {
              bgColor = data.isGreen ? '#d4edda' : '#f8d7da';
              borderColor = data.isGreen ? '#28a745' : '#dc3545';
            }

            return (
              <div 
                key={dist} 
                onMouseEnter={(e) => {
                  setMousePosition({ x: e.clientX, y: e.clientY });
                  setHoveredDistrictInfo({ dist, subdistricts: data.subdistricts, budget: data.budget });
                }}
                onMouseMove={(e) => {
                  setMousePosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                  setHoveredDistrictInfo(null);
                }}
                style={{ 
                  padding: '10px 4px', 
                  background: bgColor, 
                  border: `2px solid ${borderColor}`, 
                  borderRadius: '6px', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '12px', color: data.isGreen ? '#155724' : hasDamage ? '#721c24' : '#333' }}>อ. {dist}</div>
                <div style={{ fontSize: '10px', color: '#555' }}>{data.households} ครัวเรือน</div>
                <div style={{ fontSize: '9px', color: '#777' }}>{data.damagedArea.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ไร่</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* กราฟสถิติ */}
      <div style={{ background: '#ffffff', border: '1px solid #dcdcdc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#2c3e50' }}>
            {currentUserRole === 'officer' 
              ? `📊 กราฟสถิติเฉพาะอำเภอ ${officerAssignedDistrict} (จำแนกตามวันที่เกิดภัย)` 
              : '📊 กราฟสถิติรวมทั้งจังหวัด (จำแนกตามวันที่เกิดภัย)'}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setChartMetric('damagedArea')} style={{ padding: '6px 12px', background: chartMetric === 'damagedArea' ? '#dc3545' : '#e9ecef', color: chartMetric === 'damagedArea' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              พื้นที่เสียหาย (ไร่)
            </button>
            <button onClick={() => setChartMetric('budget')} style={{ padding: '6px 12px', background: chartMetric === 'budget' ? '#28a745' : '#e9ecef', color: chartMetric === 'budget' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              งบประมาณ (บาท)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          {(currentUserRole === 'officer' ? uniqueDatesList : provinceUniqueDates).length === 0 ? (
            <div style={{ fontSize: '13px', color: '#777', textAlign: 'center' }}>ไม่มีข้อมูลวันที่เกิดภัย</div>
          ) : (
            (currentUserRole === 'officer' ? uniqueDatesList : provinceUniqueDates).map(dateStr => {
              const summaryData = currentUserRole === 'officer' ? scopedDateSummary : provinceDateSummary;
              const maxVal = currentUserRole === 'officer' ? scopedChartMaxVal : provinceChartMaxVal;
              const val = summaryData[dateStr]?.[chartMetric] || 0;
              const barPercent = Math.max(2, (val / maxVal) * 100);

              return (
                <div key={dateStr} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <div style={{ width: '130px', color: '#333', textAlign: 'right', fontWeight: 'bold' }}>📅 {formatDateThai(dateStr)}</div>
                  <div style={{ flex: '1', background: '#e9ecef', height: '18px', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{
                      width: `${barPercent}%`,
                      background: chartMetric === 'damagedArea' ? 'linear-gradient(90deg, #ff6b6b, #ee5253)' : 'linear-gradient(90deg, #10ac84, #1dd1a1)',
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }}></div>
                  </div>
                  <div style={{ width: '140px', textAlign: 'right', fontWeight: 'bold', color: '#555' }}>
                    {chartMetric === 'damagedArea' ? val.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' ไร่' : val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ฿'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ระบบค้นหาและกรองข้อมูล */}
      <div style={{ background: '#f1f3f5', border: '1px solid #ced4da', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#333' }}>🔍 ระบบค้นหาและกรองข้อมูลแบบครอบคลุม</h3>
        
        <div style={{ marginBottom: '12px' }}>
          <input 
            type="text" 
            placeholder="พิมพ์คำค้นหาอิสระ (เช่น ชื่ออำเภอ, ตำบล, ประเภทภัย, สถานะ, งบประมาณ...)" 
            value={globalSearchKeyword} 
            onChange={e => setGlobalSearchKeyword(e.target.value)} 
            style={{ ...inputStyle, padding: '10px 14px', fontSize: '14px', fontWeight: 'bold', borderColor: '#007bff' }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>อำเภอ:</label>
            <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} style={inputStyle}>
              <option value="">-- ทุกอำเภอ --</option>
              {chiangRaiDistricts.map(d => (<option key={d} value={d}>อ.{d}</option>))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>สถานะ:</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inputStyle}>
              <option value="">-- ทุกสถานะ --</option>
              {officialStatuses.map(st => (<option key={st} value={st}>{st}</option>))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>วันที่เกิดภัย:</label>
            <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>วันที่สถานะ:</label>
            <input type="date" value={filterStatusDate} onChange={e => setFilterStatusDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <button onClick={() => { setGlobalSearchKeyword(''); setFilterDistrict(''); setFilterStatus(''); setFilterBudgetType(''); setFilterStartDate(''); setFilterStatusDate(''); }} style={{ padding: '9px 12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', width: '100%' }}>
              ล้างค่า
            </button>
          </div>
        </div>
      </div>

      {currentUserRole !== 'viewer' && (
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => { setEditingId(null); setIsOpenModal(true); }} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            + เพิ่มข้อมูลภัยพิบัติใหม่
          </button>
        </div>
      )}

      {/* Modal รายละเอียดภัยพิบัติ */}
      {detailModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '1050px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <h3 style={{ margin: 0 }}>รายละเอียดภัยพิบัติ: {detailModalData.disasterType} (วันที่เกิดภัย: {formatDateThai(detailModalData.startDate)})</h3>
                <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>วันครบระยะเวลามาตรฐาน (เกิดภัย + 90 วัน): <b>{formatDateThai(calculateDueDate(detailModalData.startDate, 90))}</b></div>
              </div>
              <button onClick={() => setDetailModalData(null)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>

            {currentUserRole !== 'viewer' && (
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #ced4da', marginBottom: '15px' }}>
                <div style={{ fontSize: '13px', color: '#d9534f', fontWeight: 'bold', marginBottom: '10px' }}>
                  * หมายเหตุ: การเปลี่ยนแปลงด้านล่างนี้จะมีผลเฉพาะรายการที่ท่านเลือก <b>Checkbox</b> ไว้เท่านั้น (เลือกอยู่ {selectedSubItemIds.length} รายการ)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#333', display: 'block', marginBottom: '5px' }}>📅 วันขอขยายระยะเวลาใหม่:</label>
                    <input 
                      type="date" 
                      onChange={(e) => handleSelectedExtensionUpdate(e.target.value)} 
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', fontWeight: 'bold', background: '#fff' }} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#333', display: 'block', marginBottom: '5px' }}>สถานะการดำเนินการ:</label>
                      <select 
                        onChange={(e) => handleSelectedStatusUpdate(e.target.value, undefined)}
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', background: '#fff' }}
                        defaultValue=""
                      >
                        <option value="" disabled>-- เลือกสถานะ --</option>
                        {officialStatuses.map(st => (<option key={st} value={st}>{st}</option>))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#333', display: 'block', marginBottom: '5px' }}>วันที่ :</label>
                      <input 
                        type="date" 
                        onChange={(e) => handleSelectedStatusUpdate(undefined, e.target.value)}
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', background: '#fff' }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentUserRole !== 'viewer' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', color: '#555' }}>
                  เลือกแล้ว: <b>{selectedSubItemIds.length}</b> รายการ
                </div>
                <button 
                  onClick={handleGroupSelectedItems} 
                  style={{ padding: '6px 14px', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  🔗 จัดกลุ่มข้อมูลที่เลือก ({selectedSubItemIds.length})
                </button>
              </div>
            )}

            <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f1f1f1' }}>
                  {currentUserRole !== 'viewer' && (
                    <th style={{ width: '40px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubItemIds(detailModalData.items.map(i => i._id));
                          } else {
                            setSelectedSubItemIds([]);
                          }
                        }}
                        checked={selectedSubItemIds.length === detailModalData.items.length && detailModalData.items.length > 0}
                      />
                    </th>
                  )}
                  <th>พื้นที่ (จังหวัด / อำเภอ / ตำบล)</th>
                  <th>ครัวเรือน</th>
                  <th>พื้นที่เสียหาย (ไร่)</th>
                  <th>งบประมาณ</th>
                  <th>วันครบกำหนดระยะเวลา</th>
                  <th>สถานะการดำเนินการ และวันที่</th>
                  {currentUserRole !== 'viewer' && <th style={{ textAlign: 'center', width: '120px' }}>การดำเนินการ</th>}
                </tr>
              </thead>
              <tbody>
                {detailModalData.items.map((subItem) => {
                  const defaultDue = calculateDueDate(subItem.startDate, 90);
                  const effectiveDue = subItem.calculatedDueDate ? subItem.calculatedDueDate : defaultDue;
                  const isChecked = selectedSubItemIds.includes(subItem._id);

                  return (
                    <tr key={subItem._id} style={{ background: isChecked ? '#f8f9fa' : 'transparent' }}>
                      {currentUserRole !== 'viewer' && (
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubItemIds([...selectedSubItemIds, subItem._id]);
                              } else {
                                setSelectedSubItemIds(selectedSubItemIds.filter(id => id !== subItem._id));
                              }
                            }}
                          />
                        </td>
                      )}
                      <td>{subItem.province} / {subItem.district} / {subItem.subdistrict}</td>
                      <td style={{ textAlign: 'center' }}>{Number(subItem.households || 0).toLocaleString()}</td>
                      <td style={{ textAlign: 'center' }}>{Number(subItem.damagedArea || 0).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
                      <td style={{ textAlign: 'right' }}>{Number(String(subItem.budgetAmount || 0).replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>
                        {formatDateThai(effectiveDue)}
                      </td>
                      <td><b>{subItem.status}</b> {subItem.statusDate ? `(${formatDateThai(subItem.statusDate)})` : ''}</td>
                      {currentUserRole !== 'viewer' && (
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => handleEditClick(subItem)} style={{ padding: '3px 8px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', marginRight: '4px', fontWeight: 'bold' }}>แก้ไข</button>
                          <button onClick={() => handleDelete(subItem._id, subItem.district)} style={{ padding: '3px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>ลบ</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button onClick={() => setDetailModalData(null)} style={{ padding: '8px 15px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal เพิ่ม/แก้ไขข้อมูล */}
      {isOpenModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'แก้ไขข้อมูลภัยพิบัติ' : 'บันทึกข้อมูลภัยพิบัติใหม่'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={labelStyle}>ประเภทภัยพิบัติ:</label>
                <input type="text" value={formData.disasterType} onChange={e => setFormData({ ...formData, disasterType: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>จังหวัด:</label>
                  <select value={formData.province} onChange={e => handleProvinceChange(e.target.value)} required style={inputStyle}>
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces.map(p => (<option key={p.id} value={p.name.th}>{p.name.th}</option>))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>อำเภอ/เขต:</label>
                  <select value={formData.district} onChange={e => handleDistrictChange(e.target.value)} required disabled={!formData.province || currentUserRole === 'officer'} style={{ ...inputStyle, background: currentUserRole === 'officer' ? '#e9ecef' : '#fff' }}>
                    <option value="">-- เลือกอำเภอ --</option>
                    {filteredDistricts.map(d => (<option key={d.id} value={d.name.th}>{d.name.th}</option>))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>ตำบล/แขวง:</label>
                  <select value={formData.subdistrict} onChange={e => setFormData({ ...formData, subdistrict: e.target.value })} required disabled={!formData.district} style={inputStyle}>
                    <option value="">-- เลือกตำบล --</option>
                    {filteredSubdistricts.map(s => (<option key={s.id} value={s.name.th}>{s.name.th}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>วันที่เกิดภัยพิบัติ:</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>จำนวนครัวเรือน:</label>
                  <input type="text" value={formData.households} onChange={e => setFormData({ ...formData, households: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>พื้นที่เสียหาย (ไร่):</label>
                  <input type="text" value={formData.damagedArea} onChange={e => setFormData({ ...formData, damagedArea: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>งบประมาณ (บาท):</label>
                  <input type="text" value={formData.budgetAmount} onChange={e => setFormData({ ...formData, budgetAmount: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>ประเภทงบประมาณ:</label>
                  <input type="text" value={formData.budgetType} onChange={e => setFormData({ ...formData, budgetType: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '8px 15px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
                <button type="submit" style={{ padding: '8px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>บันทึกข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ตารางแสดงรายการข้อมูลหลัก */}
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>รายการข้อมูลภัยพิบัติในระบบ ({mergedTableData.length} กลุ่ม)</h3>
          <div style={{ display: 'flex', gap: '8px', background: '#e9ecef', padding: '4px', borderRadius: '6px' }}>
            <button 
              onClick={() => setViewMode('all')} 
              style={{ padding: '6px 12px', background: viewMode === 'all' ? '#007bff' : 'transparent', color: viewMode === 'all' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
            >
              แสดงข้อมูลทั้งหมด
            </button>
            <button 
              onClick={() => setViewMode('pending')} 
              style={{ padding: '6px 12px', background: viewMode === 'pending' ? '#fd7e14' : 'transparent', color: viewMode === 'pending' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
            >
              เฉพาะที่อยู่ระหว่างดำเนินการ
            </button>
          </div>
        </div>

        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: '14px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th style={{ width: '60px', textAlign: 'center' }}>ลำดับ</th>
              <th>ประเภทภัย</th>
              <th>วันที่เกิดภัย</th>
              <th>วันครบระยะเวลา</th>
              <th>เหลือเวลาถึงกำหนด</th>
              <th style={{ textAlign: 'center' }}>ครัวเรือนรวม</th>
              <th style={{ textAlign: 'center' }}>พื้นที่เสียหายรวม (ไร่)</th>
              <th style={{ textAlign: 'right' }}>งบประมาณรวม</th>
              <th style={{ textAlign: 'center' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {mergedTableData.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', color: '#777' }}>ไม่พบข้อมูลตามเงื่อนไขการค้นหา</td></tr>
            ) : (
              mergedTableData.map((group, index) => {
                const effectiveDue = group.calculatedDueDate ? group.calculatedDueDate : calculateDueDate(group.startDate, 90);
                const hasCompleted = group.items.some(i => i.status === 'โอนเงินเข้าบัญชีเกษตรกรแล้ว' || i.status === 'เสร็จสิ้น' || i.status === 'งบ อปท.');
                const remainingText = calculateRemainingDays(effectiveDue, hasCompleted ? 'โอนเงินเข้าบัญชีเกษตรกรแล้ว' : '');
                
                let textColor = '#0275d8';
                if (remainingText.includes('เสร็จสิ้น')) {
                  textColor = '#2e7d32';
                } else if (remainingText.includes('เกิน')) {
                  textColor = '#d9534f';
                } else {
                  const matchNum = remainingText.match(/\d+/);
                  if (matchNum && parseInt(matchNum[0], 10) < 25) {
                    textColor = '#fd7e14';
                  }
                }

                return (
                  <tr key={index} style={{ backgroundColor: hasCompleted ? '#e8f5e9' : 'transparent' }}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ fontWeight: 'bold' }}>{group.disasterType}</td>
                    <td>{formatDateThai(group.startDate)}</td>
                    <td style={{ fontWeight: 'bold' }}>{formatDateThai(effectiveDue)}</td>
                    <td style={{ color: textColor, fontWeight: 'bold' }}>{remainingText}</td>
                    <td style={{ textAlign: 'center' }}>{group.totalHouseholds.toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>{group.totalDamagedArea.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
                    <td style={{ textAlign: 'right' }}>{group.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onMouseEnter={(e) => {
                          setMousePosition({ x: e.clientX, y: e.clientY });
                          setHoveredDetailTooltip({ items: group.items });
                        }}
                        onMouseMove={(e) => {
                          setMousePosition({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => {
                          setHoveredDetailTooltip(null);
                        }}
                        onClick={() => setDetailModalData(group)} 
                        style={{ padding: '5px 10px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                      >
                        แสดงรายละเอียด ({group.items.length})
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </>

    </div>
  );
}