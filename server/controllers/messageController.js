const mesgCtrl = {}
const Messages = require('../models/MessageModel')

let temp = {}
let globalVersion = 0

mesgCtrl.getMessages = async(req, res, next) => {
  try {
    const mesg = await Messages.find({})
    res.send(mesg)
  } catch (err) {
    return next({
      log: `getMessages ctrl ${err}`
    })
  }
}

mesgCtrl.postMessages = async(req, res, next) => {
  const newMesg = {
    message: req.body.message,
    password: req.body.password
  }

  try {
    const mesg = await Messages.create(newMesg)
    // res.send(mesg);
    res.locals.newMesg = mesg
    // hold new mesg in temp var
    temp = mesg
    globalVersion += 1
    console.log('globalVersion ', globalVersion)
    // next();
    res.status(200).json(res.locals.newMesg)
  } catch (err) {
    return next({
      log: `postMessage ctrl ${err}`
    })
  }
}

mesgCtrl.sse = (req, res, next) => {
  console.log('res.temp in sse BE', temp)
  let localVersion = 0
  console.log('localVersion ', localVersion)
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  })

  setInterval(() => {
    // res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`)
    if (localVersion < globalVersion) {
      res.status(200).write(`data: ${JSON.stringify(temp)}\n\n`)
      localVersion = globalVersion
    }
  }, 1000)
  // set temp storage to default value
  temp = {}
  res.status(200).write(`data: outside interval\n\n`)
}

mesgCtrl.deleteMessage = async(req, res, next) => {
  const update = {
    _id: req.body._id,
    message: req.body.message
  }

  try {
    const mesg = await Messages.findById(req.body._id)
    // check if the cookie contains a pass
    // that matches the password stored
    // with the given message
    const result = await Messages.deleteOne({_id: req.body._id})
    // res  { n: 1, ok: 1, deletedCount: 1 }
    console.log('res ', result)

    res.locals.deleteMesg = result
    res.status(200).json(res.locals.deleteMesg)
  } catch (err) {
    return next({
      log: `Error in deleteMessage ${err}`
    })
  }
}

module.exports = {
  mesgCtrl
}
