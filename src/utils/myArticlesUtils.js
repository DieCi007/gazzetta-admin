import axios from 'axios';

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const getAllArticles = async (page, limit) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/article/paginated/journalist`,
            {
                withCredentials: true,
                params: {
                    page: page,
                    limit: limit
                }
            });
        return response.data;
    } catch (error) {
        return undefined;
    }
}
const getNotPublished = async (page, limit) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/article/paginated/nopublish`,
            {
                withCredentials: true,
                params: {
                    page: page,
                    limit: limit
                }
            });
        return response.data;
    } catch (error) {
        return undefined;
    }

}

const deleteArticleDB = async id => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/article/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        return undefined;
    }

}


export { a11yProps, getAllArticles, getNotPublished, deleteArticleDB }