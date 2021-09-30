const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res) => {
  if (err.isOperation) {
    return res.status(err.statusCode).json({
      status: false,
      error: err.message,
    })
  } else {
    console.error("ERROR ", err)
    return res.status(500).json({
      status: false,
      error: "Something went very wrong!",
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res)
  }
}
