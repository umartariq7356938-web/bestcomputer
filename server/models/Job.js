const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  organization: { type: String, required: true },
  province: { type: String, default: 'Federal' },
  city: { type: String, default: 'Any' },
  vacancies: { type: Number, default: 1 },
  education: { type: String, required: true },
  experience: { type: String, default: 'Fresh' },
  ageLimit: { type: String },
  sourceUrl: { type: String, required: true },
  lastDate: { type: Date, required: true },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT', 'EXPIRED'], default: 'PUBLISHED' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
