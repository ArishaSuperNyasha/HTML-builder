const fs = require('node:fs');
const path = require('node:path');

const { stdout } = process;
const f = path.join(__dirname, 'text.txt');
const reader = fs.createReadStream(f);

reader.on('data', function (data) {
  stdout.write(data.toString());
});
