exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {

            await cb(req, res, next);

        } catch (err) {
            // new book error
            if (err.name === 'SequelizeValidationError') {
                //didnt find page error
                res.status(400).json(`ERROR:`+ err.message).end()
            } else if (err.name === 'GlobalErrorHandler'){
                console.log('didnt find server')
                res.status(500).json(`ERROR:`+ err.message).end()
            } else {
                next()
            }
        }
    }
}