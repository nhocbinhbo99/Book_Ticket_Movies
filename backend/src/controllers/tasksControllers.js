import Task from "../models/Task.js";


export const getAllTasks = (request,response)=>{
    response.status(200).send("ban co 20 vc can lam");
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