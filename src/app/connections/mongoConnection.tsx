import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectMongoDB;