import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
  name: String, 
  password: String,
  role: Number,
  identifier: Number
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User