const fs = require('node:fs');
const path = require('node:path');

function mergeStyle(from, input) {
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
}

function copyFolder(isFirstTry = true, newPath = null) {
  let foldName, origFiles, copy;
  origFiles = path.join(__dirname, 'assets');
  copy = path.join(__dirname, 'project-dist', 'assets');
  if (!isFirstTry) {
    foldName = newPath.replace(origFiles, '').split('\\').slice(1);
    foldName = foldName.join('\\');
    copy = path.join(copy, foldName);
    origFiles = newPath;
  }
  fs.mkdir(copy, { recursive: true }, (err) => {
    if (err) throw err;
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

function buildPage() {
  const projectDist = path.join(__dirname, 'project-dist');
  fs.mkdir(projectDist, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const newHtml = path.join(projectDist, 'index.html');
  fs.readFile(path.join(__dirname, 'template.html'), (err, tempData) => {
    if (err) throw err;
    fs.readdir(path.join(__dirname, 'components'), (_, files) => {
      let innerHTML = tempData.toString();
      files.forEach((file) => {
        const fName = path.basename(file).match(/.{1,}(?=(\.html))/)[0];
        const regeexp = `{{${fName}}}`;
        fs.readFile(path.join(__dirname, 'components', file), (err, data) => {
          if (err) throw err;
          innerHTML = innerHTML.replaceAll(regeexp, data.toString());
          fs.writeFile(newHtml, innerHTML, (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });

  const cssDist = path.join(__dirname, 'styles');
  const newCss = path.join(projectDist, 'style.css');
  const inputCss = fs.createWriteStream(newCss);
  mergeStyle(cssDist, inputCss);

  copyFolder();
}

buildPage();
