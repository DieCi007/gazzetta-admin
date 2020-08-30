import * as Yup from 'yup';
import axios from 'axios';

const valSchema = (strings) => Yup.object().shape({
    article: Yup.object().shape({
        al: Yup.object().shape({
            title: Yup.string().required(strings.required),
            body: Yup.string().required(strings.required)
        }),
        en: Yup.object().shape({
            title: Yup.string().required(strings.required),
            body: Yup.string().required(strings.required)
        }),
        it: Yup.object().shape({
            title: Yup.string().required(strings.required),
            body: Yup.string().required(strings.required)
        })
    }),
    tags: Yup.array().min(1, strings.addOne).max(3, strings.addLimit),
    published: Yup.boolean(),
    mainPage: Yup.boolean()
})

const initialValues = {
    article: {
        al: {
            title: '',
            body: ''
        },
        en: {
            title: '',
            body: ''
        },
        it: {
            title: '',
            body: ''
        },
    },
    tags: [],
    published: true,
    mainPage: false
}

const postArticle = async (values, media) => {
    const formData = new FormData();
    formData.append('article', JSON.stringify(values));
    console.log(values);
    media.forEach(element => {
        formData.append('media', element);
    });
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/article`, formData,
            { withCredentials: true });
        return response;
    } catch (err) {
        return undefined;
    }
}

export { valSchema, initialValues, postArticle }