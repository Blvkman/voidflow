import React from 'react';

// import styles
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink
  } from './Style';

// import image
import LogoSvg from '../../images/logo.svg';

// Navbar Function
export default function NavigationBar() {
    return (
        <Nav>
            <NavLink to='/'>
                <img src={LogoSvg} alt='logo' />
            </NavLink>
            <Bars />
            <NavMenu>
                <NavLink to='/about' activeStyle>
                    Chi siamo
                </NavLink>
                <NavLink to='/services' activeStyle>
                    Servizi
                </NavLink>
                <NavLink to='/catalogo' activeStyle>
                    Catalog
                </NavLink>
                <NavLink to='/contact' activeStyle>
                    Contatti
                </NavLink>
            </NavMenu>
            <NavBtn>
                <NavBtnLink to='/login'>Accedi</NavBtnLink>
                <NavBtnLink to='/register'>Registrati</NavBtnLink>
            </NavBtn>
      </Nav>
    );
}