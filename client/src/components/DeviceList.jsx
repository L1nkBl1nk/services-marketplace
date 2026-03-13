import { useContext } from "react"
import { Context } from "../main"
import { Row } from "react-bootstrap"
import DeviceItem from "./DeviceItem"
import { observer } from "mobx-react-lite"

const DeviceList = observer(() =>{
    const {device} = useContext(Context)
    return(
        <Row className="d-flex mt-3">
            {device.devices.map(device =>{
                return <DeviceItem 
                key={device.id}
                device = {device}
                />
            })}
        </Row>

    )
})

export default DeviceList