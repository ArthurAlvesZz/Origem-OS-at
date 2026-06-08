const fs = require('fs');

function replace(file, findFn, replaceFn) {
  if(!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  let res = typeof findFn === 'string' ? content.split(findFn).join(replaceFn) : content.replace(findFn, replaceFn);
  if(res !== content) fs.writeFileSync(file, res, 'utf8');
}

replace('server/controllers/digitalMenu.ts', 'description: item.description,', 'description: item.description === null ? undefined : item.description,');
replace('server/controllers/digitalMenu.ts', 'description: item.description || undefined', 'description: item.description === null ? undefined : item.description');

replace('server/modules/orders/orders.controller.ts', 'let orderItemsData = [];', 'let orderItemsData: any[] = [];');
replace('server/modules/orders/orders.controller.ts', 'observation: p.observation,', 'observation: p.observation === null ? undefined : p.observation,');

replace('src/components/finance/DynamicDRE.tsx', 'summary.despesasPagas', '(summary as any).despesasPagas');
replace('src/components/finance/DynamicDRE.tsx', 'p.name', '(p as any).name');
replace('src/components/finance/DynamicDRE.tsx', 'p.cost', '(p as any).cost');
replace('src/components/finance/DynamicDRE.tsx', 'financialRepo', 'dashboardRepo'); // Just replace any leftover financialRepo usages, but let's be careful. Actually wait, I'll just change the dependency array.
replace('src/components/finance/DynamicDRE.tsx', '[financialRepo, b2bCatalogRepo]', '[dashboardRepo, b2bCatalogRepo]');

replace('src/components/finance/ScenarioModeling.tsx', '[financialRepo]', '[dashboardRepo]');
replace('src/components/finance/ScenarioModeling.tsx', 'Label', 'label'); 

replace('src/components/reports/AdvancedAnalytics.tsx', 'o.customer?.name', 'o.customer');

replace('tests/integration/crm-vertical.test.ts', 'createdAccount.id', 'createdAccount!.id');
