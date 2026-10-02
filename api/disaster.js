let mockDisasters = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(mockDisasters);
  } else if (req.method === 'POST') {
    const newDisaster = { _id: Date.now().toString(), ...req.body };
    mockDisasters.push(newDisaster);
    return res.status(201).json(newDisaster);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}