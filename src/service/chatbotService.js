require('dotenv').config();
import request from "request";

let callSendAPI = async (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            }

            // Send the HTTP request to the Messenger Platform
            await sendTypingon(sender_psid);
            await MarkMessage(sender_psid);

            request({
                "uri": "https://graph.facebook.com/v10.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log(body);
                console.log(res)
                if (!err) {
                    resolve('message sent!')
                } else {
                    console.error("Unable to send message:" + err);
                }
            });

        } catch (e) {
            reject(e);
        }
    })


}

let sendTypingon = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v10.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingon sent!')
        } else {
            console.error("Unable to send sendTypingon:" + err);
        }
    });
}

let MarkMessage = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v10.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingon sent!')
        } else {
            console.error("Unable to send sendTypingon:" + err);
        }
    });
}

let getUserName = (sender_psid) => {

    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                body = JSON.parse(body);
                let username = `${body.last_name} ${body.first_name} `;
                resolve(username);
            } else {
                console.error("Unable to send message:" + err);
                reject(err);
            }
        });
    })
}

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = { "text": `Xin chào mừng ${username} đến với ABC Study Online` }

            let response2 = getStartedTemplate();
            //send text message
            await callSendAPI(sender_psid, response1);

            //send generic template message
            await callSendAPI(sender_psid, response2);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getStartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "ABC STUDY ONLINE",
                    "subtitle": "Dưới đây là các option",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tìm kiếm",
                            "payload": "COURSE_SEARCH",
                        },
                        {
                            "type": "postback",
                            "title": "Menu Khóa Học",
                            "payload": "COURSE_CATALOG",
                        }
                    ],
                }]
            }
        }
    };
    return response;
}
let handleSendCatalog = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getMainMenuTemplate();
            await callSendAPI(sender_psid, response1);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getMainMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "CATALOG SOURSE",
                    "subtitle": "Danh mục khóa học tại ABC Study Online",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Learn Web",
                            "payload": "LEARN_WEB",
                        },
                        {
                            "type": "postback",
                            "title": "Learn Mobile",
                            "payload": "LEARN_MOBILE",
                        },

                    ],
                },
                {
                    "title": "WEBSITE",
                    "subtitle": "Vui lòng truy cập đến website để biết thêm nhiều thông tin và ưu đãi",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Website",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_MAIN",
                        }

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleSendCatWeb = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getCatWeb();
            await callSendAPI(sender_psid, response1);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getCatWeb = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Javascript",
                    "subtitle": "Các bài giảng về Javascript",
                    "image_url": IMAGE_WEB_JS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_JAVASCRIPT",
                        },

                    ],
                },
                {
                    "title": "ReactJS",
                    "subtitle": "Các bài giảng về ReactJS",
                    "image_url": IMAGE_WEB_REACTJS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_REACTJS",
                        },

                    ],
                },
                {
                    "title": "NodeJS",
                    "subtitle": "Các bài giảng về NodeJS",
                    "image_url": IMAGE_WEB_NODEJS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_NODEJS",
                        },

                    ],
                },
                /* {
                    "title": "PHP",
                    "subtitle": "Các bài giảng về PHP",
                    "image_url": IMAGE_WEB_PHP,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_PHP",
                        },

                    ],
                },
                {
                    "title": "VueJS",
                    "subtitle": "Các bài giảng về VueJS",
                    "image_url": IMAGE_WEB_VUEJS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_VUEJS",
                        },

                    ],
                },
                {
                    "title": "Angular",
                    "subtitle": "Các bài giảng về Angular",
                    "image_url": IMAGE_WEB_ANGULAR,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_ANGULAR",
                        },

                    ],
                }, */
                {
                    "title": "Other",
                    "subtitle": "",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Truy cập web",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_CATALOG",
                        }

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleSendCatMobile = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getCatMobile();
            await callSendAPI(sender_psid, response1);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getCatMobile = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Android",
                    "subtitle": "Các bài giảng về Android",
                    "image_url": IMAGE_MOBILE_ANDROID,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_ANDROID",
                        },

                    ],
                },
                {
                    "title": "React Native",
                    "subtitle": "Các bài giảng về React Native",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_REACT_NATIVE",
                        },

                    ],
                },
                {
                    "title": "IOS",
                    "subtitle": "Các bài giảng về IOS",
                    "image_url": IMAGE_MOBILE_IOS,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_IOS",
                        },

                    ],
                },
                /* {
                    "title": "Flutter",
                    "subtitle": "Các bài giảng về Flutter",
                    "image_url": IMAGE_MOBILE_FLUTTER,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_FLUTTER",
                        },

                    ],
                },
                {
                    "title": "Kotlin",
                    "subtitle": "Các bài giảng về Kotlin",
                    "image_url": IMAGE_MOBILE_KOTLIN,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_KOTLIN",
                        },

                    ],
                },
                {
                    "title": "Swift",
                    "subtitle": "Các bài giảng về Swift",
                    "image_url": IMAGE_MOBILE_SWIFT,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_SWIFT",
                        },

                    ],
                }, */
                {
                    "title": "Other",
                    "subtitle": "",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Truy cập web",
                            "url": "https://demo-bot-chat.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_CATALOG",
                        }

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleBackCatalog = async (sender_psid) => {
    await handleSendCatalog(sender_psid);
}

let handleBackMain = async (sender_psid) => {
    let response2 = getStartedTemplate();
    await callSendAPI(sender_psid, response2);
}
let handleBackWeb = async (sender_psid) => {
    await handleSendCatWeb(sender_psid);
}

let handleBackMobile = async (sender_psid) => {
    await handleSendCatMobile(sender_psid);
}

module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendCatalog: handleSendCatalog,
    handleSendCatWeb: handleSendCatWeb,
    handleSendCatMobile: handleSendCatMobile,
    handleBackCatalog: handleBackCatalog,
    handleBackMain: handleBackMain,
    handleBackWeb: handleBackWeb,
    handleBackMobile: handleBackMobile,

}