import React from 'react'
import NotFoundPage from '../components/404NotFound'
import { ObjOne } from '../components/404NotFound/Data';
import ScrollToTop from '../components/Signin/ScrollToTop'

const Home = () => {

    return (
        <>
            <ScrollToTop />
            <NotFoundPage {...ObjOne}/>
        </>
    )
}

export default Home