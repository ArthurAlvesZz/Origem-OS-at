const fs = require('fs');

function replace(file, findFn, replaceFn) {
  if(!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  let res = typeof findFn === 'string' ? content.split(findFn).join(replaceFn) : content.replace(findFn, replaceFn);
  if(res !== content) fs.writeFileSync(file, res, 'utf8');
}

replace('server/modules/orders/orders.controller.ts', 'productId: item.productId,', 'productId: item.productId === null ? "" : item.productId,');

replace('tests/integration/crm-vertical.test.ts', 'stageId: encomendas!.stages[0].id,', 'stageId: encomendas!.stages![0].id,');
replace('tests/integration/crm-vertical.test.ts', 'stageId: b2b!.stages[0].id,', 'stageId: b2b!.stages![0].id,');
