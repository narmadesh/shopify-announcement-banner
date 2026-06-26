import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
  shop: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);