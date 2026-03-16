import { Container, Col, Image, Row, Card, Button } from "react-bootstrap"
import bigStar from '../assets/bigStar.png'
import { useContext, useEffect, useState } from "react"
import {useParams} from 'react-router-dom'
import { addToBasket, fetchOneDevice } from "../http/deviceApi"
import { Context } from "../main"
import { observer } from "mobx-react-lite"

const DevicePage = observer(() =>{
    const [device, setDevice] = useState({info :[]})
    const {id} = useParams()
    const {user} = useContext(Context)
    useEffect(() => {
        fetchOneDevice(id).then(data => setDevice(data))
    }, [])

    const addDeviceToBasket = async () =>{
    try{
        await addToBasket(device.id)
        alert("Device added to basket")
    }catch(e){
        console.log(e)
    }
}
    
    return(
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image width={300} height ={300} src={`${import.meta.env.VITE_API_URL}/static/${device.img}`}/>
                </Col>
                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center justify-content-center">
                        <h2 style={{textAlign: 'center'}}>{device.name}</h2>
                        <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{background: `url(${bigStar}) no-repeat center center`, 
                            width:240, height:240, 
                            backgroundSize:'cover',
                            fontSize:64}}
                        >
                            {device.rating}
                        </div>
                    </Row>
                </Col>
            <Col md={4}>
                <Card
                    className="d-flex flex-column align-items-center justify-content-around"
                    style={{width:300, height: 300, fontSize:32, border: '5px solid lightgray'}}
                >
                    <h3>From: {device.price} $</h3>
                    <Button onClick={addDeviceToBasket} variant={"outline-dark"}>Add to shopping cart</Button>
                </Card>
            </Col>
            </Row>
            <Row className="d-flex flex-column m-3" >
                <h1>About</h1>
                {device.info.map((info,index) => 
                    <Row key={info.id} style={{background: index%2 ===0 ? 'lightgray': 'transparent', padding:10 }}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    )
})

export default DevicePage