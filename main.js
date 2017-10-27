const Discord = require('discord.js')
const client = new Discord.Client()
const convert = require('./convert')
const readline = require('readline')
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let log = 'guild'
let guilds = []
let channels = []
const status = ['online', 'idle', 'invisible', 'dnd']
const current = ['dm', '342589429661171713']

reader.on('line', line => {
  if (line.startsWith('/')) {
    const args = line.replace('/', '').split(' ')

    if (args[0] === 'gl') {
      // Guilds List
      const guild = Array.from(client.guilds.values())
      guilds = ['dm', 'group', ...guild.map(e => e.id)]
      console.log(`ギルド一覧\nDM (0)\nDMGroup (1)\n${guild.map((e, i) => `${e.name} (${i+2})`).join('\n')}`)
    } else if (args[0] === 'sg') {
      // Select Guild
      if (!guilds.length) return console.log('/gl を先に実行してください')
      if (isNaN(args[1])) return console.log(args[1], ' : 引数が数値ではありません')
      current[0] = guilds[args[1]]
      if (args[1] !== '0', args[1] !== '1') current[1] = client.guilds.get(guilds[args[1]]).defaultChannel.id
      console.log(where(), 'に移動しました。ここで警告が出る場合は無視してください')
    } else if (args[0] === 'cl') {
      // Channels List
      if (current[0] === 'group') {
        const group = client.channels.filterArray(e => e.type === 'group')
        console.log(`チャンネル一覧\n${group.map((e, i) => e.name || `[${Array.from(e.recipients.values()).map(e => `@${e.tag}`).join(', ')}]` + ` (${i}) [${e.id}]`).join(',\n')}`)
      } else if (current[0] === 'dm') {
        const dm = client.channels.filterArray(e => e.type === 'dm')
        console.log(`チャンネル一覧\n${dm.map((e, i) => `${e.recipient.tag} (${i})`).join(',\n')}`)
      } else {
        const channel = Array.from(client.guilds.get(current[0]).channels.values())
        channels = channel.map(e => e.id)
        console.log(`チャンネル一覧\n${channel.map((e, i) => `${e.name} (${i})`).join(',\n')}`)
      }
    } else if (args[0] === 'sc') {
      // Select Channel
      if (!channels.length) return console.log('/cl を先に実行してください')
      if (isNaN(args[1])) return console.log(args[1], ' : 引数が数値ではありません')
      current[1] = channels[args[1]]
      console.log(where(), 'に移動しました')
    } else if (args[0] === 'here') console.log(where()) // Here
    else if (args[0] === 'status') {
      if (!status[args[1]]) return console.log(args[1], '引数が正しくありません')
      client.user.setStatus(status[args[1]])
    } else if (args[0] === 'logs') {
      if (!['off', 'all', 'channel'].includes(args[1]))
        return console.log(args[1], '引数が正しくありません')
      log = args[1]
    } else console.log(args[0], ' : コマンドが見つかりません')
  } else {
    // Say
    if (current[1]) convert(line, message => client.channels.get(current[1]).send(`${message} (\`${line}\`)`))
    else console.log('チャンネルが設定されていません')
  }
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', message => {
  if (log === 'off') return
  if (log === 'channel' && current[1] !== message.channel.id) return
  console.log(`#${message.channel.name} @${message.author.tag} ${message.content}`)
})

client.login('')

function where() {
  const guild = (current[0].length > 5) ? client.guilds.get(current[0]).name : current[0]
  const channel = client.channels.get(current[1])
  if (channel.type === 'text') return `[${guild}] [#${channel.name}]`
  else if (channel.type === 'dm') return `[${guild}] [@${channel.recipient.tag}]`
  else return `[${guild}] [@${Array.from(channel.recipients.values()).join(', @')}]`
}
