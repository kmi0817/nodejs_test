import { v4 as uuidv4 } from 'uuid'; // uuidv() makes a new random id
import fs from 'fs';

let movies = [
  {
    "id": "2baf70d1-42bb-4437-b551-e5fed5a87abe",
    "title": "Castle in the Sky",
    "description": "The orphan Sheeta inherited a mysterious crystal that links her to the mythical sky-kingdom of Laputa. With the help of resourceful Pazu and a rollicking band of sky pirates, she makes her way to the ruins of the once-great civilization. Sheeta and Pazu must outwit the evil Muska, who plans to use Laputa's science to make himself ruler of the world.",
    "director": "Hayao Miyazaki",
    "release_date": "1986"
  },
  {
    "id": "12cfb892-aac0-4c5b-94af-521852e46d6a",
    "title": "Grave of the Fireflies",
    "description": "In the latter part of World War II, a boy and his sister, orphaned when their mother is killed in the firebombing of Tokyo, are left to survive on their own in what remains of civilian life in Japan. The plot follows this boy and his sister as they do their best to survive in the Japanese countryside, battling hunger, prejudice, and pride in their own quiet, personal battle.",
    "director": "Isao Takahata",
    "release_date": "1988"
  }
]

/* GET starts */
export const getMovies = (req, res) => {
  res.send(movies);
}

export const getMovie = (req, res) => {
  /* /movies/2에서 2를 알아내려면, <req.params> {id: 2} */
  const id = req.params.id;
  const item = movies.find((movie) => movie.id === id);
  /* find()는 params.id와 동일한 영화 id가 있는지 찾는다.
        만약 동일한 id가 있다면, 해당 id의 요소 전체를 반환한다.
        없다면 undefined 반환 */
  res.send(item);
}
/* GET ends */


export const postMovie = (req, res) => {
  const movie = req.body;

  movies.push({id: uuidv4(), ...movie});

  res.send(`${movie.title} has been added to the DB`);
}

export const deleteMovie = (req, res) => {
  const id = req.params.id;

  /* filter() 메소드는 (movie) => true 인 것은 포함하고,
        (movie) => false 인 것은 포함하지 않는다. */
  movies = movies.filter((movie) => movie.id != id);
  // 만약 id와 동일한 영화는 포함되지 않는다.

  res.send(`movie with id= ${id} has been deleted`);
}

export const patchMovie = (req, res) => {
  const id = req.params.id;
  const {title, description, director, release_date} = req.body;
  /* 클라이언트가 수정하길 바라는 내용이 request body로 들어온다 */

  const update_movie = movies.find((movie) => movie.id === id);
  /* 수정할 id를 가진 영화를 찾는다 */

  if (title) update_movie.title = title ;
  if (description) update_movie.description = description;
  if (director) update_movie.director = director;
  if (release_date) update_movie.release_date = release_date;
  /* 만약 request의 body에 각 key가 존재한다면,
    수정할 영화의 해당 key 내용을 request 받은 내용으로 수정한다. */

  res.send(`movie with id=${id} has been updated`);
}
