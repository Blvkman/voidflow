import React, {useState} from 'react'
import desktopVideo from '../../video/desktopVideo.mp4'
import tabletVideo from '../../video/tabletVideo.mp4'
import mobileVideo from '../../video/mobileVideo.mp4'
import { Button } from '../ButtonElement'
import { HeroContainer,
    HeroBg,
    VideoBg,
    HeroContent,
    HeroH1,
    HeroP,
    ArrowForward,
    ArrowRight,
    HeroBtnWrapper
    } from './HeroElements'

const HeroSection = () => {
    const [hover, setHover] = useState(false)

    const onHover = () => {
        setHover(!hover)
    }

    const getVideoSrc = width => {
        if (width >= 1080) return desktopVideo;
        if (width >= 720) return tabletVideo;
        return mobileVideo;
    };

    return (
        <HeroContainer id="home">
            <HeroBg>
                <VideoBg autoPlay loop muted src={getVideoSrc(window.innerWidth)} type='video/mp4' />
            </HeroBg>
            <HeroContent>
                <HeroH1>Innovate your Business</HeroH1>
                <HeroP>
                    Grazie al nostro team potrai godere di servizi vantaggiosi e di qualità.
                </HeroP>
                <HeroBtnWrapper>
                    <Button to="servizi" 
                    onMouseEnter={onHover} 
                    onMouseLeave={onHover}
                    smooth={true} duration={500} spy={true}
                    exact='true' offset={-80}
                >
                        Prova {hover ? <ArrowForward /> : <ArrowRight/>}
                    </Button>
                </HeroBtnWrapper>
            </HeroContent>
        </HeroContainer>
    )
}

export default HeroSection
