import React from 'react'
import { animateScroll as scroll } from 'react-scroll'
import {FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube} from 'react-icons/fa'
import { FooterLink, WebsiteRights, FooterContainer, FooterWrap, FooterLinksContainer, FooterLinksWrapper, FooterLinkTitle, FooterLinkItems, SocialIconLink, SocialIcons, SocialLogo, SocialMedia, SocialMediaWrap } from './FooterElements'

const Footer = () => {
    const toggleHome = () => {
        scroll.scrollToTop();
    };

    return (
        <FooterContainer>
            <FooterWrap>
                <FooterLinksContainer>
                    <FooterLinksWrapper>
                        <FooterLinkItems>
                            <FooterLinkTitle>Links</FooterLinkTitle>
                                <FooterLink to="signin">Sign in</FooterLink>
                                <FooterLink to="ToS">Terms of Service</FooterLink>
                        </FooterLinkItems>
                    </FooterLinksWrapper>
                </FooterLinksContainer>
                <SocialMedia>
                    <SocialMediaWrap>
                        <SocialLogo to='/' onClick={toggleHome}>
                            VoidFlow
                        </SocialLogo>
                        <WebsiteRights> voidflow © {new Date().getFullYear()} All rights reserved.</WebsiteRights>
                        <SocialIcons>
                            <SocialIconLink href="//www.instagram.com/voidflowit/" target="_blank" aria_label="Instagram">
                                <FaInstagram/>
                            </SocialIconLink>
                            <SocialIconLink href="//www.instagram.com/voidflowit/" target="_blank" aria_label="Instagram">
                                <FaFacebook/>
                            </SocialIconLink>
                            <SocialIconLink href="//www.instagram.com/voidflowit/" target="_blank" aria_label="Instagram">
                                <FaYoutube/>
                            </SocialIconLink>
                            <SocialIconLink href="//www.instagram.com/voidflowit/" target="_blank" aria_label="Instagram">
                                <FaTwitter/>
                            </SocialIconLink>
                            <SocialIconLink href="//www.instagram.com/voidflowit/" target="_blank" aria_label="Instagram">
                                <FaLinkedin/>
                            </SocialIconLink>
                        </SocialIcons>
                    </SocialMediaWrap>
                </SocialMedia>
            </FooterWrap>
        </FooterContainer>
    )
}

export default Footer
