exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {

            await cb(req, res, next)

        } catch (err) {
            // new book error
            if (err.name === 'SequelizeValidationError') {
                //didnt find page error
                let newJson = []
                for (let i = 0; i < err.errors.length; i++) {newJson.push({"message":err.errors[i].message})}
                console.log(newJson)
                res.status(400).json(newJson).end()
            } else if (err.name === 'GlobalErrorHandler'){
                console.log('didnt find server')
                res.status(500).json(err.message).end()
            } else {
                next()
            }
        }
    }
}