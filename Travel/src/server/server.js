import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 8081;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

let projectData = {};

app.get('/get', (req, res) => {
  res.status(200).json(projectData);
});

app.post('/add', (req, res) => {
  projectData = req.body;
  res.status(200).json({ message: 'Data added successfully', data: projectData });
});

export { app, server };
