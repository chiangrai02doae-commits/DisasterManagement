import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const client = await connectToDatabase();
    const db = client.db('disaster_db'); // เปลี่ยนชื่อฐานข้อมูลตามที่คุณใช้งาน
    const collection = db.collection('disasters');

    if (req.method === 'GET') {
      const disasters = await collection.find({}).sort({ _id: -1 }).toArray();
      return res.status(200).json(disasters);
    } 
    
    if (req.method === 'POST') {
      const newRecord = req.body;
      const result = await collection.insertOne(newRecord);
      return res.status(201).json({ message: 'Inserted successfully', id: result.insertedId });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}