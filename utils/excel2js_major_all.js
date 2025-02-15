const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')

// 读取 Excel 文件
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return xlsx.utils.sheet_to_json(worksheet)
}

// 转换数据格式
function transformData(rows) {
  const majorData = {}
  
  rows.forEach(row => {
    const categoryId = row['一级学科ID']
    const subcategoryId = row['二级学科ID']
    const majorId = row['专业ID']
    const exists = row['是否火爆'] === '是'

    // 如果一级学科不存在，创建它
    if (!majorData[categoryId]) {
      majorData[categoryId] = []
    }

    // 查找或创建二级学科
    let subcategory = majorData[categoryId].find(sub => sub.id === subcategoryId)
    if (!subcategory) {
      subcategory = {
        id: subcategoryId,
        name: row['二级学科名称'],
        majors: []
      }
      majorData[categoryId].push(subcategory)
    }

    // 添加专业，包含更多详细信息
    subcategory.majors.push({
      id: majorId,
      name: row['专业名称'],
      exists: exists,
      description: row['专业描述'] || '',
      courses: (row['主要课程'] || '').split('、').filter(Boolean),
      careers: (row['就业方向'] || '').split('、').filter(Boolean),
      stats: {
        employmentRate: row['就业率'] || '暂无数据',
        avgSalary: row['平均薪资'] || '暂无数据',
        satisfaction: row['满意度'] || '暂无数据',
        schoolCount: exists ? parseInt(row['开设院校数']) || 0 : 0
      }
    })
  })

  return majorData
}

// 生成 JS 文件内容
function generateJsContent(majorData) {
  const content = `const majorData = ${JSON.stringify(majorData, null, 2)}

// 所有专业的扁平数组，用于搜索
const allMajors = Object.values(majorData).reduce((acc, categoryMajors) => {
  categoryMajors.forEach(subcategory => {
    subcategory.majors.forEach(major => {
      acc.push({
        ...major,
        category: subcategory.name
      })
    })
  })
  return acc
}, [])

module.exports = {
  majorData: majorData,
  allMajors: allMajors
}
`
  return content
}

// 主函数
function main() {
  // Excel 文件路径（相对于脚本位置）
  const excelPath = path.join(__dirname, '../majors_data_all.xlsx')
  // 输出文件路径
  const outputPath = path.join(__dirname, '../data/major_all.js')

  try {
    // 读取并转换数据
    const rows = readExcel(excelPath)
    const majorData = transformData(rows)

    // 生成并写入文件
    const content = generateJsContent(majorData)
    fs.writeFileSync(outputPath, content, 'utf8')

    console.log('转换成功！文件已保存到:', outputPath)
  } catch (error) {
    console.error('转换失败:', error)
  }
}

// 执行转换
main() 