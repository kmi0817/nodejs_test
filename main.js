var http = require('http');
var fs = require('fs');
var url = require('url'); // require the module named 'url' to use

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB...</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `
}

function templateList(filelist) {
  var list = "<ul>";
  filelist.forEach((file) => {
    list += `<li><a href="/?id=${file}">${file}</a></li>`;
  })
  list += "</ul>";

  return list
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
      if (queryData.id === undefined) {

        fs.readdir('data', function(err, filelist) {
          var title = 'welcome';
          var description = "hello, node.js";
          var list = templateList(filelist);

          var template = templateHTML(title, list, `<h2>${title}</h2>
              <p>${description}</p>`);
          response.writeHead(200);
          response.end(template); // clients see this
        });
      } else {
        fs.readdir('data', function(err, filelist) {
          var list = templateList(filelist);

          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            var title = queryData.id;
            var template = templateHTML(title, list, `<h2>${title}</h2>
                <p>${description}</p>`);
            response.writeHead(200);
            response.end(template); // clients see this
          });
        });
      }
    } else {
      response.writeHead(404);
      response.end("not Found");
    }
});
app.listen(3000);
