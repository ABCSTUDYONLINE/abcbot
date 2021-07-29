import express from "express";
import homeController from "../controllers/homeController";
import {getCategories} from '../utils/categoreApi';

let router = express.Router();
let initWebRoutes = (app) => {

    router.get("/", homeController.getHomePage);

    //setup get started button, whitelisted domain
    router.post('/setup-profile', homeController.setupProfile);
    //setup persistent menu
    router.post('/setup-persistent-menu', homeController.setupPersistentMenu);
    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook);
    router.get('/test', async (req, res) => {
        const data = await getCategories(1,7);
        return res.json(data);
    })

    return app.use('/', router);
};

module.exports = initWebRoutes;