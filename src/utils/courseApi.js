import API from './api'

const getCourses = () => {
    return API.get(`/courses/sorts?type=all&page=1&limit=10`).then(res => res.data);
}

const findCourses = (params) => {
    const { subText} = params;
    return API.get(`/courses/find'?type=name&subText=${subText}&page=1&limit=10`).them(res => res.data)
}

export {
    getCourses,
    findCourses,
}