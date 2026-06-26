const asyncHandler = (requestHandlres) => {
    return (req, res, next) => {
        Promise.resolve(requestHandlres(req, res, next))
            .catch((err) => next(err))
    }
}

export {asyncHandler}