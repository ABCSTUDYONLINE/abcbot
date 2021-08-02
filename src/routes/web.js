import express from "express";
import homeController from "../controllers/homeController";
import {getCategories} from '../utils/categoryApi';
import {getCourses} from '../utils/courseApi';
import {getTopics} from '../utils/topicApi';
import {getLessons} from '../utils/lessonApi';

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
        // const data = await getCourses();
        
        
        // return res.json(data.data.list);
        
        const topicId = "0b41ee69-1b46-471a-bd7c-746c8a50b785";
        // const courseId= payload.substring(14);
        // console.log(courseId);
        // const data = await getTopics(courseId);
        const data = await getLessons(topicId);
        const datas= data.data.list;
        let result = datas.filter(item =>{
            return item.topic.id === topicId;
        })
        console.log("////");
        console.log(result);
        const arr2 = result.map(e => {
            const item ={
                title: e.lessonName,
                subtitle: e.lessonDescription,
                image_url: e.videoLink
            }
            return item;
        })
        // return result;
        console.log("AAAAAA");
        console.log(arr2);
        
    })

    return app.use('/', router);
};

module.exports = initWebRoutes;