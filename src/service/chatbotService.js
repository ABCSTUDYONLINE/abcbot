require('dotenv').config();
import request from "request";
import API from "../utils/api";
import {getCategories} from '../utils/categoryApi';
import {getCourses,findCourses} from '../utils/courseApi';
import {getTopics} from '../utils/topicApi';
import {getLessons} from '../utils/lessonApi';

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
        let arr = datas.filter(item =>{
            return item.levelCategory === category; //web
        })
        let result = arr.map(e => {
            const item ={
                title: e.categoryName,
                subtitle: `Các khoá học về ${e.categoryName}`,
                image_url: IMAGE_SUB_CATEGORY,
                buttons:[
                    {
                        type: "postback",
                        title: "Xem chi tiết",
                        payload: `COURSES_DETAIL_${e.id}`,
                        //e.id = e1077695-018d-4bc5-82c8-1a4db0a6d977
                    }
                ]
            };
            return item;
        })
        return result;
    } catch (error) {
        console.log(error);
    }
}

let getSubCategory = async (category) => {

    const result1 = await dataSubCategory(category)
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

let handleSendCourses = (sender_psid, courseId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getSendCourses(courseId);
            await callSendAPI(sender_psid, response1);
            resolve('done');
        } catch (error) {
            reject(e);  
        }
    })
}
let dataSendCourses = async (courseId) => {
    try {
        const res = await getCourses();
        const datas = res.data.list;
        let arr = datas.filter(item => {
            return item.category.id === courseId;//e1077695-018d-4bc5-82c8-1a4db0a6d977
        })
        const result = arr.map(e => {
            const item ={
                title: e.courseName,
                subtitle: e.shortCourseDescription,
                image_url: e.courseImageLink,
                buttons:[
                    {
                        type: "postback",
                        title: "Xem chi tiết",
                        payload: `TOPICS_DETAIL_${e.id}`,
                        //8ecb41e5-39b0-48e3-897c-7042303a6217
                    }
                ]
            }
            return item;
        })
        return result;

    } catch (error) {
        
    }
}


let getSendCourses = async (courseId) => {

    let result = await dataSendCourses(courseId);
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": result,
            }
        }
    }
    return response;
}

let handleSendTopic = (sender_psid,courseId) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getSendTopic(courseId);
            await callSendAPI(sender_psid, response1);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let dataSendTopic = async (courseId) => {
    const data = await getTopics(courseId);
    const datas= data.data.list;
        let arr = datas.filter(item =>{
            return item.course.id === courseId;//8ecb41e5-39b0-48e3-897c-7042303a6217
        })
        const result = arr.map(e => {
            const item ={
                title: e.topicName,
                // subtitle: e.shortCourseDescription,
                image_url: e.course.courseImageLink,
                buttons:[
                    {
                        type: "postback",
                        title: "Xem chi tiết",
                        payload: `LESSONS_DETAIL_${e.id}`,
                        //0b41ee69-1b46-471a-bd7c-746c8a50b785
                    }
                ]
            }
            return item;
        })
        return result;
}

let getSendTopic = async (courseId) =>{
    let result = await dataSendTopic(courseId);
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": result,
            }
        }
    }
    return response;
}

let handelSendLesson = (sender_psid,topicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getSendLesson(topicId);
            await callSendAPI(sender_psid, response1);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    })
}

let dataSendLesson = async (topicId) => {
    const data = await getLessons(topicId);
    const datas= data.data.list;
        let arr = datas.filter(item =>{
            return item.topic.id === topicId;//0b41ee69-1b46-471a-bd7c-746c8a50b785
        })
        const result = arr.map(e => {
            const item ={
                title: e.lessonName,
                // subtitle: e.lessonDescription,
                // image_url: e.videoLink
            }
            return item;
        })
        return result;
}

let getSendLesson = async (topicId) => {
    let result = await dataSendLesson(topicId);
    console.log("//////");
    console.log(result);
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": result,
            }
        }
    }
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
    handleSendSubCategory: handleSendSubCategory,
    handleSendCourses:handleSendCourses,
    handleSendTopic:handleSendTopic,
    handelSendLesson:handelSendLesson,
    handleBackCatalog: handleBackCatalog,
    handleBackMain: handleBackMain,
    handleBackWeb: handleBackWeb,
    handleBackMobile: handleBackMobile,
}