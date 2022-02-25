const Auth = require('./auth-model')

function checkPayload (req, res, next) {
  const { username, password } = req.body

  if (!username || !password) {
    next({
      status: 422,
      message: 'username and password required'
    })
  } else {
    next()
  }
}

async function checkUsernameFree (req, res, next) {
  try {
    const users = await Auth.findBy(req.body.username)
    if (!users.length) {
      next()
    } else {
      next({
        status: 422,
        message: 'username taken'
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkPayload,
  checkUsernameFree
}