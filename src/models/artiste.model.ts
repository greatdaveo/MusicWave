import mongoose, { Schema, Document } from "mongoose";

export interface IArtiste extends Document {
  name: string;
  email: string;
  address: {
    country: string;
    state: string;
  };
}

const ArtisteSchema: Schema<IArtiste> = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
  },

  address: {
    country: {
      type: String,
      required: [true, "Please enter your country"],
    },
    state: {
      type: String,
      required: [true, "Please enter your state"],
    },
  },
});

export default mongoose.model<IArtiste>("artiste", ArtisteSchema);
