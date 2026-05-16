const mongoose = require('mongoose');
const dotenv = require('dotenv');
const JobRequest = require('../models/JobRequest');

dotenv.config();

const sampleJobs = [
  {
    title: 'Leaking kitchen tap',
    description: 'The kitchen tap is leaking from the base and needs repair or replacement.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'John Doe',
    contactEmail: 'john@example.com',
    status: 'Open',
    postedBy: 'Anonymous',
    anonId: 'ANON-12345'
  },
  {
    title: 'Faulty light switch',
    description: 'The living room light switch is sparking when turned on.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'Jane Smith',
    contactEmail: 'jane@example.com',
    status: 'Open',
    postedBy: 'Anonymous',
    anonId: 'ANON-67890'
  },
  {
    title: 'Paint bedroom walls',
    description: 'Looking for someone to paint a small bedroom in white emulsion.',
    category: 'Painting',
    location: 'Glasgow',
    contactName: 'Robert Brown',
    contactEmail: 'robert@example.com',
    status: 'In Progress',
    postedBy: 'Anonymous',
    anonId: 'ANON-11223'
  },
  {
    title: 'Fix broken fence',
    description: 'One panel of the garden fence has blown down in the wind.',
    category: 'Joinery',
    location: 'Paisley',
    contactName: 'Alice Green',
    contactEmail: 'alice@example.com',
    status: 'Open',
    postedBy: 'Anonymous',
    anonId: 'ANON-44556'
  },
  {
    title: 'Replace boiler',
    description: 'Old boiler needs replacing with a new combi boiler.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Charlie White',
    contactEmail: 'charlie@example.com',
    status: 'Closed',
    postedBy: 'Anonymous',
    anonId: 'ANON-77889'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await JobRequest.deleteMany({});
    console.log('Cleared existing job requests');

    await JobRequest.insertMany(sampleJobs);
    console.log('Seeded database with sample jobs');

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
