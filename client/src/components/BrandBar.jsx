import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { Context } from "../main"
import { Row, Card } from "react-bootstrap"

const BrandBar = observer(() =>{
    const {device} = useContext(Context)
    return(
        <Row className="d-flex">
            {device.brands.map(brand => {
                return (
                    <Card
                    style={{cursor: 'pointer', width:150}}
                    key={brand.id}
                    className="p-3 me-2"
                    onClick={() => device.setSelectedBrand(brand)}
                    border={brand.id === device.selectedBrand?.id ? 'danger' : 'light'}
                    >
                        {brand.name}      
                    </Card>
                )
            })}

        </Row>
    )
})

export default BrandBar