const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://darpan9460:ETNgBc30N1PYzGXa@cluster0.gv2bjsl.mongodb.net/gaurav"
);

// Create Blog Schema
const blogSchema = new mongoose.Schema({
  end_year: String,
  intensity: Number,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: String,
  impact: String,
  added: String,
  published: String,
  country: String,
  relevance: Number,
  pestle: String,
  source: String,
  title: String,
  likelihood: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

app.use(bodyParser.json());

// Get blogs endpoint
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Endpoint to get analytics
app.get("/api/analytics", async (req, res) => {
  try {
    const blogs = await Blog.find();
    const analytics = {
        intensity: groupByLabel(blogs, 'intensity'),
        likelihood: groupByLabel(blogs, 'likelihood'),
        relevance: groupByLabel(blogs, 'relevance'),
        year: groupByLabel(blogs, 'start_year'),
        country: groupByLabel(blogs, 'country'),
        topics: groupByLabel(blogs, 'topic'),
        region: groupByLabel(blogs, 'region'),
        city: groupByLabel(blogs, 'city'), // Assuming you have a 'city' property in your data
    };

    res.status(200).json(analytics);
  } catch (error) {}
});

// Function to group data by label and count occurrences
function groupByLabel(data, label) {
  const groupedData = {};
  data.forEach((item) => {
    const value = item[label];
    if (value !== undefined && value !== "") {
      if (!groupedData[value]) {
        groupedData[value] = 1;
      } else {
        groupedData[value]++;
      }
    }
  });

  return Object.entries(groupedData).map(([label, count]) => ({
    label,
    count,
  }));
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
