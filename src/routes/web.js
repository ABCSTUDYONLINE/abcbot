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
        const data = await getCategories();
        // const data = await getCourses();
        // return res.json(data.data.list);
        const datas= data.data.list;
        const arr = "CATEGORY_web";
        const arr1= arr.substring(9);
        console.log(arr1);
        let result = datas.map(e=>{
            if(e.levelCategory === arr1){
                const item ={
                        "title": e.categoryName,
                        "subtitle": `Các khoá học về ${e.categoryName}`,
                        // "image_url": IMAGE_WEB_JS,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Xem chi tiết",
                                "payload": `COURSES_DETAIL_${e.id}`,
                            },

                        ],
                };
                return item;
            }
        })
        // return result;
        console.log(datas);
        console.log("////");
        console.log(result);
    })

    return app.use('/', router);
};

module.exports = initWebRoutes;