const fs = require('fs');

function replace(file, findFn, replaceFn) {
  if(!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const res = typeof findFn === 'string' ? content.replace(findFn, replaceFn) : content.replace(findFn, replaceFn);
  if(res !== content) fs.writeFileSync(file, res, 'utf8');
}

// 1
replace('server/controllers/digitalMenu.ts', /description: item\.description/g, 'description: item.description || undefined');
// 2
replace('server/modules/orders/orders.controller.ts', /let orderItemsData = \[\];/g, 'let orderItemsData: any[] = [];');
// 3
replace('src/components/dashboard/MultiUnitDashboard.tsx', /val\:\s*number/g, 'val: any');
// 4 & 5
replace('src/components/finance/DynamicDRE.tsx', /getProducts\(\)/g, 'getItems()');
replace('src/components/finance/DynamicDRE.tsx', /\.filter\(\(p\)\ \=\>/g, '.filter((p: any) =>');
replace('src/components/finance/DynamicDRE.tsx', /\.filter\(p\ \=\>/g, '.filter((p: any) =>');
// 6
replace('src/components/finance/ScenarioModeling.tsx', /import \{ Label \} from '\.\.\/ui\/Label';/, 'import { Label } from "@radix-ui/react-label";');
// 7, 8
replace('src/components/finance/ScenarioModeling.tsx', /value\:\s*number/g, 'value: any');

// 9
replace('src/components/reports/AdvancedAnalytics.tsx', /o\.customerName/g, 'o.customer?.name');
replace('src/components/reports/AdvancedAnalytics.tsx', /o\.metadata\?/g, '(o as any).metadata?');

// 10
replace('src/domain/consignments.ts', /i\ \=\>/g, '(i: any) =>');
replace('src/repositories/mock/MockConsignmentRepository.ts', /i\ \=\>/g, '(i: any) =>');

// IFinancialRepository
replace('src/repositories/interfaces/IFinancialRepository.ts', /getTransactions\(/, 'getSummary(unitId?: string): Promise<any>;\n  getTransactions(');

// tests
replace('tests/integration/crm-vertical.test.ts', /createdAccount\.id/g, 'createdAccount!.id');
