import API from './api'

const getCourses = () => {
    return API.get(`/courses/sorts?type=all&page=1&limit=10`).then(res => res.data);
}

const findCourses = (params) => {// chay đi
    const { subText} = params;// sao m lại truyền súub text, subtext la noi dung khi minh chat ma
    // nhưng mà hiện tại m đang test cái name đúng k
    //t truyen vo xem no chay duoc code k
    return API.get(`/courses/finds?type=name&subText=${params}&page=1&limit=10`).then(res => res.data)
}

export {
    getCourses,
    findCourses,
}