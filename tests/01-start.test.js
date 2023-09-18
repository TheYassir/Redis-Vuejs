require('dotenv').config();
const { createRequest, createResponse } = require('node-mocks-http');
const { request } = require('../app');
const appController = require('../app/controllers/appController');
const client = require('../app/database/connexion');

afterAll(async () => {
    await client.quit();
});

describe('Should return an ok json message and a 200 status code', () => {
    //
    let controller;
    let request;
    let response;

    beforeEach(() => {
        controller = appController;

        response = createResponse();
    });

    it('appcontroller should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return HTTP response code 200', () => {
        // On 'mock' la requête
        request = createRequest({
            method: 'GET',
            url: '/api',
        });

        // On simule la requête
        controller.index(request, response);

        expect(response._getStatusCode()).toBe(200);
    });

    it('should return the correct json message', () => {
        request = createRequest({
            method: 'GET',
            url: '/api',
        });

        controller.index(request, response);

        expect(response._getJSONData()).toMatchObject({
            message: expect.any(String),
        });
    });
});
