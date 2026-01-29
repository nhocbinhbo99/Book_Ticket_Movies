import mongoose from 'mongoose';

export const connectDB = async( ) =>{
     try {
        await mongoose.connect(
          "mongodb+srv://tqatulen3102005_db_user:Tqa3102005@cluster0.gq27zli.mongodb.net/?appName=Cluster0"  
        );
        console.log("kien ket thanh cong");

     } catch (error) {
        console.log("loi ket noi scdl:",error);
        process.exit(1);
     }
}