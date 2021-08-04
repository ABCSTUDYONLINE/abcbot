require("dotenv").config();
import request from "request";
import chatbotService from "../service/chatbotService";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};

let postWebhook = (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

// Handles messages events
async function handleMessage(sender_psid, received_message) {
  let response;
  //check message quick reply
  if (received_message.quick_reply && received_message.quick_reply.payload) {
    if (received_message.quick_reply.payload === "COURSE_SEARCH") {
      await chatbotService.handleSeachCourses(sender_psid);
      return;
    }
    if (received_message.quick_reply.payload === "COURSE_CATALOG") {
      await chatbotService.handleSendCatalog(sender_psid);
      return;
    }
    if (received_message.quick_reply.payload.includes("CATEGORY_")) {
      const category = received_message.quick_reply.payload.substring(9);
      await chatbotService.handleSendSubCategory(sender_psid, category);
      return;
    }
  }
  // Checks if the message contains text
  if (received_message.text) {
    //feature search course with name
    let name = received_message.text;
    if (name) {
      await chatbotService.handleSearchCourse(sender_psid, name);
      return;
    } else {
      await chatbotService.handleSearchNotFound(sender_psid);
      await chatbotService.handleGetStarted(sender_psid);
      return;
    }
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  // Get the payload for the postback
  let payload = received_postback.payload;

  if (payload.includes("COURSES_DETAIL_")) {
    const courseId = payload.substring(15);
    await chatbotService.handleSendCourses(sender_psid, courseId);
    return;
  }
  if (payload.includes("TOPICS_DETAIL_")) {
    const courseId = payload.substring(14);
    await chatbotService.handleSendTopic(sender_psid, courseId);
    return;
  }
  if (payload.includes("LESSONS_DETAIL_")) {
    const topicId = payload.substring(15);
    await chatbotService.handleSendLesson(sender_psid, topicId);
    return;
  }
  let response;
  // Set the response based on the postback payload
  switch (payload) {
    case "BOT_RESTART":
    case "GET_STARTED":
      await chatbotService.handleGetStarted(sender_psid);
      break;

    case "COURSE_CATALOG":
      await chatbotService.handleSendCatalog(sender_psid);
      break;
    case "COURSE_SEARCH":
      await chatbotService.handleSendText(sender_psid);
      break;
    default:
      // code block
      response = {
        text: `oop! I don't know  response with Postback ${payload}`,
      };
  }

  // Send the message to acknowledge the postback
  //callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

let setupProfile = async (req, res) => {
  //call profile facebook api
  // Construct the message body
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://abcchatbot.herokuapp.com/"],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      uri: `https://graph.facebook.com/v10.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("setup profile succeeds!");
      } else {
        console.error("Unable to setup profile:" + err);
      }
    }
  );

  return res.send("Setup profile succeed!");
};

let setupPersistentMenu = async (req, res) => {
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "postback",
            title: "Tìm kiếm khóa học",
            payload: "COURSE_SEARCH",
          },
          {
            type: "postback",
            title: "Danh mục Khóa Học",
            payload: "COURSE_CATALOG",
          },
          {
            type: "postback",
            title: "Khởi động lại bot",
            payload: "BOT_RESTART",
          },
        ],
      },
    ],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      uri: `https://graph.facebook.com/v10.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("setup persistent menu succeeds!");
      } else {
        console.error("Unable to setup persistent menu:" + err);
      }
    }
  );

  return res.send("Setup profile succeed!");
};
module.exports = {
  getHomePage: getHomePage,
  postWebhook: postWebhook,
  getWebhook: getWebhook,
  setupProfile: setupProfile,
  setupPersistentMenu: setupPersistentMenu,
};
