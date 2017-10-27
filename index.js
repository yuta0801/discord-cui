#!/usr/bin/env node

const Discord = require('discord.js')
const client = new Discord.Client()
const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const Preferences = require('Preferences')
const convert = require('./conversion')

let current = []

clear()
console.log(chalk.yellow(figlet.textSync('Discord CUI', { horizontalLayout: 'full' })))

client.on('ready', () => {
  console.log(chalk.gray(`Logged in as ${client.user.tag}!`))
  current = ['dm', client.channels.get('342589429661171713')]
  listen()
})

client.on('message', message => {
  if (message.guild && current[1].guild && message.guild.id !== current[1].guild.id) return
  console.log(`${message.guild.name} #${message.channel.name} @${message.author.tag} ${message.content}`)
  listen()
})

getToken(token => client.login(token))

function getToken (callback) {
  const prefs = new Preferences('discord-cui')

  if (prefs.discord && prefs.discord.token) return callback(prefs.discord.token)

  inquirer.prompt({
    name: 'token',
    type: 'input',
    message: 'Enter your Discord user token:',
    validate: value => {
      if (value.length) return true
      else return 'Please enter your Discord user token:'
    }
  }).then(res => {
    prefs.discord = {
      token: res.token
    }
    callback(res.token)
  })
}

function listen () {
  inquirer.prompt({
    name: 'value',
    type: 'input',
    message: where().join(' ') + '>'
  }).then(res => {
    if (!res.value) listen()
    else if (res.value.startsWith('/')) command(res.value)
    else if (!current[1]) console.log(chalk.red('Channel is not selected.'))
    else convert(res.value, msg => current[1].send(`${msg} (\`${res.value}\`)`))
  })
}

function command (cmd) {
  const args = cmd.replace('/', '').split(' ')
  if (args[0] === 'sg') {
    const guilds = Array.from(client.guilds.values())
    guilds.unshift(...[{name: 'DM', type: 'dm'}, {name: 'Group', type: 'group'}])
    inquirer.prompt({
      name: 'guild',
      type: 'list',
      message: 'Select guild:',
      choices: guilds.map(e => ({name: e.name, value: e}))
    }).then(res => {
      current[0] = res.guild
      listen()
    })
  } else if (args[0] === 'sc') {
    if (!current[0]) {
      console.log(chalk.red('Server is not selected.'))
      return listen()
    }
    let choices = null
    if (current[0].type === 'group') {
      const channels = client.channels.filterArray(e => e.type === 'group')
      choices = channels.map(e => ({name: e.name || Array.from(e.recipients.values()).map(e => `@${e.tag}`).join(', '), value: e}))
    } else if (current[0].type === 'dm') {
      const channels = client.channels.filterArray(e => e.type === 'dm')
      choices = channels.map(e => ({name: '@' + e.recipient.username, value: e}))
    } else {
      const channels = current[0].channels.filterArray(e => e.type === 'text')
      choices = channels.map(e => ({name: '#' + e.name, value: e}))
    }
    inquirer.prompt({
      name: 'channel',
      type: 'list',
      message: 'Select channel:',
      choices: choices
    }).then(res => {
      current[1] = res.channel
      listen()
    })
  } else if (args[0] === 'exit') {
    process.exit()
  } else {
    console.log(chalk.red(args[0] + ' : Command not found'))
    listen()
  }
}

function where () {
  if (!current[0] && !current[1]) return false
  const guild = (typeof current[0] !== 'string') ? current[0].name : ''
  const channel = current[1]
  if (channel.type === 'text') return [guild, '#' + channel.name]
  else if (channel.type === 'dm') return ['DM', '@' + channel.recipient.username]
  else return ['Group', '@' + Array.from(channel.recipients.values()).join(', @')]
}
