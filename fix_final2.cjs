const fs = require('fs');

function replace(file, findFn, replaceFn) {
  if(!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  let res = typeof findFn === 'string' ? content.split(findFn).join(replaceFn) : content.replace(findFn, replaceFn);
  if(res !== content) fs.writeFileSync(file, res, 'utf8');
}

replace('server/controllers/digitalMenu.ts', 'trackingNumber: order.trackingNumber,', 'trackingNumber: order.trackingNumber === null ? undefined : order.trackingNumber,');

replace('server/modules/orders/orders.controller.ts', 'const orderItemsData = [];', 'const orderItemsData: any[] = [];');

// 251:13
replace('server/modules/orders/orders.controller.ts', 'variantId: item.variantId,', 'variantId: item.variantId === null ? undefined : item.variantId,');
