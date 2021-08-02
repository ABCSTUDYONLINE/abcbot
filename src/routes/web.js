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
        
        // const data = await getLessons(topicId);
        // return res.json(data.data.list);
        
        const payload = "TOPICS_DETAIL_8ecb41e5-39b0-48e3-897c-7042303a6217";
        const courseId= payload.substring(14);
        console.log(courseId);
        const data = await getTopics(courseId);
        const datas= data.data.list;
        let result = datas.filter(item =>{
            return item.course.id === courseId;
        })
        console.log("////");
        console.log(result);
        const arr2 = result.map(e => {
            const item ={
                title: e.topicName,
                // subtitle: e.shortCourseDescription,
                image_url: e.course.courseImageLink,
                buttons:[
                    {
                        type: "postback",
                        title: "Xem chi tiết",
                        payload: `LESSONS_DETAIL_${e.id}`,
                    }
                ]
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