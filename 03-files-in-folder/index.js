const fs = require('node:fs');
const path = require('node:path');

const name = path.join(__dirname, 'secret-folder');
const { stdout } = process;
fs.readdir(name, (_, files) => {
  files.forEach((file) => {
    const ext = path.extname(file).slice(1);
    const fname = path.basename(file).match(/[a-z]{1,}(?=\.)/i);
    fs.stat(path.join(name, file), (error, fileStats) => {
      if (error) console.log(error);
      else {
        if (fileStats.isDirectory()) return;
        stdout.write(
          `${fname} - ${ext} - ${(fileStats.size / 1024).toFixed(3)}kb\n`,
        );
      }
    });
  });
});
