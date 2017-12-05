export default (req, res, next) => {
  if (req.populated) {
    return next(new Error('Do not populate twice.'))
  }

  next()
}
