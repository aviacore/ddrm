const chalk = require('chalk');

module.exports = (tx, tabs) => {
  if (typeof tx !== 'object')
    throw new TypeError(`Invliad type of tx. Expected: object, given: ${typeof tx}`);
  if (typeof tabs !== 'number')
    throw new TypeError(`Invliad type of tabs. Expected: number, given: ${typeof tabs}`);
  if (tabs < 0) throw new Error(`Invliad tabs value. Expected: >= 0, given: ${tabs}`);

  let space = '';
  for (let i = 0; i < tabs; i++) space += '  ';
  console.log(`${space}${chalk.green('✓')} ${chalk.gray(`gas used: ${tx.receipt.gasUsed}`)}`);
};
