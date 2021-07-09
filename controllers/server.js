import { v4 as uuidv4 } from 'uuid'; // uuidv() makes a new random id
import fs from 'fs';

export const getRecords = (req, res) => {
  fs.readdir('Ghibli', (err, movies) => {
    const list = template.list(movies);
    const body = `
    <form action='/create_process' method='POST'>
      <p><input type='text' name='title' placeholder='title'></>
      <p><input type='text' name='director' placeholder='director'></>
      <p><input type='text' name='release_date' placeholder='release_date'></>
      <p><textarea name='description' placeholder='내용'></textarea></>
      <p><input type='submit' value='제출'></p>
    </form>
    `;
    const html = template.HTML(list, body, ``);
    res.send(template);
  });
}

export const getRecord = (req, res) => {
  const id = req.params.id;

  fs.readdir('Ghibli', (err, movies) => {
    const list = template.list(movies);

    fs.readFile(`Ghibli/${id}`, 'utf8', (err, movie) => {
      const body = `
      <div>${movie}</div>
      `;

      const crud = `
      <a href='/delete'>update</a>
      <form action='/delete' method='POST' onsubmit="if(!confirm('삭제하시겠습니까?')){return false;}">
        <input type='hidden' name='id' value='${id}'>
        <input type='submit' value='delete'>
      </form>
      `;

      const html = template.HTML(list, body, crud);
      res.send(template);
    });
  });
}

export const postRecord = (req, res) => {
  const movie = req.body;
  const id = uuidv4();

  const movie_with_id = {id: id, ...movie}
  const json = JSON.stringify(movie_with_id, null, 2); // 이거 안 하면 파일 저장 시 Object로만 저장됨

  fs.writeFile(`Ghibli/${id}`, `${json}`, 'utf8', (err) => {
    if (err) throw err;
    console.log("file saved");
  });
  res.redirect('/');
}

export const updateRecord = (req, res) => {
  const id = req.params.id;

  fs.readdir('Ghibli', (err, movies) => {
    const list = makeList(movies);

    fs.readFile(`Ghibli/${id}`, 'utf8', (err, movie) => {
      movie = JSON.parse(movie);

      const body = `
      <form action='/update_process' method='POST'>
        <input type='hidden' name='id' value='${id}'>
        <p><input type='text' name='title' value='${movie.title}' placeholder='title'></>
        <p><input type='text' name='director' value='${movie.director}' placeholder='director'></>
        <p><input type='text' name='release_date' value='${movie.release_date}' placeholder='release_date'></>
        <p><textarea name='description' placeholder='내용'>${movie.description}</textarea></>
        <p><input type='submit' value='제출'></p>
      </form>
      `;
      const html = template.HTML(list, body, ``);
      res.send(template);
    });
  });
}

export const patchRecord = (req, res) => {
  const movie = req.body;
  const json = JSON.stringify(movie, null, 2);

  fs.writeFile(`Ghibli/${movie.id}`, `${json}`, 'utf8', (err) => {
    if (err) throw err;
    console.log(`${movie.id} has been saved`);
  });
  res.redirect('/');
}

export const deleteRecord = (req, res) => {
  const id = req.body.id;

  fs.unlink(`Ghibli/${id}`, (err) => {
    if (err) throw err;
    console.log(`${id} has been deleted`);
  });
  res.redirect('/');
}

/* template 라는 객체에 HTML과 list 라는 속성이 있다 */
var template = {
  HTML: function(list, body, crud) {
    return `
      <!doctype HTML>
      <html>
      <head>
        <title>Ghibli</title>
        <meta charset='utf-8'>
      </head>
      <body>
        <h1><a href='/'>index</a></h1>
        ${crud}
        ${list}
        ${body}
      </body>
      <html>
    `;
  },
  list:function(filelist) {
    var list = '<ul>';
    filelist.forEach((file) => {
      list += `<li><a href='${file}'>${file}</a></li>`;
    });
    list += '</ul>';

    return list;
  }
}
