import { Col, Card, Image } from "react-bootstrap"
import star from '../assets/star.png'
import {useNavigate} from 'react-router-dom'
import { DEVICE_ROUTE } from "../utils/consts"

const DeviceItem = ({device}) =>{
    const navigate = useNavigate()
    return(
        <Col md={3} className="p-2 m-3" onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}>
            <Card style={{width:150, cursor:'pointer'}} border={"light"}>
                <Image width={150} height={150} src={`${import.meta.env.VITE_API_URL}/static/${device.img}`} />
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div>Samsung...</div>
                    <div className="d-flex align-items-center">
                        <div>{device.rating}</div>
                        <Image width={15} height={15} src={star}/>
                    </div>
                </div>
                <div>{device.name}</div>
            </Card>
        </Col>
    )
}

export default DeviceItem