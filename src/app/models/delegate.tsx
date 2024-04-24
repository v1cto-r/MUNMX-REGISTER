import mongoose, {Schema} from "mongoose";

const delegateSchema = new Schema(
  {
    country: Number,
    name: String,
    committee: Number,
    registered: Boolean,
    vegan: Boolean
  }
);

const Delegate = mongoose.models.Delegate || mongoose.model("Delegate", delegateSchema);

export default Delegate