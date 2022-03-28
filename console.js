const fs = require('fs')

const requestProxy = require("request").defaults({
  proxy: "http://127.0.0.1:7890",
  rejectUnauthorized: false,
})

const login_url = 'https://discord.com/api/v9/auth/login'
const typing_url = 'https://discord.com/api/v9/channels/_id/typing'
const messages_url = 'https://discord.com/api/v9/channels/_id/messages'
const query_url = 'https://discord.com/api/v9/channels/_id/messages?limit=2'
const logout_url = 'https://discord.com/api/v9/auth/logout'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
const MAGIC = 890383850297884672

async function main() {
  
  if (process.argv.length < 4) {
    console.log('node console.js password|- secret')
    return
  }

  let password1 = process.argv[2]
  let secret = process.argv[3].split(' ')
  console.log(secret)
  
  let list = fs.readFileSync('console.txt')
  let lines = list.toString().split('\n')
  let length = lines.length
  let a = []
  // mess up the order
  while (a.length < length) {
    let index = Math.floor(Math.random() * length)
    if (!a.includes(index)) a.push(index)
  }

  for (let index in lines) {
    let line = lines[a[index]]
    console.log(++index)
    if (line.startsWith('#')) continue
    let arr = line.split('|')
    if (arr.length != 3) continue
    let user = arr[0]
    let password = arr[1]
    let command_channel_id = arr[2]
    if (password == '*') {
      if (password1 == '-') {
        console.log('bad password')
        continue
      }
      password = password1
    }

    try {
      if (!await worker(user, password, command_channel_id, secret)) {
        console.log('error')
        break
      }
    } catch (err) {
      console.log(err)
    }

  }
}

async function worker(user, password, command_channel_id, secret) {
  
  let headers = {
    'user-agent': user_agent,
  }

  let params = {
    "login": user,
    "password": password,
    "undelete": false,
    "captcha_key": null,
    "login_source": null,
    "gift_code_sku_id": null
  }

  console.log('login ' + user)
  let body = await synchronous_request('POST', login_url, params, headers)
  if (body.captcha_key != undefined) {
    console.log(body.captcha_key + '\n')
    
    return false
  }
  
  let token = body.token
  if (token == undefined) {
    console.log('login failed\n')

    return false
  }

  headers['authorization'] = token

  let _typing_url = typing_url.replace('_id', command_channel_id)
  let resp = await synchronous_request('POST', _typing_url, undefined, headers)
  
  await sleep(5000)
  
  for (let sec of secret) {
    console.log('send message -> ' + sec)
    let _messages_url = messages_url.replace('_id', command_channel_id)
    let nonce = MAGIC + new Date().getTime() + Math.floor(Math.random() * 65535)
    params = {
      "content": sec,
      "nonce": nonce.toString(),
      "tts": false
    }

    let now = new Date().getTime()
    
    resp = await synchronous_request('POST', _messages_url, params, headers)

    await sleep(3000)

    if (!await query_response(now, headers, command_channel_id)) return false
  }
  
  console.log('logout\n')
  params = {
    "provider": null,
    "voip_provider": null
  }

  try {
    await synchronous_request('POST', logout_url, params, headers)
  } catch (err) {
    //
  }

  return true
} 

async function query_response(now, headers, command_channel_id) {
  let i = 0
  while (i < 3) {
    await sleep(4000)

    let _query_url = query_url.replace('_id', command_channel_id)
    let resp = await synchronous_request('GET', _query_url, undefined, headers)
    let o = JSON.parse(resp)
    let now1 = new Date(o[0].timestamp).getTime()
    if (now1 > now) {
      return true
    }
    
    i++
  }

  console.log('failed to get response')

  return false
}

// helper methods
let synchronous_request = function (method, url, params, headers) {

  let options = {
    url: url,
  }

  if (method == 'GET') {
    if (params != undefined) {
      options['form'] = params
    }
    if (headers != undefined) {
      options['headers'] = headers
    }
    
    return new Promise(function (resolve, reject) {
      // If you don't use proxy, require("request").get(...) is ok
      // require("request").get(options, function (error, response, body) {
      requestProxy.get(options, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
  } else {
    if (params != undefined) {
      options['json'] = params
    }
    if (headers != undefined) {
      options['headers'] = headers
    }

    return new Promise(function (resolve, reject) {
      // require("request").post(options, function (error, response, body) {
      requestProxy.post(options, function (error, response, body) {
        if (error) {
            reject(error)
        } else {
            resolve(body)
        }
      })
    })
  }
}

main()

