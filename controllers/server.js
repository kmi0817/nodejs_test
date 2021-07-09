import fs from 'fs';


export const getRecord = (req, res) => {
  const id = req.params.id;

  fs.readFile(`Ghibli/${id}`, 'utf8', (err, file) => {
    if (err) throw err;
    console.log(file);
    res.send(file);
  });
}
