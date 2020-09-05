import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import ModifyArticlePhotos from './ModifyArticlePhotos';

function ModifyArticle({ location }) {
    const [article, setArticle] = useState({});

    useEffect(() => {
        if (location.state && location.state.article) {
            setArticle(location.state.article);
        } else {
            return <Redirect to='/' />
        }
    }, [location.state]);


    return (
        <div>
            <ModifyArticlePhotos article={article} />
        </div>
    )
}

export default ModifyArticle
