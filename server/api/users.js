const router = require('express').Router()
const { models: { User }} = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/profileImage', async(req, res, next)=> {
  try {
    const profileImageData = (await User.findByPk(req.params.id)).profileImageData;
    const data = profileImageData.replace(/^data:image\/(.*)?;base64,/,'');
    const extension = profileImageData.match(/^data:image\/(.*)?;base64,/,'');
    const buffer = Buffer.from(data, 'base64'); 
    res.writeHead(200, {
      'Content-Type': `image/${extension[1]}`,
      'Content-Length': buffer.length
    });
    res.end(buffer);

  }
  catch(ex){
    next(ex);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    await user.update({ profileImageData: req.body.profileImageData});
    res.send(user);
  } catch (err) {
    next(err)
  }
})
