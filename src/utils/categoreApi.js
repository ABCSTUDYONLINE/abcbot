import API from './api'

const getCategories = (params) => {
    const {page,limit} = params;
    return API.get(`/categories?page=${page}&limit=${limit}`).then(res => res.data)
}
const postCategories = (params) => {
    return API.post('/categories', params).then(res => res.data);
};

export default {
    getCategories,
    postCategories,
}