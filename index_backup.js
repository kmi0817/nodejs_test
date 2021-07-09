import express from 'express';
import bodyParser from 'body-parser';

import moviesRoutes from './routes/movies.js';


const server = express(); // create express Server
const PORT = 3000;

server.use(bodyParser.json()); // meaning we will use JSON data in our whole server

server.use('/movies', moviesRoutes);

server.get('/', (req, res) => {
  var template = `
  <html>
    <head>
      <meta charset='utf-8'>
      <link rel="stylesheet" href="http://cdn.webix.com/edge/webix.css" type="text/css">
      <script src="//cdn.webix.com/edge/webix.js" type="text/javascript"></script>
    </head>
    <body>
      <script type="text/javascript" charset="utf-8">
        webix.ready(function() {
          webix.ui({
            rows: [
              { /* 첫 번째 행 시작 */
                view: 'form', id: 'form', width: 300, elements: [
                  {
                    cols: [
                      {view: 'text', label: '제목', name: 'title'},
                      {view: 'button', value: '추가', autowidth: true, click: insertItem},
                      {view: 'button', value: '삭제', autowidth: true, click: deleteItem},
                      {view: 'button', value: '저장', autowidth: true, },
                      {view: 'button', value: '콘솔', autowidth: true, click: console_print}
                    ]
                  },
                  {
                    cols: [
                      {view: 'text', label: '감독', name: 'director'},
                      {view: 'text', label: '년도', name: 'year'},
                    ]
                  },
                  {view: 'textarea', label: '내용', name: 'description'},
                ]
              }, /* 첫 번째 행 끝 */
              { /* 두 번째 행 시작 */
                view: 'datatable', id: 'table',
                save: 'rest->http://localhost:3000/movies/',
                url: 'http://localhost:3000/movies/',
                select: true, // enable to select rows in datatable
                editable: true, // enable to edit datatable
                columns: [
                  {id: 'title', header: '제목',fillspace: true, minWidth: 100, editor: 'text', sort: 'string'},
                  {id: 'director', header: '감독', fillspace: true, minWidth: 100, editor: 'text'},
                  {id: 'release_date', header: '개봉년도', fillspace: true, minWidth: 100, editor: 'text'},
                  {id: 'description', header: "내용", fillspace: true, maxWidth: 200}
                ]
              } /* 두 번째 행 끝 */
            ]
          });

          function insertItem() {
            const form = $$('form').elements
            const new_title = form.title.getValue();
            const new_director = form.director.getValue();
            const new_year = form.year.getValue();
            const new_desc = form.description.getValue();

            $$('table').add({title: new_title, director: new_director, release_date: new_year, description: new_desc});
          }

          function deleteItem() {
            const table = $$('table');
            const item_id = table.getSelectedId();

            if (item_id) {
              alert('<선택한 아이템 ID> ' + item_id);
              table.remove(item_id);
            } else {
              alert("선택한 아이템이 없습니다.");
            }
          }

          function saveData() {

          }

          function console_print() {
            const data = $$('table').serialize();
            console.log(data);
          }
        });
      </script>
    </body>
  </html>
  `;
  res.send(template);
});

server.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
})
