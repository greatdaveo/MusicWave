import { Request, Response, NextFunction } from "express";
import SongModel from "../models/song.model";

export const getSongs = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { page = 0, size = 10, filter, sortBy, search } = req.query;

    let query: any = {};

    // To Search
    if (typeof search === "string") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // To Filter
    if (typeof filter === "string") {
      const filters = filter.split(",");
      query.genre = { $in: filters };
    }

    let sortOptions: any = {};
    // To Sort
    if (typeof sortBy === "string") {
      const sortField = sortBy.toLowerCase();
      sortOptions[sortField] = 1;
    } else {
      sortOptions.title = 1;
    }
    
    // For Pagination
    const skip = Number(page) * Number(size);
    const limit = Number(size);

    // To query the DB
    const songs = await SongModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

    // console.log("Songs:", songs);

    if (!songs || songs.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No song found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Retrieved all searched song successfully",
      data: songs,
    });
  } catch (error: any) {
    logging.error(error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while retrieving songs",
    });
  }
};
