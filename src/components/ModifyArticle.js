import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import ModifyArticlePhotos from './ModifyArticlePhotos';
import ModifyArticleStatus from './ModifyArticleStatus';
import ModifyArticleBody from './ModifyArticleBody';
import ModifyArticleTags from './ModifyArticleTags';

function ModifyArticle({ location }) {
    const [article, setArticle] = useState({});
    let history = useHistory();

    useEffect(() => {
        if (location.state && location.state.article) {
            setArticle(location.state.article);
        } else {
            history.replace('/');
        }
    }, [location.state, history]);


    return (
        <div>
            <br />
            <ModifyArticlePhotos article={article} />
            <br />
            <ModifyArticleStatus article={article} />
            <br />
            <ModifyArticleBody article={article} />
            <br />
            <ModifyArticleTags article={article} />
        </div>
    )
}

export default ModifyArticle
