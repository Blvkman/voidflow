// Importing Packages
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';

// New nav styled-components
export const Nav = styled.nav `
    background: #1a1a1a;
    height: 80px;
    display: flex;
    justify-content: space-between;
    z-index: 10;
`

// New Link styled-components
export const NavLink = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    transition: .2s ease-in-out;

    &:hover {
        color: rgb(249, 156, 0);;
    }

    &.active {
        color: rgb(249, 156, 0);;
    }
`;

// New FaBars styled-components
export const Bars = styled(FaBars)`
    display: none;
    color: #fff;

    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 12px;
        right: 4px;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

// New div styled-components
export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: -24px;
    
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

// New nav styled-components
export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;
  /* Third Nav */
  /* justify-content: flex-end;
  width: 100vw; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

// New Link styled-components
export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: rgb(249, 156, 0);
  padding: 10px 22px;
  color: #fff;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  /* Second Nav */
  margin-left: 24px;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;