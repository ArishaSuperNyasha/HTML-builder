const fs = require('node:fs');
const path = require('node:path');

function copyFolder(isFirstTry = true, newPath = null) {
  let foldName, origFiles, copy;
  origFiles = path.join(__dirname, 'files');
  copy = path.join(__dirname, 'files-copy');

  fs.readdir(copy, (_, copyFiles) => {
    if (copyFiles === undefined) return;
    fs.readdir(origFiles, (_, origFiles2) => {
      if (copyFiles.length > origFiles2.length) {
        const copyNames = copyFiles.map((item) => path.basename(item));
        const origNames = origFiles2.map((item) => path.basename(item));
        for (let i = 0; i < copyNames.length; i += 1) {
          if (!origNames.includes(copyNames[i])) {
            fs.unlink(path.join(copy, copyFiles[i]), (err) => {
              if (err) throw err;
            });
          }
        }
      }
    });
  });

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
