// Pas de try catch pour les promesses
exports.catchErrors = fn => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;

    next(err);
};

// Accept : 'application/json ou text/html
// En prod, on affiche moins d'erreur
exports.prodErrorsCollector = (err, req, res, next) => {
    const status = err.status || 500;
    console.log(err);
    res.format({
        // Si ejs on peut render
        // 'text/html': () => {
        //     res.render('error', { message: err.message });
        // },
        'application/json': () => {
            res.status(status).json({ message: "Un erreur s'est produite" });
        },
    });
};

// Cette fonction servira aussi à recueillir nos erreurs en developement
exports.devErrorsCollector = async (err, req, res, next) => {
    const status = err.status || 500;

    if (!res.headersSent) {
        return res.format({
            // 'text/html': () => {
            //     res.render('error', { message: err.message, stack: err.stack });
            // },
            'application/json': () => {
                res.status(status).json({
                    message: err.message,
                    stack: err.stack,
                });
            },
        });
    }
};
