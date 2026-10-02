const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// Schema ข้อมูลผู้ประสบภัย
const disasterSchema = new mongoose.Schema({
  disaster_type: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  subdistrict: { type: String, required: true },
  incident_date: { type: Date, required: true },
  due_date: Date,                  // คำนวณจาก incident_date + 30 วัน
  extension_request_date: Date,    // คำนวณจาก due_date - 25 วัน
  extensions: [{
    request_date: Date,
    new_due_date: Date,
    reason: String
  }],
  households_affected: Number,
  damaged_area_rai: Number,
  budget_amount: Number,
  budget_type: String,
  status: { type: String, default: 'กำลังดำเนินการ' },
  created_by: String
}, { timestamps: true });

// Middleware คำนวณวันอัตโนมัติก่อนบันทึก
disasterSchema.pre('save', function(next) {
  if (this.incident_date) {
    let incident = new Date(this.incident_date);
    let due = new Date(incident);
    due.setDate(incident.getDate() + 30);
    this.due_date = due;

    let extReq = new Date(due);
    extReq.setDate(due.getDate() - 25);
    this.extension_request_date = extReq;
  }
  next();
});

const Disaster = mongoose.model('Disaster', disasterSchema);

// API: ดึงข้อมูล / ค้นหา
app.get('/api/disasters', async (req, res) => {
  try {
    const { search, province, status } = req.query;
    let query = {};
    if (province) query.province = province;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { disaster_type: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { subdistrict: { $regex: search, $options: 'i' } }
      ];
    }
    const data = await Disaster.find(query).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: เพิ่มข้อมูลใหม่
app.post('/api/disasters', async (req, res) => {
  try {
    const newDisaster = new Disaster(req.body);
    await newDisaster.save();
    res.status(201).json(newDisaster);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));