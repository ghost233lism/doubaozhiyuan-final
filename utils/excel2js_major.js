const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function excel2js() {
  // 读取Excel文件
  const workbook = xlsx.readFile('majors_data.xlsx');
  
  // 初始化结果数据
  const majorData = {};
  
  // 处理学校sheet
  const schoolsSheet = workbook.Sheets['schools'];
  const schools = xlsx.utils.sheet_to_json(schoolsSheet);
  schools.forEach(row => {
    const schoolId = parseInt(row.school_id);
    majorData[schoolId] = {
      categories: []
    };
  });
  
  // 处理专业大类sheet
  const categoriesSheet = workbook.Sheets['categories'];
  const categories = xlsx.utils.sheet_to_json(categoriesSheet);
  categories.forEach(row => {
    const schoolId = parseInt(row.school_id);
    if (majorData[schoolId]) {
      majorData[schoolId].categories.push({
        name: row.category_name,
        subcategories: []
      });
    }
  });
  
  // 处理专业二级分类sheet
  const subcategoriesSheet = workbook.Sheets['subcategories'];
  const subcategories = xlsx.utils.sheet_to_json(subcategoriesSheet);
  subcategories.forEach(row => {
    const schoolId = parseInt(row.school_id);
    const categoryIndex = parseInt(row.category_index);
    if (majorData[schoolId] && 
        categoryIndex < majorData[schoolId].categories.length) {
      majorData[schoolId].categories[categoryIndex].subcategories.push({
        name: row.subcategory_name,
        majors: []
      });
    }
  });
  
  // 处理具体专业sheet
  const majorsSheet = workbook.Sheets['majors'];
  const majors = xlsx.utils.sheet_to_json(majorsSheet);
  majors.forEach(row => {
    const schoolId = parseInt(row.school_id);
    const categoryIndex = parseInt(row.category_index);
    const subcategoryIndex = parseInt(row.subcategory_index);
    
    // 将课程和特色转换为列表
    const courses = String(row.courses).split(',').map(course => course.trim());
    const features = String(row.features).split(',').map(feature => feature.trim());
    
    const majorInfo = {
      name: row.major_name,
      code: row.major_code,
      introduction: row.introduction,
      courses: courses,
      career: row.career,
      features: features
    };
    
    // 添加专业信息到对应位置
    if (majorData[schoolId] && 
        categoryIndex < majorData[schoolId].categories.length && 
        subcategoryIndex < majorData[schoolId].categories[categoryIndex].subcategories.length) {
      majorData[schoolId].categories[categoryIndex].subcategories[subcategoryIndex].majors.push(majorInfo);
    }
  });
  
  // 生成JavaScript文件内容
  const jsContent = `// 专业数据管理文件
export const majorData = ${JSON.stringify(majorData, null, 2)};

// 获取指定学校的专业数据
export function getSchoolMajors(schoolId) {
  return majorData[schoolId] || null;
}`;
  
  // 写入文件
  const outputPath = path.join(__dirname, '../data/majors.js');
  fs.writeFileSync(outputPath, jsContent, 'utf8');
  
  console.log('转换完成！文件已保存到:', outputPath);
}

// 运行转换
excel2js(); 