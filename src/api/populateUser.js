export default (req, res, next) => {
  if (req.user && req.user.populated) {
    return next(new Error('Do not populate twice.'))
  }

  req.user.populated = true

  next()
}
