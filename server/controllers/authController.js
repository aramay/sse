const authCtrl = {}

authCtrl.setCookie = (req, res, next) => {
  const { _id } = res.locals.newMesg
  console.log('cookie _id, ', _id)
  console.log('res.locals', res.locals)

  // SET Cookie
  res.cookie('pass', _id, {httpOnly: true})
  next()
}

authCtrl.verifyCookie = (req, res, next) => {
  console.log('verifyCookie ctrl')

  if (req.body._id === req.cookies.pass) {
    next()
  } else {
    res.status(404).send('Authentication failed')
  }
}

module.exports = {
  authCtrl
}
