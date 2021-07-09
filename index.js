import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';


import fs from 'fs';
import { getRecords, getRecord, postRecord, updateRecord, patchRecord, deleteRecord } from './controllers/server.js';
import moviesRoutes from './routes/movies.js';


const server = express(); // create express Server
const PORT = 3000;

server.use(bodyParser.urlencoded({extended:true})); // 이게 없으면 클아이언트에서 submit 해서 POST로 넘길 시 undefined로만 나온다. 출처: https://meyouus.tistory.com/68
server.use(bodyParser.json()); // meaning we will use JSON data in our whole server

server.use('/movies', moviesRoutes);


server.get('/', getRecords);

server.get('/:id', getRecord);

server.post('/create_process', postRecord);

server.get('/update/:id', updateRecord);

server.post('/update_process', patchRecord);

server.post('/delete', deleteRecord);

server.delete('/delete/:id')

server.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
