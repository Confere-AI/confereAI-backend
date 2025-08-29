
function errorMiddleware(err, req, res, next) {
    console.error(err.stack);
    const env = req.app.get('env');
    const status = err.status || 500;

    if (env === 'development') {
        res.status(status).json({
            message: err.message,
            error: err
        });
    } else if (status === 404) {
        res.status(404).json({
            message: 'Not Found',
            error: {}
        });
    } else if (status === 400) {
        res.status(400).json({
            message: 'Bad Request',
            error: {}
        });
    } else if (status === 401) {
        res.status(401).json({
            message: 'Unauthorized',
            error: {}
        });
    } else {
        res.status(status).json({
            message: err.message || 'Internal Server Error',
            error: {}
        });
    }
    next();
}
module.exports = errorMiddleware;