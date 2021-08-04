import express from "express";
import homeController from "../controllers/homeController";
import {getCategories} from '../utils/categoryApi';
import {getCourses,findCourses} from '../utils/courseApi';
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
        
        const name = "java";
        const data = await findCourses(name);
        const datas = data.data.list;
        // const data1 = datas[0].topics;
        
        console.log("DAY LA DATAS");
        console.log(datas);
        // console.log(data1);
        // const arr = datas.map(e => {
        //     const item = {
        //         title: e.courseName,
        //     }
        //     return item;
        // })
        // console.log(datas);
        // console.log("DAY LA LIST TOPICS");
        // let data2=[];
        
        // for (let i = 0; i < datas.length; i++) {
        //     console.log(datas[i].courseName);
        //     data2 = datas[i].topics;

        // }

        // console.log(data2);
        // console.log("DAY LA LIST LESSONS");
        // let data3=[];
        // let id_topic="8c56faf4-ad41-4f46-87ca-ef9a0be62953";
        // for(let i = 0;i<data2.length; i++){
        //     if(data2[i].id === id_topic) {
        //         console.log(data2[i].topicName);
        //         data3=data2[i].lessons
        //     }
            
        // }
        // console.log(data3);
        
        
        
    })

    return app.use('/', router);
};

module.exports = initWebRoutes;