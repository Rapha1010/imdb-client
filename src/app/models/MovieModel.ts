import { Deserializable } from "./Deserializable";

export class MovieModel implements Deserializable {

  movieId:string = '';
  movieName:string = '';
  storyLine:string = '';
  genres:string = '';
  directorName:string = '';
  castNames:string = '';

  deserialize(input: MovieModel) {
    Object.assign(this, input);
    return this;
  }
}