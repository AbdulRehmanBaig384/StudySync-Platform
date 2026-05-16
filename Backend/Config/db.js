import mongoose from "mongoose";

export const ConnectMongoDb = async () => {
  try {
    const connDB = await mongoose.connect(process.env.MONGO_DB);

    console.log("mogodb has been successfully conntected");
  } catch (e) {
    console.log("mongoDb connection is lose ");
  }
};
