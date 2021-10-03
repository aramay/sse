const mesgCtrl = {};
const Messages = require('../models/MessageModel');

mesgCtrl.getMessages = async(req, res, next) => {
  try {
    const mesg = await Messages.find({});
    res.send(mesg);
  } catch(err) {
    return next({
      log: `getMessages ctrl ${err}`
    });
  }
};

mesgCtrl.postMessages = async(req, res, next) => {
  const newMesg = {
    message: req.body.message,
    password: req.body.password
  };

  try {
    const mesg = await Messages.create(newMesg);
    // res.send(mesg);
    res.locals.newMesg = mesg;
    next();
  } catch(err) {
    return next({
      log: `postMessage ctrl ${err}`
    });
  }
};

mesgCtrl.deleteMessage = async(req, res, next) => {
  
  const update = {
    _id: req.body._id,
    message: req.body.message
  };

  try {
    const mesg = await Messages.findById(req.body._id);
    // check if the cookie contains a pass 
    // that matches the password stored 
    // with the given message
    const result = await Messages.deleteOne({_id: req.body._id});
    //res  { n: 1, ok: 1, deletedCount: 1 }
    console.log('res ', result);
    
    res.locals.deleteMesg = result;
    res.status(200).json(res.locals.deleteMesg);
  } catch (err) {
    return next({
      log: `Error in deleteMessage ${err}`
    });
  }
};

module.exports = {
  mesgCtrl
};