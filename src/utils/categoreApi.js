import API from './api'

const getCategories = (params) => {
    const {page,limit} = params;
    return API.get(`/categories?page=${page}&limit=${limit}`).then(res => res.data)
}
const postCategories = (params) => {
    return API.post('/categories', params).then(res => res.data);
};

console.log(getCategories(1,7));


export default {
    getCategories,
    postCategories,
}