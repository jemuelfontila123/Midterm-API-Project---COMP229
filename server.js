/**
 * Midterm API Project - COMP229
 * Implement the six equipment API endpoints described in README.md.
 * Use the array index as the ID: index 0 is the first equipment item.
 * Add exactly two personalized items to the five supplied below.
 */
import express from 'express';

const app = express();
app.use(express.json());

let equipment = [
  { name: 'USB Microphone', category: 'audio', brand: 'AudioLab', year: 2021, quantity: 5 },
  { name: 'LED Panel', category: 'lighting', brand: 'BrightWorks', year: 2022, quantity: 4 },
  { name: 'Network Switch', category: 'networking', brand: 'NetCore', year: 2020, quantity: 3 },
  { name: 'Cable Tester', category: 'tools', brand: 'TestPro', year: 2019, quantity: 6 },
  { name: 'Studio Headphones', category: 'audio', brand: 'SoundCraft', year: 2023, quantity: 8 },
  // { name: 'iPhone 18 Pro Max', category: 'mobile', brand: 'Apple', year: 2026, quantity: 1000 },
  // { name: 'Samsung Galaxy S26', category: 'mobile', brand: 'Samsung', year: 2026, quantity: 4 }
];

app.get('/api/equipment', (req, res) => {
  if(equipment.length == 0 )
      res.status(200).json({message: "No Equipment added yet"});
  else 
    res.status(200).json(equipment)
});

// Keep the filter route before /:id.
app.get('/api/equipment/filter', (req, res) => {
  // TODO: Return equipment matching the category query.
  const { category } = req.query;
  if(category == null) {
    return res.status(400).json({error: "Category not entered"});
  }
  const wanted = category.trim().toLowerCase();

  // Build the list of categories that currently exist
  const categories = new Set(equipment.map(item => item.category.toLowerCase()));

  if (!categories.has(wanted)) {
    return res.status(404).json({
      error: `Category "${category}" does not exist`,
      availableCategories: [...categories]
    });
  }

  const results = equipment.filter(item => item.category.toLowerCase() === wanted);
  res.status(200).json(results);
});

app.get('/api/equipment/:id', (req, res) => {
  // TODO: Return the equipment at this array index.
  const {id} = req.params;
  if (!Number.isInteger(Number(id)) || id === null) {
    return res.status(400).json({ error: 'Equipment ID does not exist' });
  } else if (id < 0 || id >= equipment.length) {
    return res.status(404).json({ error: 'Equipment not found' });
  }
  res.status(200).json(equipment[id]);
});

app.post('/api/equipment', (req, res) => {
 const required = ['name', 'category', 'brand', 'year', 'quantity'];
  for (const field of required) {
    if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  equipment.push(req.body);
  res.status(200).json(equipment[equipment.length-1]);
});

app.put('/api/equipment/:id', (req, res) => {
  const {id} = req.params;

  if (!Number.isInteger(Number(id)) || id === null) {
    return res.status(400).json({ error: 'Equipment ID does not exist' });
  } else if (id < 0 || id >= equipment.length) {
    return res.status(404).json({ error: 'Equipment not found' });
  } else if(req.body == null || req.body == undefined){
    res.status(404).json({error: "You must update at least one field"});
  }
  const allowed = ['name', 'category', 'brand', 'year', 'quantity'];
  const keys = Object.keys(req.body);
  for (const key of keys) {
    if (!allowed.includes(key)) {
        return res.status(400).json({
            message: `Invalid field: ${key}`
        });
    }
  }
  equipment[id] = { ...equipment[id], ...req.body };

  res.status(200).json(equipment[id]);
});

app.delete('/api/equipment/:id', (req, res) => {
  const {id} = req.params;

  if (!Number.isInteger(Number(id)) || id === null) {
    return res.status(400).json({ error: 'Equipment ID does not exist' });
  } else if (id < 0 || id >= equipment.length) {
    return res.status(404).json({ error: 'Equipment not found' });
  }
  const [removed] = equipment.splice(id, 1);
 
  res.status(200).json(removed);

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', err => {
  if (err) {
    console.error(`Cannot start on port ${PORT}: ${err.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
