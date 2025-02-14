import pandas as pd
import json

def excel_to_js():
    # 读取Excel文件
    df = pd.read_excel('majors_data.xlsx', sheet_name=None)
    
    # 初始化结果数据
    major_data = {}
    
    # 处理学校sheet
    schools_df = df['schools']
    for _, row in schools_df.iterrows():
        school_id = int(row['school_id'])
        major_data[school_id] = {
            'categories': []
        }
    
    # 处理专业大类sheet
    categories_df = df['categories']
    for _, row in categories_df.iterrows():
        school_id = int(row['school_id'])
        if school_id in major_data:
            major_data[school_id]['categories'].append({
                'name': row['category_name'],
                'subcategories': []
            })
    
    # 处理专业二级分类sheet
    subcategories_df = df['subcategories']
    for _, row in subcategories_df.iterrows():
        school_id = int(row['school_id'])
        category_index = int(row['category_index'])
        if school_id in major_data and category_index < len(major_data[school_id]['categories']):
            major_data[school_id]['categories'][category_index]['subcategories'].append({
                'name': row['subcategory_name'],
                'majors': []
            })
    
    # 处理具体专业sheet
    majors_df = df['majors']
    for _, row in majors_df.iterrows():
        school_id = int(row['school_id'])
        category_index = int(row['category_index'])
        subcategory_index = int(row['subcategory_index'])
        
        # 将课程和特色转换为列表
        courses = [course.strip() for course in str(row['courses']).split(',')]
        features = [feature.strip() for feature in str(row['features']).split(',')]
        
        major_info = {
            'name': row['major_name'],
            'code': row['major_code'],
            'introduction': row['introduction'],
            'courses': courses,
            'career': row['career'],
            'features': features
        }
        
        # 添加专业信息到对应位置
        if (school_id in major_data and 
            category_index < len(major_data[school_id]['categories']) and 
            subcategory_index < len(major_data[school_id]['categories'][category_index]['subcategories'])):
            major_data[school_id]['categories'][category_index]['subcategories'][subcategory_index]['majors'].append(major_info)
    
    # 生成JavaScript文件内容
    js_content = """// 专业数据管理文件
export const majorData = %s;

// 获取指定学校的专业数据
export function getSchoolMajors(schoolId) {
  return majorData[schoolId] || null;
}
""" % json.dumps(major_data, ensure_ascii=False, indent=2)
    
    # 写入文件
    with open('../data/majors.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

if __name__ == '__main__':
    excel_to_js() 