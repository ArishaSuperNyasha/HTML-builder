const fs = require('node:fs');
const path = require('node:path');

const from = path.join(__dirname, 'styles');
const to = path.join(__dirname, 'project-dist');
const result = path.join(to, 'bundle.css');

const input = fs.createWriteStream(result);
fs.readdir(from, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.stat(path.join(from, file), (err, fileStats) => {
      if (err) throw err;
      if (!fileStats.isDirectory()) {
        fs.readFile(path.join(from, file), function (err, fileContent) {
          if (err) throw err;
          if (path.extname(file) === '.css') input.write(fileContent);
        });
      }
    });
  });
});
