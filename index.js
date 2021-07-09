import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';


import fs from 'fs';
import { getRecord } from './controllers/server.js';
import moviesRoutes from './routes/movies.js';


const server = express(); // create express Server
const PORT = 3000;

server.use(bodyParser.urlencoded({extended:true})); // 이게 없으면 클아이언트에서 submit 해서 POST로 넘길 시 undefined로만 나온다. 출처: https://meyouus.tistory.com/68
server.use(bodyParser.json()); // meaning we will use JSON data in our whole server

server.use('/movies', moviesRoutes);

server.get('/', (req, res) => {
  fs.readdir('Ghibli', (err, movies) => {
    const list = makeList(movies);
    const body = `
    <form action='/create_process' method='POST'>
      <p><input type='text' name='title' placeholder='title'></>
      <p><input type='text' name='director' placeholder='director'></>
      <p><input type='text' name='release_date' placeholder='release_date'></>
      <p><textarea name='description' placeholder='내용'></textarea></>
      <p><input type='submit' value='제출'></p>
    </form>
    `;
    const template = templateHTML(list, body);
    res.send(template);
  });
});

server.post('/create_process', (req, res) => {
  const movie = req.body;
  const id = uuidv4();

  const movie_with_id = {id: id, ...movie}
  const json = JSON.stringify(movie_with_id, null, 2); // 이거 안 하면 파일 저장 시 Object로만 저장됨

  fs.writeFile(`Ghibli/${id}`, `${json}`, 'utf8', (err) => {
    if (err) throw err;
    console.log("file saved");
  });
  res.send(json);
});

server.get('/:id', (req, res) => {
  const id = req.params.id;

  fs.readdir('Ghibli', (err, movie) => {
    const list = makeList(movies);

    fs.readFile(`Ghibli/${id}`, 'utf8', (err, movie) => {
      const body = `
      <div>${movie}</div>
      `;

      const template = templateHTML(list, body);
      res.send(template);
    });
  });
});


server.delete('/delete/:id')
server.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
})

function templateHTML(list, body) {
  return `
    <!doctype HTML>
    <html>
    <head>
      <title>Ghibli</title>
      <meta charset='utf-8'>
    </head>
    <body>
      <h1><a href='/'>index</a></h1>
      <a href='/delete'>delete</a>
      ${list}
      ${body}
    </body>
    <html>
  `;
}

function makeList(filelist) {
  var list = '<ul>';
  filelist.forEach((file) => {
    list += `<li><a href='${file}'>${file}</a></li>`;
  });
  list += '</ul>';

  return list;
}
