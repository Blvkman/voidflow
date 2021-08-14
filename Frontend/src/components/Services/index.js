import React from 'react'
import icon4 from '../../images/svg-4.svg'
import icon5 from '../../images/svg-5.svg'
import icon6 from '../../images/svg-6.svg'
import { ServicesCard,
    ServicesContainer,
    ServicesH2,
    ServicesIcon,
    ServicesP,
    ServicesWrapper,
    ServicesH1} from './ServicesElements'

const Services = () => {
    return (
        <ServicesContainer id='servizi'>
            <ServicesH1>I nostri servizi</ServicesH1>
            <ServicesWrapper>
                <ServicesCard>
                    <ServicesIcon src={icon4}/>
                    <ServicesH2>Sito Web</ServicesH2>
                    <ServicesP>Ti aiutiamo a costruire il tuo sito in base alle tue esigenze.</ServicesP>
                </ServicesCard>
                <ServicesCard>
                    <ServicesIcon src={icon5}/>
                    <ServicesH2>Design</ServicesH2>
                    <ServicesP>Ci occupiamo di creare quello che i clienti si ricorderanno di te.</ServicesP>
                </ServicesCard>
                <ServicesCard>
                    <ServicesIcon src={icon6}/>
                    <ServicesH2>Gadget</ServicesH2>
                    <ServicesP>Trasformiamo le tue idee in oggetti di uso quotidiano per te.</ServicesP>
                </ServicesCard>
            </ServicesWrapper>
        </ServicesContainer>
    )
}

export default Services
