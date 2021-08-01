import express from "express";
import homeController from "../controllers/homeController";
import {getCategories} from '../utils/categoryApi';
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
        // const data = await getCategories();
        const data = await getCourses();
        // return res.json(data.data.list);
        const datas= data.data.list;
        console.log(datas);
    })

    return app.use('/', router);
};

module.exports = initWebRoutes;