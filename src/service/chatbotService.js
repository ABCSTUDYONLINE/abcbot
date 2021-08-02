require('dotenv').config();
import request from "request";
import API from "../utils/api";
import {getCategories} from '../utils/categoryApi';
import {getCourses,findCourses} from '../utils/courseApi';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = 'https://media4.giphy.com/media/OK914NO5d8ey9sSNAQ/giphy.gif';
const IMAGE_SUB_CATEGORY = 'https://bit.ly/subcategory';


const IMAGE_WEB_REACTJS = 'http://bit.ly/bot_reactjs';
const IMAGE_WEB_NODEJS = 'http://bit.ly/bot_nodejs';


const IMAGE_MOBILE_ANDROID = 'http://bit.ly/bot_android';
const IMAGE_MOBILE_REACTNATIVE = 'http://bit.ly/bot_reactnative';
const IMAGE_MOBILE_IOS = 'http://bit.ly/bot-ios-1';



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
            let response1 = { "text": `Xin chào mừng ${username} đến với ABCStudy Online` }
            let response2 = await getSendGif();
            let response3 = await getStartedTemplate();
            //send text message
            await callSendAPI(sender_psid, response1);
            //send a gif
            await callSendAPI(sender_psid, response2);
            //send quick reply
            await callSendAPI(sender_psid, response3);


            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getSendGif = () => {
    let response = {
        "attachment": {
            "type": "image",
            "payload":{
                "url" : IMAGE_GET_STARTED,
                "is_reusable": true
            }
        }
    }
    return response;
}
let getStartedTemplate = () => {
    let response = {
        "text": "Vui lòng chọn chức năng!!",
        "quick_replies":[
            {
                "content_type":"text",
                "title":"Tìm kiếm khóa học",
                "payload":"COURSE_SEARCH",
            },
            {
                "content_type":"text",
                "title":"Danh mục khóa học",
                "payload":"COURSE_CATALOG",
            }
        ]
    };
    return response;
}

let handleSendCatalog = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getMainMenuTemplate();
            await callSendAPI(sender_psid, response1);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

function Catalog(arr) {
    var newArr = [...arr];
    for(let i = 0; i < newArr.length-1; i++) {
        for(let j = 1; j < newArr.length; j++) {
            if(newArr[j].levelCategory === newArr[i].levelCategory)
                newArr.splice(j,1);
        }
    }
    return newArr
}
function toUpper(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(Word) {
            console.log("First capital letter: "+Word[0]);
            console.log("remain letters: "+ Word.substr(1));
            return Word[0].toUpperCase() + Word.substr(1);
        })
        .join(' ');
}
let dataCategory = async () => {
    try {
        const res = await getCategories();
        const datas = res.data.list;
        const catalog = Catalog(datas);
        const result = catalog.map( (e) => {
            const item = {
                content_type: 'text',
                title: toUpper(e.levelCategory +" " +"Development"),
                payload: `CATEGORY_${e.levelCategory}`
            };
            return item;
        });
        return result;
    } catch (error) {
        console.log(error);
    }
    
}

let getMainMenuTemplate = async () => {
    const result1 = await dataCategory();
    let response = {
        text: 'Vui lòng chọn danh mục khóa học?',
        quick_replies: result1,
    };
    return response;
}

let handleSendSubCategory = (sender_psid,category) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getSubCategory(category);
            await callSendAPI(sender_psid, response1);
            resolve('done');
        } catch (error) {
            reject(e);
        }
    })
}

let dataSubCategory = async (category) => {
    try {
        const res = await getCategories();
        const datas = res.data.list;
        const arr = datas.fitler(item => {
            return item.levelCategory === category;
        })
        console.log("/////");
        console.log(arr);
        const result = arr.map(e => {
            const item ={
                title: e.categoryName,
                subtitle: `Các khoá học về ${e.categoryName}`,
                image_url: IMAGE_SUB_CATEGORY,
                buttons:[
                    {
                        type: "postback",
                        title: "Xem chi tiết",
                        payload: `COURSES_DETAIL_${e.id}`,
                    }
                ]
            };
            return item;
        })
        // for(let i=0; i<datas.length; i++) {
        //     if(datas[i].levelCategory === category){
        //         const item ={
        //                 title: datas[i].categoryName,
        //                 subtitle: `Các khoá học về ${datas[i].categoryName}`,
        //                 image_url: IMAGE_SUB_CATEGORY,
        //                 buttons:[
        //                     {
        //                         type: "postback",
        //                         title: "Xem chi tiết",
        //                         payload: `COURSES_DETAIL_${datas[i].id}`,
        //                     }
        //                 ]
        //         };
        //         result.push(item);
        //     }
        // }
        return result;


    } catch (error) {
        console.log(error);
    }
}

let getSubCategory = async (category) => {

    const result1 = await dataSubCategory(category)
    console.log("AAAAAA");
    console.log(result1);
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": result1,
            }
        }
    };
    return response;
}

let handleSendCourses = (sender_psid, coursesId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getSendCourses(coursesId);
            await callSendAPI(sender_psid, response1);
            resolve('done');
        } catch (error) {
            reject(e);  
        }
    })
}
let dataSendCourses = async (coursesId) => {
    try {
        const res = await getCourses();
        const datas = res.data.list;
        let result = [];

    } catch (error) {
        
    }
}


let getSendCourses = async (coursesId) => {

    let response = {

    }
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
                            "url": "https://abcchatbot.herokuapp.com/",
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
                            "url": "https://abcchatbot.herokuapp.com/",
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

let handleDetailJavascript = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailJavascript();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailJavascript = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup môi trường và cài đặt",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Khái niệm 1 và thực hành 1",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Khái niệm 2 và thực hành 2",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Khái niệm 3 và thực hành 3",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Khái niệm 4 và thực hành 4",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Khái niệm 5 và thực hành 5",
                    "image_url": IMAGE_WEB_JS,

                },
                {
                    "title": "Đăng ký",
                    "subtitle": "Giá: 1.500.000VND",
                    "image_url": IMAGE_WEB_JS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Đăng Ký",
                            "url": "https://abcchatbot.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailReactJS = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailReactJS();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailReactJS = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup môi trường và cài đặt",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Khái niệm 1 và thực hành 1",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Khái niệm 2 và thực hành 2",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Khái niệm 3 và thực hành 3",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Khái niệm 4 và thực hành 4",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Khái niệm 5 và thực hành 5",
                    "image_url": IMAGE_WEB_REACTJS,

                },
                {
                    "title": "Đăng ký",
                    "subtitle": "Giá: 3.500.000VND",
                    "image_url": IMAGE_WEB_REACTJS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Đăng Ký",
                            "url": "https://abcchatbot.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailNodeJS = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailNodeJS();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailNodeJS = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup môi trường và cài đặt",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Khái niệm 1 và thực hành 1",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Khái niệm 2 và thực hành 2",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Khái niệm 3 và thực hành 3",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Khái niệm 4 và thực hành 4",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Khái niệm 5 và thực hành 5",
                    "image_url": IMAGE_WEB_NODEJS,

                },
                {
                    "title": "Đăng ký",
                    "subtitle": "Giá: 4.000.000VND",
                    "image_url": IMAGE_WEB_NODEJS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Đăng Ký",
                            "url": "https://abcchatbot.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailAndroid = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailAndroid();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailAndroid = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup môi trường và cài đặt",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Khái niệm 1 và thực hành 1",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Khái niệm 2 và thực hành 2",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Khái niệm 3 và thực hành 3",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Khái niệm 4 và thực hành 4",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Khái niệm 5 và thực hành 5",
                    "image_url": IMAGE_MOBILE_ANDROID,

                },
                {
                    "title": "Đăng ký",
                    "subtitle": "Giá: 2.000.000VND",
                    "image_url": IMAGE_MOBILE_ANDROID,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Đăng Ký",
                            "url": "https://abcchatbot.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailReactNative = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailReactNative();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailReactNative = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup môi trường và cài đặt",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Khái niệm 1 và thực hành 1",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Khái niệm 2 và thực hành 2",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Khái niệm 3 và thực hành 3",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Khái niệm 4 và thực hành 4",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Khái niệm 5 và thực hành 5",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,

                },
                {
                    "title": "Đăng ký",
                    "subtitle": "Giá: 2.000.000VND",
                    "image_url": IMAGE_MOBILE_REACTNATIVE,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Đăng Ký",
                            "url": "https://abcchatbot.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_WEB",
                        },

                    ],
                }
                ]
            }
        }
    };
    return response;
}

let handleDetailIOS = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = getDetailIOS();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailIOS = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tutorial 1",
                    "subtitle": "Setup môi trường và cài đặt",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 2",
                    "subtitle": "Khái niệm 1 và thực hành 1",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 3",
                    "subtitle": "Khái niệm 2 và thực hành 2",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 4",
                    "subtitle": "Khái niệm 3 và thực hành 3",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 5",
                    "subtitle": "Khái niệm 4 và thực hành 4",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Tutorial 6",
                    "subtitle": "Khái niệm 5 và thực hành 5",
                    "image_url": IMAGE_MOBILE_IOS,

                },
                {
                    "title": "Đăng ký",
                    "subtitle": "Giá: 2.000.000VND",
                    "image_url": IMAGE_MOBILE_IOS,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Đăng Ký",
                            "url": "https://abcchatbot.herokuapp.com/",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Trở về",
                            "payload": "BACK_WEB",
                        },

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
    handleSendSubCategory: handleSendSubCategory,
    handleSendCourses:handleSendCourses,
    handleSendCatWeb: handleSendCatWeb,
    handleSendCatMobile: handleSendCatMobile,
    handleBackCatalog: handleBackCatalog,
    handleBackMain: handleBackMain,
    handleDetailJavascript: handleDetailJavascript,
    handleBackWeb: handleBackWeb,
    handleBackMobile: handleBackMobile,
    handleDetailReactJS: handleDetailReactJS,
    handleDetailNodeJS: handleDetailNodeJS,
    handleDetailAndroid: handleDetailAndroid,
    handleDetailReactNative: handleDetailReactNative,
    handleDetailIOS: handleDetailIOS,
}