import mongoose from 'mongoose';

export const connectDB = async( ) =>{
     try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("lien ket thanh cong");

     } catch (error) {
        console.log("loi ket noi scdl:",error);
        process.exit(1);
     }
}