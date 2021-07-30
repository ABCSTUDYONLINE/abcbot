import API from './api'

const getCourses = (params) => {
    const {page, limit} = params;
    return API.get(`/courses?owner=0&page=${page}&limit=${limit}`).then(res => res.data);
}

const findCourses = (params) => {
    const { subText, page, limit } = params;
    return API.get(`/courses/find'?type=name&subText=${subText}&page=${page}&limit=${limit}`).them(res => res.data)
}

export {
    getCourses,
    findCourses,
}