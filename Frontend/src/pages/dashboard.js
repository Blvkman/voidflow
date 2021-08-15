import React from 'react'
import Dashboard from '../components/Dashboard'
import ScrollToTop from '../components/Signin/ScrollToTop'

const DashboardPage = (props) => {
    return (
        <>
            <ScrollToTop />
            <Dashboard {...props}/>
        </>
    )
}

export default DashboardPage