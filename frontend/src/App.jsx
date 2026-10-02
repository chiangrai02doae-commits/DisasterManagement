import React, { useState, useEffect } from 'react';

export default function App() {
  const [disasters, setDisasters] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allSubdistricts, setAllSubdistricts] = useState([]);
  
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubdistricts, setFilteredSubdistricts] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);

  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const [groupBy, setGroupBy] = useState('disasterType');
  const [selectedGroupKey, setSelectedGroupKey] = useState('');
  const [selectedProv, setSelectedProv] = useState('');
  const [selectedDist, setSelectedDist] = useState('');

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
    status: 'รอดำเนินการ'
  });

  useEffect(() => {
    fetchThailandData();
    loadExcelData();
  }, []);

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

  const loadExcelData = () => {
    try {
      const excelRows = [
        { id: 1, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'เวียง', startDate: '2026-05-03', households: 29, damagedArea: '156', budgetAmount: '310948', budgetType: 'เงินทดรอง ผวจ.', status: 'โอนเงินแล้ว' },
        { id: 2, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'ศรีดอนมูล', startDate: '2026-05-03', households: 14, damagedArea: '89', budgetAmount: '148700', budgetType: 'เงินทดรอง ผวจ.', status: 'โอนเงินแล้ว' },
        { id: 3, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'โยนก', startDate: '2026-05-14', households: 5, damagedArea: '52.5', budgetAmount: '70350', budgetType: 'เงินทดรอง ผวจ.', status: 'โอนเงินแล้ว' },
        { id: 4, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'แม่เปา', startDate: '2026-07-13', households: 32, damagedArea: '169.98', budgetAmount: '254840.57', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 5, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'ดอยงาม', startDate: '2026-07-28', households: 34, damagedArea: '168.75', budgetAmount: '226125', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 6, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'หัวง้ม', startDate: '2026-07-28', households: 131, damagedArea: '874.5', budgetAmount: '1171830', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 7, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'ม่วงคำ', startDate: '2026-07-28', households: 35, damagedArea: '347.75', budgetAmount: '465985', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 8, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'ทานตะวัน', startDate: '2026-07-28', households: 93, damagedArea: '933', budgetAmount: '1250220', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 9, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'เวียงห้าว', startDate: '2026-07-28', households: 19, damagedArea: '82.25', budgetAmount: '110215', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 10, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พาน', subdistrict: 'สันมะเค็ด', startDate: '2026-07-28', households: 19, damagedArea: '104.75', budgetAmount: '140845', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 11, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'เวียง', startDate: '2026-07-30', households: 87, damagedArea: '597', budgetAmount: '1152940', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 12, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'ป่าสัก', startDate: '2026-07-30', households: 15, damagedArea: '69.25', budgetAmount: '96635', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 13, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'ศรีดอนมูล', startDate: '2026-07-30', households: 96, damagedArea: '1026.5', budgetAmount: '1383190', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 14, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'โยนก', startDate: '2026-07-30', households: 61, damagedArea: '412.25', budgetAmount: '694963', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 15, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เมืองเชียงราย', subdistrict: 'ท่าสาย', startDate: '2026-07-31', households: 10, damagedArea: '80.25', budgetAmount: '107535', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 16, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'จันจว้า', startDate: '2026-08-01', households: 31, damagedArea: '244.25', budgetAmount: '327295', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 17, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'แม่คำ', startDate: '2026-08-01', households: 31, damagedArea: '199.75', budgetAmount: '269745', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 18, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'ท่าข้าวเปลือก', startDate: '2026-08-01', households: 195, damagedArea: '1548.25', budgetAmount: '2074655', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 19, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'จันจว้าใต้', startDate: '2026-08-01', households: 10, damagedArea: '44.25', budgetAmount: '59295', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 20, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่จัน', subdistrict: 'จอมสวรรค์', startDate: '2026-08-01', households: 7, damagedArea: '20.5', budgetAmount: '27470', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 21, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่สาย', subdistrict: 'โป่งผา', startDate: '2026-08-01', households: 35, damagedArea: '303', budgetAmount: '406020', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 22, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่สาย', subdistrict: 'บ้านด้าย', startDate: '2026-08-01', households: 118, damagedArea: '728', budgetAmount: '2001625', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 23, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'แม่สาย', subdistrict: 'โป่งงาม', startDate: '2026-08-01', households: 18, damagedArea: '180', budgetAmount: '241200', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 24, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงแสน', subdistrict: 'บ้านแซว', startDate: '2026-08-08', households: 25, damagedArea: '178', budgetAmount: '352440', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 25, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เวียงชัย', subdistrict: 'เมืองชุม', startDate: '2026-08-08', households: 19, damagedArea: '67', budgetAmount: '89780', budgetType: 'เงินทดรอง สปกษ.', status: 'รออนุมัติ' },
        { id: 26, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'แม่ต๋ำ', startDate: '2026-08-10', households: 8, damagedArea: '89.5', budgetAmount: '119930', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 27, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'ไม้ยา', startDate: '2026-08-10', households: 20, damagedArea: '144.5', budgetAmount: '193630', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 28, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'พญาเม็งราย', subdistrict: 'เม็งราย', startDate: '2026-08-10', households: 198, damagedArea: '3138.25', budgetAmount: '5905010', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 29, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'สถาน', startDate: '2026-08-08', households: 16, damagedArea: '65.55', budgetAmount: '129798', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 30, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'ครึ่ง', startDate: '2026-08-08', households: 30, damagedArea: '188.99', budgetAmount: '346995', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 31, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'บุญเรือง', startDate: '2026-08-08', households: 58, damagedArea: '392.06', budgetAmount: '559676', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 32, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'เวียง', startDate: '2026-08-08', households: 3, damagedArea: '25', budgetAmount: '49500', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 33, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'ห้วยซ้อ', startDate: '2026-08-08', households: 198, damagedArea: '1362.75', budgetAmount: '2295747', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 34, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เชียงของ', subdistrict: 'ศรีดอนชัย', startDate: '2026-08-08', households: 210, damagedArea: '572.21', budgetAmount: '1401924', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 35, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'ปงน้อย', startDate: '2026-08-07', households: 1, damagedArea: '1', budgetAmount: '1980', budgetType: 'งบ อปท.', status: 'รอดำเนินการ' },
        { id: 36, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'หนองป่าก่อ', startDate: '2026-08-07', households: 8, damagedArea: '60', budgetAmount: '118800', budgetType: 'งบ อปท.', status: 'รอดำเนินการ' },
        { id: 37, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'ปงน้อย', startDate: '2026-08-04', households: 13, damagedArea: '45', budgetAmount: '60300', budgetType: 'งบ อปท.', status: 'รอดำเนินการ' },
        { id: 38, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'โชคชัย', startDate: '2026-08-04', households: 24, damagedArea: '48.5', budgetAmount: '112380', budgetType: 'งบ อปท.', status: 'รอดำเนินการ' },
        { id: 39, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'ดอยหลวง', subdistrict: 'หนองป่าก่อ', startDate: '2026-08-04', households: 6, damagedArea: '7.25', budgetAmount: '22504', budgetType: 'งบ อปท.', status: 'รอดำเนินการ' },
        { id: 40, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'เวียง', startDate: '2026-08-10', households: 112, damagedArea: '797.97', budgetAmount: '1305612', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 41, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'ปล้อง', startDate: '2026-08-10', households: 77, damagedArea: '982.82', budgetAmount: '1318535', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 42, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'สันทรายงาม', startDate: '2026-08-10', households: 18, damagedArea: '247.84', budgetAmount: '481443', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 43, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'งิ้ว', startDate: '2026-08-10', households: 92, damagedArea: '1168.84', budgetAmount: '1568158', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' },
        { id: 44, disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: 'เทิง', subdistrict: 'ศรีดอนไชย', startDate: '2026-08-10', households: 4, damagedArea: '51.5', budgetAmount: '69010', budgetType: 'งบท้องถิ่น', status: 'รอดำเนินการ' }
      ];

      const savedData = localStorage.getItem('disasters');
      if (!savedData || JSON.parse(savedData).length === 0) {
        const processed = excelRows.map(item => {
          const start = new Date(item.startDate);
          const due = new Date(start);
          due.setDate(due.getDate() + 30);
          return {
            ...item,
            _id: item.id.toString(),
            calculatedDueDate: isNaN(due) ? '' : due.toISOString().split('T')[0]
          };
        });
        localStorage.setItem('disasters', JSON.stringify(processed));
        setDisasters(processed);
      } else {
        setDisasters(JSON.parse(savedData));
      }
    } catch (err) {
      console.error('Error loading Excel data:', err);
    }
  };

  const handleResetData = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นจากไฟล์ใช่หรือไม่?')) {
      localStorage.removeItem('disasters');
      loadExcelData();
      alert('รีเซ็ตข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setFormData(prev => ({ ...prev, province: provinceName, district: '', subdistrict: '' }));
    setFilteredSubdistricts([]);

    const selectedProv = provinces.find(p => p.name.th === provinceName);
    if (selectedProv) {
      setFilteredDistricts(allDistricts.filter(d => d.province_id === selectedProv.id));
    } else {
      setFilteredDistricts([]);
    }
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData(prev => ({ ...prev, district: districtName, subdistrict: '' }));

    const selectedDist = filteredDistricts.find(d => d.name.th === districtName);
    if (selectedDist) {
      setFilteredSubdistricts(allSubdistricts.filter(s => s.district_id === selectedDist.id));
    } else {
      setFilteredSubdistricts([]);
    }
  };

  const formatDateThai = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const calculateRemainingDays = (dueDateString) => {
    if (!dueDateString) return '-';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDateString);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `เกินกำหนด ${Math.abs(diffDays)} วัน`;
    } else if (diffDays === 0) {
      return 'ครบกำหนดวันนี้';
    } else {
      return `เหลือเวลา ${diffDays} วัน`;
    }
  };

  const calculateDueDate = (startDateStr) => {
    if (!startDateStr) return '';
    const start = new Date(startDateStr);
    const due = new Date(start);
    due.setDate(due.getDate() + 30);
    return isNaN(due) ? '' : due.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isNumeric = (val) => /^\d+(\.\d+)?$/.test(val);

    if (formData.households && !isNumeric(formData.households)) {
      alert('กรุณากรอก "จำนวนครัวเรือน" เป็นตัวเลขเท่านั้น');
      return;
    }
    if (formData.damagedArea && !isNumeric(formData.damagedArea)) {
      alert('กรุณากรอก "พื้นที่เสียหาย" เป็นตัวเลขเท่านั้น');
      return;
    }
    if (formData.budgetAmount && !isNumeric(formData.budgetAmount)) {
      alert('กรุณากรอก "งบประมาณ" เป็นตัวเลขเท่านั้น');
      return;
    }

    const confirmSave = window.confirm('คุณต้องการบันทึกข้อมูลนี้หรือไม่?');
    if (!confirmSave) return;

    try {
      const dueDate = calculateDueDate(formData.startDate);
      
      const newDisaster = { 
        _id: Date.now().toString(), 
        ...formData,
        calculatedDueDate: dueDate
      };

      const updatedList = [newDisaster, ...disasters];
      
      localStorage.setItem('disasters', JSON.stringify(updatedList));
      setDisasters(updatedList);

      alert('บันทึกข้อมูลสำเร็จ!');
      
      setFormData({
        disasterType: 'อุทกภัยด้านพืช', province: 'เชียงราย', district: '', subdistrict: '',
        startDate: '', households: '', damagedArea: '',
        budgetAmount: '', budgetType: '', status: 'รอดำเนินการ'
      });
      setFilteredDistricts([]);
      setFilteredSubdistricts([]);
      setIsOpenModal(false);

    } catch (err) {
      console.error('Error submitting form:', err);
      alert('บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const groupKeys = [...new Set(disasters.map(item => item[groupBy]))].filter(Boolean);

  const filteredSummaryData = disasters.filter(item => {
    if (selectedGroupKey && item[groupBy] !== selectedGroupKey) return false;
    if (selectedProv && item.province !== selectedProv) return false;
    if (selectedDist && item.district !== selectedDist) return false;
    return true;
  });

  const groupedDataMap = {};
  filteredSummaryData.forEach(item => {
    const key = `${item.disasterType}_${item.startDate}`;
    if (!groupedDataMap[key]) {
      groupedDataMap[key] = {
        disasterType: item.disasterType,
        startDate: item.startDate,
        calculatedDueDate: item.calculatedDueDate || calculateDueDate(item.startDate),
        totalHouseholds: 0,
        totalDamagedArea: 0,
        totalBudget: 0,
        items: []
      };
    }
    groupedDataMap[key].totalHouseholds += (Number(item.households) || 0);
    groupedDataMap[key].totalDamagedArea += (Number(item.damagedArea) || 0);
    groupedDataMap[key].totalBudget += (Number(String(item.budgetAmount || 0).replace(/,/g, '')) || 0);
    groupedDataMap[key].items.push(item);
  });

  const mergedTableData = Object.values(groupedDataMap);

  const totalUniqueDates = new Set(filteredSummaryData.map(i => i.startDate)).size;
  const totalHouseholds = filteredSummaryData.reduce((sum, item) => sum + (Number(item.households) || 0), 0);
  const totalDamagedArea = filteredSummaryData.reduce((sum, item) => sum + (Number(item.damagedArea) || 0), 0);
  const totalBudget = filteredSummaryData.reduce((sum, item) => sum + (Number(String(item.budgetAmount || 0).replace(/,/g, '')) || 0), 0);

  // ครบถ้วน 18 อำเภอของจังหวัดเชียงราย
  const chiangRaiDistricts = [
    'แม่สาย', 'แม่ฟ้าหลวง', 'เชียงแสน', 'แม่จัน', 'เชียงของ', 
    'เวียงแก่น', 'พญาเม็งราย', 'ดอยหลวง', 'เมืองเชียงราย', 'เวียงเชียงรุ้ง', 
    'พาน', 'แม่ลาว', 'เวียงชัย', 'ขุนตาล', 'ป่าแดด', 
    'แม่สรวย', 'เวียงป่าเป้า', 'เทิง'
  ];

  const districtSummaryMap = {};
  chiangRaiDistricts.forEach(dist => {
    const itemsInDist = disasters.filter(i => i.district === dist);
    districtSummaryMap[dist] = {
      households: itemsInDist.reduce((s, i) => s + (Number(i.households) || 0), 0),
      damagedArea: itemsInDist.reduce((s, i) => s + (Number(i.damagedArea) || 0), 0),
      budget: itemsInDist.reduce((s, i) => s + (Number(String(i.budgetAmount || 0).replace(/,/g, '')) || 0), 0),
      count: itemsInDist.length
    };
  });

  const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px', color: '#333' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>ระบบติดตามภัยพิบัติด้านพืช (จังหวัดเชียงราย)</h2>
          <button onClick={handleResetData} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            🔄 รีเซ็ตข้อมูลใหม่
          </button>
        </div>
        <button 
          onClick={() => setIsOpenModal(true)} 
          style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
        >
          + เพิ่มข้อมูลภัยพิบัติใหม่
        </button>
      </div>

      {/* --- Label แสดงข้อมูลสรุปอยู่บนตาราง --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#e3f2fd', border: '1px solid #90caf9', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#1565c0', fontWeight: 'bold' }}>จำนวนวันเกิดภัย</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0d47a1', marginTop: '4px' }}>{totalUniqueDates} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>วัน</span></div>
        </div>
        <div style={{ background: '#fff9c4', border: '1px solid #fff176', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#f57f17', fontWeight: 'bold' }}>ครัวเรือนที่ได้รับผลกระทบ</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f57f17', marginTop: '4px' }}>{totalHouseholds.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>ครัวเรือน</span></div>
        </div>
        <div style={{ background: '#ffebee', border: '1px solid #ef9a9a', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#c62828', fontWeight: 'bold' }}>พื้นที่เสียหายรวม</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#b71c1c', marginTop: '4px' }}>{totalDamagedArea.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>ไร่</span></div>
        </div>
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>งบประมาณรวม</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20', marginTop: '4px' }}>{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>บาท</span></div>
        </div>
      </div>

      {/* --- แผนที่ 18 อำเภอจังหวัดเชียงราย แบบ Interactive Grid --- */}
      <div style={{ background: '#ffffff', border: '1px solid #dcdcdc', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#2c3e50' }}>🗺️ แผนที่แสดงความเสียหายรายอำเภอ (จังหวัดเชียงราย - ครบถ้วน 18 อำเภอ)</h3>
          <span style={{ fontSize: '12px', background: '#e0f7fa', color: '#006064', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>เลื่อนเมาส์วางเพื่อดูข้อมูล</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
          {chiangRaiDistricts.map((dist) => {
            const data = districtSummaryMap[dist];
            const hasDamage = data.count > 0;
            return (
              <div 
                key={dist}
                onMouseEnter={() => setHoveredDistrict({ name: dist, ...data })}
                onMouseLeave={() => setHoveredDistrict(null)}
                style={{
                  padding: '12px 6px',
                  background: hasDamage ? '#ffebee' : '#f9f9f9',
                  border: `1.5px solid ${hasDamage ? '#ef9a9a' : '#dcdcdc'}`,
                  borderRadius: '6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: hoveredDistrict?.name === dist ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  transform: hoveredDistrict?.name === dist ? 'scale(1.05)' : 'none'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '12px', color: hasDamage ? '#c62828' : '#333' }}>อ. {dist}</div>
                <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>{data.households.toLocaleString()} ครัวเรือน</div>
                <div style={{ fontSize: '10px', color: '#555' }}>{data.damagedArea.toLocaleString()} ไร่</div>
              </div>
            );
          })}
        </div>

        {/* กล่อง Popup แสดงผลเมื่อ Hover */}
        {hoveredDistrict && (
          <div style={{ marginTop: '15px', padding: '12px 15px', background: '#263238', color: '#fff', borderRadius: '6px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <div>
              📍 <b>อำเภอ{hoveredDistrict.name}:</b> เกิดภัยพิบัติ {hoveredDistrict.count} เหตุการณ์ | ครัวเรือนรวม: <b>{hoveredDistrict.households.toLocaleString()}</b> ครัวเรือน | พื้นที่เสียหาย: <b>{hoveredDistrict.damagedArea.toLocaleString()}</b> ไร่
            </div>
          </div>
        )}
      </div>

      {detailModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>รายละเอียดภัยพิบัติ: {detailModalData.disasterType} (วันที่ {formatDateThai(detailModalData.startDate)})</h3>
              <button 
                onClick={() => setDetailModalData(null)} 
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold', color: '#888' }}
              >
                &times;
              </button>
            </div>

            <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f1f1f1' }}>
                  <th>พื้นที่ (จังหวัด / อำเภอ / ตำบล)</th>
                  <th>ครัวเรือน</th>
                  <th>พื้นที่เสียหาย</th>
                  <th>งบประมาณ</th>
                  <th>ประเภทงบ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {detailModalData.items.map((subItem, idx) => (
                  <tr key={idx}>
                    <td>{subItem.province} / {subItem.district} / {subItem.subdistrict}</td>
                    <td style={{ textAlign: 'center' }}>{subItem.households || 0}</td>
                    <td style={{ textAlign: 'center' }}>{subItem.damagedArea || 0} ไร่</td>
                    <td style={{ textAlign: 'right' }}>{Number(String(subItem.budgetAmount || 0).replace(/,/g, '')).toLocaleString()} บาท</td>
                    <td>{subItem.budgetType || '-'}</td>
                    <td style={{ textAlign: 'center' }}>{subItem.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button onClick={() => setDetailModalData(null)} style={{ padding: '8px 15px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                ปิด
              </button>
            </div>

          </div>
        </div>
      )}

      {isOpenModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>บันทึกข้อมูลภัยพิบัติ</h3>
              <button 
                onClick={() => setIsOpenModal(false)} 
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold', color: '#888' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={labelStyle}>ประเภทภัยพิบัติ:</label>
                <input 
                  type="text" 
                  value={formData.disasterType} 
                  onChange={e => setFormData({ ...formData, disasterType: e.target.value })} 
                  required 
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>จังหวัด:</label>
                  <select value={formData.province} onChange={handleProvinceChange} required style={inputStyle}>
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces.map(p => (
                      <option key={p.id} value={p.name.th}>{p.name.th}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>อำเภอ/เขต:</label>
                  <select value={formData.district} onChange={handleDistrictChange} required disabled={!formData.province} style={inputStyle}>
                    <option value="">-- เลือกอำเภอ/เขต --</option>
                    {filteredDistricts.map(d => (
                      <option key={d.id} value={d.name.th}>{d.name.th}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>ตำบล/แขวง:</label>
                  <select value={formData.subdistrict} onChange={e => setFormData({ ...formData, subdistrict: e.target.value })} required disabled={!formData.district} style={inputStyle}>
                    <option value="">-- เลือกตำบล/แขวง --</option>
                    {filteredSubdistricts.map(s => (
                      <option key={s.id} value={s.name.th}>{s.name.th}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>วันที่เกิดภัยพิบัติ:</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>จำนวนครัวเรือนที่ได้รับผลกระทบ (ตัวเลข):</label>
                  <input type="text" placeholder="เช่น 150" value={formData.households} onChange={e => setFormData({ ...formData, households: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>พื้นที่เสียหาย (ไร่):</label>
                  <input type="text" placeholder="เช่น 500" value={formData.damagedArea} onChange={e => setFormData({ ...formData, damagedArea: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>งบประมาณช่วยเหลือ (บาท):</label>
                  <input type="text" placeholder="เช่น 50000" value={formData.budgetAmount} onChange={e => setFormData({ ...formData, budgetAmount: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>ประเภทงบประมาณ:</label>
                  <input type="text" placeholder="เช่น เงินทดรอง ผวจ." value={formData.budgetType} onChange={e => setFormData({ ...formData, budgetType: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsOpenModal(false)} style={{ padding: '10px 15px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ยกเลิก
                </button>
                <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  บันทึกข้อมูล
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <h3>รายการข้อมูลภัยพิบัติในระบบ ({mergedTableData.length} กลุ่ม)</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: '14px', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ width: '60px', textAlign: 'center' }}>ลำดับ</th>
            <th>ประเภทภัย</th>
            <th>วันที่เกิดภัย</th>
            <th>เหลือเวลาถึงกำหนด</th>
            <th>ครบระยะเวลา</th>
            <th>ครัวเรือนรวม</th>
            <th>พื้นที่เสียหายรวม</th>
            <th>งบประมาณรวม</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {mergedTableData.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', color: '#777' }}>ไม่พบข้อมูลตามเงื่อนไขที่เลือก</td>
            </tr>
          ) : (
            mergedTableData.map((group, index) => {
              const remainingText = calculateRemainingDays(group.calculatedDueDate);

              return (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ fontWeight: 'bold' }}>{group.disasterType}</td>
                  <td>{formatDateThai(group.startDate)}</td>
                  <td style={{ color: remainingText.includes('เกิน') ? '#d9534f' : '#0275d8', fontWeight: 'bold' }}>
                    {remainingText}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{formatDateThai(group.calculatedDueDate)}</td>
                  <td>{group.totalHouseholds.toLocaleString()} ครัวเรือน</td>
                  <td>{group.totalDamagedArea.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ไร่</td>
                  <td>{group.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
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

      {/* --- ส่วนสรุปข้อมูลแยกตามประเภทภัยด้านล่าง --- */}
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>📊 สรุปข้อมูลแยกตามประเภทภัย / วันที่เกิดภัย และระดับพื้นที่</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>จัดกลุ่มตาม:</label>
            <select 
              value={groupBy} 
              onChange={e => { setGroupBy(e.target.value); setSelectedGroupKey(''); setSelectedProv(''); setSelectedDist(''); }} 
              style={inputStyle}
            >
              <option value="disasterType">ประเภทภัยพิบัติ</option>
              <option value="startDate">วันที่เกิดภัยพิบัติ</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>เลือกรายการ:</label>
            <select 
              value={selectedGroupKey} 
              onChange={e => { setSelectedGroupKey(e.target.value); setSelectedProv(''); setSelectedDist(''); }} 
              style={inputStyle}
            >
              <option value="">-- ทั้งหมด --</option>
              {groupKeys.map(key => (
                <option key={key} value={key}>
                  {groupBy === 'startDate' ? formatDateThai(key) : key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>ระดับจังหวัด:</label>
            <select 
              value={selectedProv} 
              onChange={e => { setSelectedProv(e.target.value); setSelectedDist(''); }} 
              style={inputStyle}
            >
              <option value="">-- ทุกจังหวัด --</option>
              {[...new Set(disasters.map(i => i.province))].map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>ระดับอำเภอ:</label>
            <select 
              value={selectedDist} 
              onChange={e => setSelectedDist(e.target.value)} 
              style={inputStyle}
              disabled={!selectedProv}
            >
              <option value="">-- ทุกอำเภอ --</option>
              {[...new Set(disasters.filter(i => !selectedProv || i.province === selectedProv).map(i => i.district))].map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}