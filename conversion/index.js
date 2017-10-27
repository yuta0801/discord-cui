const request = require('request')
const url = 'http://www.google.com/transliterate?langpair=ja-Hira|ja&text='
const table = require('./table')

function kana (s, n) {
  if (table[s]) return table[s][n]
  return s + table[''][n]
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
    if (error) throw error
    let msg = []
    JSON.parse(data).map(e => (msg += e[1][0]))
    callback(msg)
  })
}
