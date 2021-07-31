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
        const data = await getCategories(1,7);
        // const data = await getCourses(0,1,7)
        // return res.json(data.data.list);
        const datas= data.data.list;
        for(let i = 0; i < datas.length-1; i++) {
            for(let j = 1; j < datas.length; j++) {
                if(datas[j].levelCategory === datas[i].levelCategory)
                    // console.log(j,datas[j]);
                    datas.splice(j,1);
            }
        }
        console.log(datas);
        // console.log(data.data.list);
        // const result = datas.map(data =>
        //     {
        //         console.log(data);
        //         return data;
        //     }
            
        // )
        // console.log(result);
        // return result;
        return datas;
    })

    return app.use('/', router);
};

module.exports = initWebRoutes;