// 专业数据管理文件
export const majorData = {
  "1": {
    "categories": [
      {
        "name": "工学",
        "subcategories": [
          {
            "name": "计算机类",
            "majors": [
              {
                "name": "计算机科学与技术",
                "code": "080901",
                "introduction": "清华大学计算机科学与技术专业是国家重点学科，在全国学科评估中连续排名第一。培养具有扎实数理基础和系统思维能力的创新型人才。",
                "courses": [
                  "计算机科学导论",
                  "数据结构",
                  "计算机组成原理"
                ],
                "career": "毕业生就业方向广泛，包括国内外知名科技公司、研究机构、高校等。多数毕业生在人工智能、云计算、大数据等领域担任核心技术岗位。",
                "features": [
                  "学科实力顶尖",
                  "创新创业氛围浓厚"
                ]
              },
              {
                "name": "软件工程",
                "code": "080902",
                "introduction": "测试",
                "courses": [
                  "测试"
                ],
                "career": "测试",
                "features": [
                  "测试"
                ]
              }
            ]
          },
          {
            "name": "电子信息类",
            "majors": []
          }
        ]
      },
      {
        "name": "理学",
        "subcategories": [
          {
            "name": "数学类",
            "majors": []
          },
          {
            "name": "物理学类",
            "majors": []
          }
        ]
      },
      {
        "name": "经济学",
        "subcategories": [
          {
            "name": "经济学类",
            "majors": []
          }
        ]
      }
    ]
  },
  "2": {
    "categories": [
      {
        "name": "工学",
        "subcategories": [
          {
            "name": "计算机类",
            "majors": [
              {
                "name": "计算机科学与技术",
                "code": "080901",
                "introduction": "测试",
                "courses": [
                  "测试"
                ],
                "career": "测试",
                "features": [
                  "测试"
                ]
              }
            ]
          },
          {
            "name": "电子信息类",
            "majors": []
          }
        ]
      },
      {
        "name": "理学",
        "subcategories": [
          {
            "name": "数学类",
            "majors": []
          }
        ]
      },
      {
        "name": "经济学",
        "subcategories": [
          {
            "name": "经济学类",
            "majors": []
          }
        ]
      }
    ]
  }
};

// 获取指定学校的专业数据
export function getSchoolMajors(schoolId) {
  return majorData[schoolId] || null;
}