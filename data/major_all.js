const majorData = {
  '1': [
    {
      id: '101',
      name: '哲学类',
      majors: [
        { id: '1001', name: '哲学', exists: true },
        { id: '1002', name: '逻辑学', exists: false }
      ]
    }
  ],
  '2': [
    {
      id: '201',
      name: '经济学类',
      majors: [
        { id: '2001', name: '经济学', exists: true },
        { id: '2002', name: '国际经济与贸易', exists: true }
      ]
    },
    {
      id: '202',
      name: '财政学类',
      majors: [
        { id: '2003', name: '财政学', exists: true },
        { id: '2004', name: '税收学', exists: true }
      ]
    }
  ],
  '3': [
    {
      id: '301',
      name: '法学类',
      majors: [
        { id: '3001', name: '法学', exists: true },
        { id: '3002', name: '知识产权', exists: false }
      ]
    }
  ],
  '4': [
    {
      id: '401',
      name: '教育学类',
      majors: [
        { id: '4001', name: '教育学', exists: true },
        { id: '4002', name: '学前教育', exists: true }
      ]
    }
  ],
  '5': [
    {
      id: '501',
      name: '中国语言文学类',
      majors: [
        { id: '5001', name: '汉语言文学', exists: true },
        { id: '5002', name: '汉语国际教育', exists: true }
      ]
    }
  ],
  '6': [
    {
      id: '601',
      name: '历史学类',
      majors: [
        { id: '6001', name: '历史学', exists: true },
        { id: '6002', name: '世界史', exists: false }
      ]
    }
  ],
  '7': [
    {
      id: '701',
      name: '数学类',
      majors: [
        { id: '7001', name: '数学与应用数学', exists: true },
        { id: '7002', name: '信息与计算科学', exists: true }
      ]
    },
    {
      id: '702',
      name: '物理学类',
      majors: [
        { id: '7003', name: '物理学', exists: true },
        { id: '7004', name: '应用物理学', exists: true }
      ]
    }
  ],
  '8': [
    {
      id: '801',
      name: '计算机类',
      majors: [
        { id: '8001', name: '计算机科学与技术', exists: true },
        { id: '8002', name: '软件工程', exists: true },
        { id: '8003', name: '网络工程', exists: true },
        { id: '8004', name: '数据科学与大数据技术', exists: true }
      ]
    }
  ],
  '9': [
    {
      id: '901',
      name: '作物学类',
      majors: [
        { id: '9001', name: '农学', exists: true },
        { id: '9002', name: '种子科学与工程', exists: false }
      ]
    }
  ],
  '10': [
    {
      id: '1001',
      name: '基础医学类',
      majors: [
        { id: '10001', name: '基础医学', exists: true },
        { id: '10002', name: '生物医学', exists: true }
      ]
    }
  ],
  '11': [
    {
      id: '1101',
      name: '管理科学与工程类',
      majors: [
        { id: '11001', name: '信息管理与信息系统', exists: true },
        { id: '11002', name: '工程管理', exists: true }
      ]
    }
  ],
  '12': [
    {
      id: '1201',
      name: '军事学类',
      majors: [
        { id: '12001', name: '军事思想及军事历史', exists: false },
        { id: '12002', name: '军事战略学', exists: false }
      ]
    }
  ]
}

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