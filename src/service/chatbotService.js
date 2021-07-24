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

module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendCatalog: handleSendCatalog,
}