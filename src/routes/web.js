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
    const name = "java";
    const data = await findCourses(name);
    const datas = data.data.list;

    console.log(datas);
    // const data1 = datas[0].topics;
  });

  return app.use("/", router);
};

module.exports = initWebRoutes;
