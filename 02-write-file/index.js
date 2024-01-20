const fs = require('node:fs');
const path = require('node:path');

const name = path.join(__dirname, 'text.txt');
const input = fs.createWriteStream(name, 'utf-8');
const { stdin, stdout } = process;

stdout.write(
  'Hello, my dear friend! Please, write some good message\nTo close this program you may input "exit"\n',
);
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') process.exit();
  input.write(data);
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('OK, bye!\n'));
