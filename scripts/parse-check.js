const fs = require('fs');
const vm = require('vm');
const path = require('path');
const target = path.join(__dirname, '..', 'js', 'LeaderboardMenu.js');
try {
  const src = fs.readFileSync(target, 'utf8');
  vm.runInNewContext(src, {});
  console.log('PARSE_OK');
} catch (e) {
  console.error(e);
  process.exitCode = 1;
}
