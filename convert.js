const request = require('request')
const url = 'http://www.google.com/transliterate?langpair=ja-Hira|ja&text='

const TABLE = {
  '':  ['あ',   'い',   'う',   'え',   'お'  ],
  'k': ['か',   'き',   'く',   'け',   'こ'  ],
  's': ['さ',   'し',   'す',   'せ',   'そ'  ],
  't': ['た',   'ち',   'つ',   'て',   'と'  ],
  'n': ['な',   'に',   'ぬ',   'ね',   'の'  ],
  'h': ['は',   'ひ',   'ふ',   'へ',   'ほ'  ],
  'm': ['ま',   'み',   'む',   'め',   'も'  ],
  'y': ['や',   'い',   'ゆ',   'いぇ', 'よ'  ],
  'r': ['ら',   'り',   'る',   'れ',   'ろ'  ],
  'w': ['わ',   'うぃ', 'う',   'うぇ', 'を'  ],
  'g': ['が',   'ぎ',   'ぐ',   'げ',   'ご'  ],
  'z': ['ざ',   'じ',   'ず',   'ぜ',   'ぞ'  ],
  'j': ['じゃ', 'じ',   'じゅ', 'じぇ', 'じょ'],
  'd': ['だ',   'ぢ',   'づ',   'で',   'ど'  ],
  'b': ['ば',   'び',   'ぶ',   'べ',   'ぼ'  ],
  'p': ['ぱ',   'ぴ',   'ぷ',   'ぺ',   'ぽ'  ],
  'gy': ['ぎゃ', 'ぎぃ', 'ぎゅ', 'ぎぇ', 'ぎょ'],
  'gw': ['ぐぁ', 'ぐぃ', 'ぐぅ', 'ぐぇ', 'ぐぉ'],
  'zy': ['じゃ', 'じぃ', 'じゅ', 'じぇ', 'じょ'],
  'jy': ['じゃ', 'じぃ', 'じゅ', 'じぇ', 'じょ'],
  'dy': ['ぢゃ', 'ぢぃ', 'ぢゅ', 'ぢぇ', 'ぢょ'],
  'dh': ['でゃ', 'でぃ', 'でゅ', 'でぇ', 'でょ'],
  'dw': ['どぁ', 'どぃ', 'どぅ', 'どぇ', 'どぉ'],
  'by': ['びゃ', 'びぃ', 'びゅ', 'びぇ', 'びょ'],
  'py': ['ぴゃ', 'ぴぃ', 'ぴゅ', 'ぴぇ', 'ぴょ'],
  'v':  ['ヴぁ', 'ヴぃ', 'ヴ',   'ヴぇ', 'ヴぉ'],
  'vy': ['ヴゃ', 'ヴぃ', 'ヴゅ', 'ヴぇ', 'ヴょ'],
  'sh': ['しゃ', 'し',   'しゅ', 'しぇ', 'しょ'],
  'sy': ['しゃ', 'し',   'しゅ', 'しぇ', 'しょ'],
  'c':  ['か',   'し',   'く',   'せ',   'こ'  ],
  'ch': ['ちゃ', 'ち',   'ちゅ', 'ちぇ', 'ちょ'],
  'cy': ['ちゃ', 'ち',   'ちゅ', 'ちぇ', 'ちょ'],
  'f':  ['ふぁ', 'ふぃ', 'ふ',   'ふぇ', 'ふぉ'],
  'fy': ['ふゃ', 'ふぃ', 'ふゅ', 'ふぇ', 'ふょ'],
  'fw': ['ふぁ', 'ふぃ', 'ふ',   'ふぇ', 'ふぉ'],
  'q':  ['くぁ', 'くぃ', 'く',   'くぇ', 'くぉ'],
  'ky': ['きゃ', 'きぃ', 'きゅ', 'きぇ', 'きょ'],
  'kw': ['くぁ', 'くぃ', 'く',   'くぇ', 'くぉ'],
  'ty': ['ちゃ', 'ちぃ', 'ちゅ', 'ちぇ', 'ちょ'],
  'ts': ['つぁ', 'つぃ', 'つ',   'つぇ', 'つぉ'],
  'th': ['てゃ', 'てぃ', 'てゅ', 'てぇ', 'てょ'],
  'tw': ['とぁ', 'とぃ', 'とぅ', 'とぇ', 'とぉ'],
  'ny': ['にゃ', 'にぃ', 'にゅ', 'にぇ', 'にょ'],
  'hy': ['ひゃ', 'ひぃ', 'ひゅ', 'ひぇ', 'ひょ'],
  'my': ['みゃ', 'みぃ', 'みゅ', 'みぇ', 'みょ'],
  'ry': ['りゃ', 'りぃ', 'りゅ', 'りぇ', 'りょ'],
  'l':  ['ぁ',   'ぃ',   'ぅ',   'ぇ',   'ぉ'  ],
  'x':  ['ぁ',   'ぃ',   'ぅ',   'ぇ',   'ぉ'  ],
  'ly': ['ゃ',   'ぃ',   'ゅ',   'ぇ',   'ょ'  ],
  'lt': ['た',   'ち',   'っ',   'て',   'と'  ],
  'lk': ['ヵ',   'き',   'く',   'ヶ',   'こ'  ],
  'xy': ['ゃ',   'ぃ',   'ゅ',   'ぇ',   'ょ'  ],
  'xt': ['た',   'ち',   'っ',   'て',   'と'  ],
  'xk': ['ヵ',   'き',   'く',   'ヶ',   'こ'  ],
  'wy': ['わ',   'ゐ',   'う',   'ゑ',   'を'  ],
  'wh': ['うぁ', 'うぃ', 'う',   'うぇ', 'うぉ'],
}

function kana(s, n) {
  if (TABLE[s]) return TABLE[s][n]
  return s + TABLE[''][n]
}

module.exports = (str, callback) => {
  let last = ''
  const line = []

  for (const tmp of str) {
    if (tmp === 'a') {
      line.push(kana(last, 0))
      last = ''
    } else if (tmp === 'i') {
      line.push(kana(last, 1))
      last = ''
    } else if (tmp === 'u') {
      line.push(kana(last, 2))
      last = ''
    } else if (tmp === 'e') {
      line.push(kana(last, 3))
      last = ''
    } else if (tmp === 'o') {
      line.push(kana(last, 4))
      last = ''
    } else {
      if (last === 'n' && tmp !== 'y') {
        line.push('ん')
        last = ''
        if (tmp === 'n') continue
      }
      if (/[a-zA-Z]/.test(tmp)) {
        if (/[A-Z]/.test(tmp)) {
          line.push(last + tmp)
          last = ''
        } else if (last === tmp) {
          line.push('っ')
        } else {
          last = last + tmp
        }
      } else {
        if (tmp === '-') line.push(last + 'ー')
        else if (tmp === '.') line.push(last + '。')
        else if (tmp === ',') line.push(last + '、')
        else if (tmp === '?') line.push(last + '？')
        else if (tmp === '!') line.push(last + '！')
        else if (tmp === '[') line.push(last + '「')
        else if (tmp === ']') line.push(last + '」')
        else if (tmp === '<') line.push(last + '＜')
        else if (tmp === '>') line.push(last + '＞')
        else if (tmp === '&') line.push(last + '＆')
        else if (tmp === '"') line.push(last + '”')
        else if (tmp === ' ') line.push(last + ',')
        else if (tmp === '(' || tmp === ')') line.push(last)
        else line.push(last + tmp)
        last = ''
      }
    }
  }
  line.push(last)

  request(url + encodeURIComponent(line.join('')), (error, res, data) => {
    let msg = []
    JSON.parse(data).map(e => msg += e[1][0])
    callback(msg)
  })
}
