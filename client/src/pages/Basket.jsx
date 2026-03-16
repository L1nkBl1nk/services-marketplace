import { useContext } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { fetchBasketDevices, deleteBasketDevice } from "../http/deviceApi"
import { Container, Row, Col, Card, Button } from "react-bootstrap"

const Basket = observer(() =>{
    const {basket} = useContext(Context)
    useEffect(() => {
    const loadBasket = async () => {
        try {
            const data = await fetchBasketDevices()  
            basket.setDevices(data)                  
            console.log(data)                        
        } catch (e) {
            console.error(e)
        }
    }


    loadBasket()
}, [])

    const deleteItem = async (id) =>{
        try {
            await deleteBasketDevice(id)
            const data = await fetchBasketDevices()
            basket.setDevices(data)
            alert('Device removed')
        } catch (e) {
            console.log(e)
        }
    }

    return (
    <Container className="mt-4">
      <h2 className="mb-4">Basket</h2>

      {basket.devices.length === 0 && (
        <div className="text-center">Basket is empty</div>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {basket.devices.map(basketItem => (
          <Col key={basketItem.id}>
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={`${import.meta.env.VITE_API_URL}/static/${basketItem.device.img}`}
                alt={basketItem.device.name}
                style={{ objectFit: "cover", height: "200px" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{basketItem.device.name}</Card.Title>
                <Card.Text>${basketItem.device.price}</Card.Text>
                <Button onClick={() => deleteItem(basketItem.id)} variant="outline-danger" className="mt-auto">
                  Remove
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
    
})

export default Basket