import express from "express";
import homeController from "../controllers/homeController";
import {getCategories} from '../utils/categoreApi';
import {getCourses} from '../utils/courseApi';

const router = express.Router();
const initWebRoutes = (app) => {

    router.get("/", homeController.getHomePage);

    //setup get started button, whitelisted domain
    router.post('/setup-profile', homeController.setupProfile);
    //setup persistent menu
    router.post('/setup-persistent-menu', homeController.setupPersistentMenu);
    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook);
    router.get('/test', async (req, res) => {
        const data = await getCategories(1,7);
        // const data = await getCourses(0,1,7)
        return res.json(data.data.list);
    })

    return app.use('/', router);
};

module.exports = initWebRoutes;