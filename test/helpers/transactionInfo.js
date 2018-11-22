const style = require('ansi-styles');

module.exports = (tx, tabs) => {
  if (typeof tx != 'object')
    throw new TypeError(`Invliad type of tx. Expected: object, given: ${typeof tx}`);
  if (typeof tabs != 'number')
    throw new TypeError(`Invliad type of tabs. Expected: number, given: ${typeof tabs}`);
  if (tabs < 0) throw new Error(`Invliad tabs value. It should be >= 0`);

  let space = '';
  for (let i = 0; i < tabs; i++) space += '  ';
  console.log(
    space +
      style.green.open +
      '√ ' +
      style.green.close +
      style.gray.open +
      `gas used: ${tx.receipt.gasUsed}` +
      style.gray.close
  );
};
