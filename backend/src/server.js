import express, { request, response } from 'express';
import taskRoute from './routes/tasksRouters.js';
import { connectDB } from './config/db.js';

const app = express();

app.use("/api/tasks",taskRoute)

connectDB();

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
