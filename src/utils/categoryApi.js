import API from './api'

const getCategories = () => {
    
    return API.get(`/categories?page=1&limit=10`).then(res => res.data)
}

export {
    getCategories,
}