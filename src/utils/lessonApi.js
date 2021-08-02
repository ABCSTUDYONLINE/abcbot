import API from './api'

const getLessons = (topicId) => {
    return API.get(`/lessons?topicId=${topicId}&page=1&limit=10`).then(res => res.data);
}

export {
    getLessons,
}