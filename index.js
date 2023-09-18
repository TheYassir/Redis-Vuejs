const app = require('./app');

app.listen(app.get('port'), () => {
    console.log(
        `Server Listening on ${app.get('base_url')}:${app.get('port')}`
    );
});
