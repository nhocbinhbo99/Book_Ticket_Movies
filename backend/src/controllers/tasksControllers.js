import Task from "../models/Task.js";


export const getAllTasks = (request,response)=>{
  const msg = "Kết nối thành công";
  console.log("GET /api/tasks - " + msg);
  response.status(200).json({ message: msg });
}

export const createTask = (req, res)=>{
  res.status(201).json({
    message:"nhiem vu moi da dc them vao thanh cong"
  });
}

export const updateTask= (req, res)=>{
  res.status(201).json({
    message:"nhiem vu moi da dc update vao thanh cong"
  });
}

export const deleteTask = (req, res)=>{
  res.status(201).json({
    message:"nhiem vu moi da dc xoa vao thanh cong"
  });
}