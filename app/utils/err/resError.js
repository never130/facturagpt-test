const resError = (res, status, message) => {
  res.status(status || 500).json({
    error: true,
    message
  })
}

module.exports = resError
