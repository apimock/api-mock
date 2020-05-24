const json = {
  'code': 1,
  'message': 'success',
  'bean': {
    'totalCount': 20,
    'totalPage': 2,
    'pageNo': 1,
    'pageSize': 2,
    'a': [{
      'b': [
        { 'd': 3 },
        { 'f': 4 }
      ]
    }, {
      'c': [
        { 's': 2 },
        { 'sd': 3 }
      ]
    }],
    'data': [{
      'id': 1,
      'name': '杜平',
      'gender': 0,
      'age': 82,
      'money': 74.35,
      'bool': false,
      'title': '济做争许五',
      'email': 'e.whkgkdxfl@txjjtxlgy.kr',
      'ip': '161.221.11.233',
      'image': 'http://dummyimage.com/300x300/50B347/FFF.png&text=text',
      'cparagraph': '问任需分史话分认原办没示进发流国。离变历很采面消关其满格常办江传。',
      'time': '21:59:00',
      'date': '2014-08-16',
      'datetime': '2005-09-29 14:13:59',
      'now': '2020-05-22 23:41:57',
      'address': '黑龙江省 甘肃省 嘉峪关市 山西省 运城市 绛县'
    },
      {
        'id': 2,
        'name': '孙伟',
        'gender': 1,
        'age': 85,
        'money': 71.617,
        'bool': false,
        'title': '所已省九式',
        'email': 'e.vfjhwu@vpmrek.pe',
        'ip': '224.187.188.11',
        'image': 'http://dummyimage.com/300x300/50B347/FFF.png&text=text',
        'cparagraph': '万办关外领受心自级族织省团水。领月受位照压求也则始反素强。',
        'time': '06:56:11',
        'date': '2007-03-09',
        'datetime': '1978-03-17 18:08:32',
        'now': '2020-05-22 23:41:57',
        'address': '广东省 福建省 莆田市 甘肃省 平凉市 静宁县'
      }
    ]
  }
}

function deepClone (origin, target = {}) {
  for (const prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      if (origin[prop] !== 'null' && typeof (origin[prop]) === 'object') {
        if (Array.isArray(origin[prop])) {
          const key = prop + '|' + origin[prop].length
          target[key] = []
          console.info(origin[prop])
          origin[prop].length = 1
          deepClone(origin[prop], target[key])
        } else {
          target[prop] = {}
          deepClone(origin[prop], target[prop])
        }
      } else {
        target[prop] = origin[prop]
      }
    }
  }
  return target
}

const aa = deepClone(json, {})

console.dir(aa)
console.info(JSON.stringify(aa, null, 2))
