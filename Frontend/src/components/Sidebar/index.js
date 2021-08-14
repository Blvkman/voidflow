import React from 'react'
import { SidebarContainer,
    Icon,
    CloseIcon, 
    SidebarRoute, 
    SidebarLink, 
    SidebarWrapper, 
    SidebarMenu,
    SideBtnWrap } from './SidebarElements'

const Sidebar = ({isOpen, toggle}) => {
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon/>
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="discover" onClick={toggle}> Discover </SidebarLink>
                    <SidebarLink to="servizi" onClick={toggle}> Services </SidebarLink>
                    <SidebarLink to="about" onClick={toggle}> About </SidebarLink>
                    <SidebarLink to="signup" onClick={toggle}> Sign Up </SidebarLink>
                </SidebarMenu>
                <SideBtnWrap>
                    <SidebarRoute to='/signin'>Sign In</SidebarRoute>
                </SideBtnWrap>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar
