import API from './api'

const getTopics = (courseId) => {
    return API.get(`/topics?courseId=${courseId}&page=1&limit=10`).then(res => res.data);
}

export {
    getTopics,
}