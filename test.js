import {getCategories} from './src/utils/categoreApi'
const res = await getCategories(1,7);
    console.log(res.data);