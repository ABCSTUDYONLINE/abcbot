import express from "express";
import homeController from "../controllers/homeController";
import { getCategories } from "../utils/categoryApi";
import { getCourses, findCourses } from "../utils/courseApi";
import { getTopics } from "../utils/topicApi";
import { getLessons } from "../utils/lessonApi";

const router = express.Router();
const initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  //setup get started button, whitelisted domain
  router.post("/setup-profile", homeController.setupProfile);
  //setup persistent menu
  router.post("/setup-persistent-menu", homeController.setupPersistentMenu);
  router.post("/webhook", homeController.postWebhook);
  router.get("/webhook", homeController.getWebhook);
  router.get("/test", async (req, res) => {
    const data = await getCategories();
    const datas = data.data.list;
    // const data1 = datas[0].topics;
    console.log("DAY LA DATAS");
    console.log(datas);
    console.log("DAY LA DATA1");
    let data1 = [];
    for (let i = 0; i < datas.length; i++) {
      data1[i] = datas[i].levelCategory;
    }
    console.log(data1);
    console.log("DAY LA DATA2");
    let data2 = [];
    for (var i = 0; i < data1.length; i++) {
      if (data2.indexOf(data1[i]) === -1) {
        data2.push(data1[i]);
      }
    }
    console.log(data2);
  });

  return app.use("/", router);
};

module.exports = initWebRoutes;
