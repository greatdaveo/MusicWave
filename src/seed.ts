import mongoose from "mongoose";
import SongModel from "./models/song.model";
import { server } from "./config/config";

const songs = [
  {
    title: "Shape of You",
    year: 2017,
    tags: ["Pop", "Dance"],
    duration: 120,
    description: "A chart-topping song by Ed Sheeran.",
    genre: "Pop",
  },
  {
    title: "Bohemian Rhapsody",
    year: 1975,
    duration: 180,
    tags: ["Rock", "Classic"],
    description: "A classic hit by Queen.",
    genre: "Rock",
  },
  {
    title: "Blinding Lights",
    year: 2019,
    duration: 360,
    tags: ["Pop", "Synthwave"],
    description: "A global hit by The Weeknd.",
    genre: "Synthwave",
  },
  {
    title: "Billie Jean",
    year: 1983,
    duration: 180,
    tags: ["Pop", "Classic"],
    description: "A legendary track by Michael Jackson.",
    genre: "Pop",
  },
  {
    title: "Rolling in the Deep",
    year: 2010,
    duration: 90,
    tags: ["Soul", "Pop"],
    description: "A powerful song by Adele.",
    genre: "Soul",
  },
  {
    title: "Essence",
    year: 2020,
    duration: 250,
    tags: ["Afrobeats", "Soul"],
    description: "A smooth Afrobeat anthem by Wizkid featuring Tems.",
    genre: "Afrobeats",
  },
  {
    title: "Fall",
    year: 2017,
    duration: 210,
    tags: ["Afrobeats", "Dance"],
    description: "A popular Afrobeat track by Davido.",
    genre: "Afrobeats",
  },
  {
    title: "Anybody",
    year: 2019,
    duration: 200,
    tags: ["Afrobeats", "Pop"],
    description: "An energetic Afrobeat song by Burna Boy.",
    genre: "Afrobeats",
  },
  {
    title: "Infinity",
    year: 2020,
    duration: 230,
    tags: ["Afrobeats", "Vibes"],
    description: "A hit song by Olamide featuring Omah Lay.",
    genre: "Afrobeats",
  },
  {
    title: "Jerusalema",
    year: 2020,
    duration: 240,
    tags: ["Afrobeats", "Gospel"],
    description: "A global Afrobeat dance anthem by Master KG.",
    genre: "Afrobeats",
  },
  {
    title: "FEM",
    year: 2020,
    duration: 210,
    tags: ["Afrobeats", "Pop"],
    description: "A bold Afrobeat track by Davido.",
    genre: "Afrobeats",
  },
  {
    title: "Ye",
    year: 2018,
    duration: 220,
    tags: ["Afrobeats", "Classic"],
    description: "An iconic Afrobeat song by Burna Boy.",
    genre: "Afrobeats",
  },
  {
    title: "Ginger",
    year: 2020,
    duration: 240,
    tags: ["Afrobeats", "Pop"],
    description: "A Wizkid song featuring Burna Boy.",
    genre: "Afrobeats",
  },
  {
    title: "Soapy",
    year: 2019,
    duration: 210,
    tags: ["Afrobeats", "Street"],
    description: "A street Afrobeat anthem by Naira Marley.",
    genre: "Afrobeats",
  },
  {
    title: "Loading",
    year: 2020,
    duration: 190,
    tags: ["Afrobeats", "Dance"],
    description: "A party song by Olamide featuring Bad Boy Timz.",
    genre: "Afrobeats",
  },
  {
    title: "Joro",
    year: 2019,
    duration: 230,
    tags: ["Afrobeats", "Soul"],
    description: "A romantic Afrobeat tune by Wizkid.",
    genre: "Afrobeats",
  },
  {
    title: "Soco",
    year: 2018,
    duration: 210,
    tags: ["Afrobeats", "Group"],
    description: "A Wizkid-led hit featuring Starboy Entertainment artists.",
    genre: "Afrobeats",
  },
  {
    title: "Pana",
    year: 2016,
    duration: 200,
    tags: ["Afrobeats", "Love"],
    description: "A love song by Tekno.",
    genre: "Afrobeats",
  },
  {
    title: "Woman",
    year: 2021,
    duration: 240,
    tags: ["Afrobeats", "Celebration"],
    description: "A cultural celebration by Simi.",
    genre: "Afrobeats",
  },
  {
    title: "True Love",
    year: 2020,
    duration: 220,
    tags: ["Afrobeats", "Vibes"],
    description: "A mellow Afrobeat song by Wizkid.",
    genre: "Afrobeats",
  },
  {
    title: "Champion Sound",
    year: 2021,
    duration: 250,
    tags: ["Afrobeats", "Dance"],
    description: "A party Afrobeat song by Davido featuring Focalistic.",
    genre: "Afrobeats",
  },
  {
    title: "Kilometre",
    year: 2021,
    duration: 200,
    tags: ["Afrobeats", "Groove"],
    description: "A groovy Afrobeat track by Burna Boy.",
    genre: "Afrobeats",
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
