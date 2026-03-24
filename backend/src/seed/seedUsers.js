import { User } from "../models/User.js";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export async function seedUsers() {
  await connectDB();

  try {
  // Clear existing data
  await User.deleteMany({});

    // Seed users
    const users = [
      {
        email: "tqa@gmail.com",
        password: "123",
        fullName: "Trần Quốc Anh",
        role: "user",
      },
      {
        email: "user@example.com",
        password: "123",
        fullName: "John Doe",
        role: "user",
      },
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded successfully");

    console.log("\n📝 Test Credentials:");
    console.log("------- USER -------");
    console.log("Email: tqa@gmail.com");
    console.log("Password: 123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

seedUsers();
