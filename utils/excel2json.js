const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// 获取项目根目录路径
const rootDir = path.join(__dirname, '..');

// 读取 Excel 文件（从项目根目录）
const workbook = xlsx.readFile(path.join(rootDir, 'universities.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// 转换为 JSON
const universities = xlsx.utils.sheet_to_json(sheet).map((uni, index) => ({
  id: index + 1,
  name: uni['学校名称'],
  logo: uni['logo'],
  location: uni['所在地'],
  type: uni['类型'],
  level: uni['层次'],
  tags: uni['标签'].split(',').map(tag => tag.trim()),
  rank: uni['排名'],
  website: uni['网址'],
  description: uni['简介']
}));

// 确保 data 目录存在
const dataDir = path.join(rootDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 保存为 JS 文件
fs.writeFileSync(
  path.join(dataDir, 'universities.js'),
  `export const universities = ${JSON.stringify(universities, null, 2)};`
);

console.log(`成功转换 ${universities.length} 所大学的数据`);