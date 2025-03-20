import { MovieModel } from "../models/MovieModel";

export class MovieDto {
  content: Array<MovieModel> = [];
  size:number = 0;
}