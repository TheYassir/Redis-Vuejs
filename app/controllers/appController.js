const client = require('../database/connexion');
const subscriber = client;
// * On clone ce client pour avoir un publisher
const publisher = client.duplicate();
publisher.connect();
let navigators = [];

const AppController = {
    index(req, res) {
        res.status(200).json({ message: 'API running' });
    },

    async test(req, res) {
        const pong = await client.ping();

        res.status(200).json({ message: { pong } });
    },

    async subscribeToEvents(req, res) {
        // TODO - Mettre en place le server-sent events
        // * Il faut envoyer les headers corrects au client pour qu'il accepte de maintenir la connexion ouverte

        // * Quand on teste le SSE en http 1/1, on ne peut avoir que 6 onglets de navigateur connectés en même temps
        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
        });

        // * Il faut enregistrer le client pour pouvoir lui envoyer le bon type d'évènement : on n'a qu'un évènement, donc on n'a pas besoin d'enregistrer l'évènement

        const navigatorId = Date.now();

        const navigator = {
            id: navigatorId,
            res,
        };

        // * Un tableau ne nous garantit pas quelle client va être unique : un Set serait mieux
        navigators.push(navigator);

        req.on('close', () => {
            // * Récupère les clients et on les filtre pour enlèver celui qui vient de se déconnecter

            navigators = navigators.filter(
                navigator => navigator.id != navigatorId
            );
        });

        // * On peut subscribe au PubSub
        await subscriber.subscribe('message', message => {
            // * On doit envoyer le message à chaque clients
            navigators.forEach(nav => {
                // * Respecter le format de données, sinon le navigateur n'accepte pas le message
                const mess = `data: ${JSON.stringify(message)}\n\n`;
                nav.res.write(mess);
            });
        });
    },

    async publishToEvents(req, res) {
        // TODO - Récupérer le message depuis la requête et le publier avec redis
        // * On valide les données qui viennent du formulaire
        const message = req.body.message;

        await publisher.publish('message', message);

        res.json({ message: 'Message publié' });
    },
};

module.exports = AppController;
