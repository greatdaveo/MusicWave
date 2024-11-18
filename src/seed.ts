import mongoose from "mongoose";
import SongModel from "./models/song.model";
import { server } from "./config/config";

const songs = [
  {
    title: "Shape of You",
    year: 2017,
    tags: ["Pop", "Dance"],
    description: "A chart-topping song by Ed Sheeran.",
    genre: "Pop",
  },
  {
    title: "Bohemian Rhapsody",
    year: 1975,
    tags: ["Rock", "Classic"],
    description: "A classic hit by Queen.",
    genre: "Rock",
  },
  {
    title: "Blinding Lights",
    year: 2019,
    tags: ["Pop", "Synthwave"],
    description: "A global hit by The Weeknd.",
    genre: "Synthwave",
  },
  {
    title: "Billie Jean",
    year: 1983,
    tags: ["Pop", "Classic"],
    description: "A legendary track by Michael Jackson.",
    genre: "Pop",
  },
  {
    title: "Rolling in the Deep",
    year: 2010,
    tags: ["Soul", "Pop"],
    description: "A powerful song by Adele.",
    genre: "Soul",
  },
];

const seedSongs = async () => {
  try {
    await mongoose.connect(server.MongoDB_URL);

    console.log("Connected to MongoDB!");

    await SongModel.insertMany(songs);
    console.log("Songs added successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedSongs();
