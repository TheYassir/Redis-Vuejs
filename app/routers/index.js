const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const { catchErrors } = require('../../handlers/errorHandlers');

router.get('/', appController.index);

router.get('/test', catchErrors(appController.test));

/**
 * @route get /api/subscribe SSE
 */
router.get('/subscribe', catchErrors(appController.subscribeToEvents));

/**
 * @route POST /api/publish
 */
router.post('/publish', catchErrors(appController.publishToEvents));

module.exports = router;
