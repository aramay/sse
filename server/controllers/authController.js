const authCtrl = {};

authCtrl.setCookie = (req, res, next) => {
  const { _id } = res.locals.newMesg;
  console.log('cookie _id, ', _id);
  res.cookie('pass', _id,{httpOnly :true});
  // res.send('cookie ctrl');
  res.status(200).json(res.locals.newMesg);
};

authCtrl.verifyCookie = (req, res, next) => {
  
  console.log('verifyCookie ctrl');
  
  const update = {
    _id: req.body._id,
    message: req.body.message
  };
  
  if(req.body._id === req.cookies.pass) {
    next();
  }
  else {
    res.status(404).send('Authentication failed');
  }
};

module.exports = {
  authCtrl
};