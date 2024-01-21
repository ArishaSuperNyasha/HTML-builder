const fs = require('node:fs');
const path = require('node:path');

function copyFolder(isFirstTry = true, newPath = null) {
  let foldName, origFiles, copy;
  origFiles = path.join(__dirname, 'files');
  copy = path.join(__dirname, 'files-copy');
  if (!isFirstTry) {
    foldName = newPath.replace(origFiles, '').split('\\').slice(1);
    foldName = foldName.join('\\');
    copy = path.join(copy, foldName);
    origFiles = newPath;
  }
  fs.mkdir(copy, { recursive: true }, (err) => {
    if (err) console.log(err);
  });
  fs.readdir(origFiles, (_, files) => {
    files.forEach((file) => {
      fs.stat(path.join(origFiles, file), (err, fileStats) => {
        if (err) throw err;
        else if (fileStats.isDirectory()) {
          copyFolder(false, path.join(origFiles, file));
        } else {
          fs.copyFile(
            path.join(origFiles, file),
            path.join(copy, file),
            (err) => {
              if (err) throw err;
            },
          );
        }
      });
    });
  });
}

copyFolder();
