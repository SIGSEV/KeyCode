export default (req, res, next) => {
  if (!req.body.score || !req.body.wpm || !req.body.log) {
    return next(new Error('Prevented saving noob score.'))
  }

  req.user.populated = true

  next()
}
