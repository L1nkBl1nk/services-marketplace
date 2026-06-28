import { useContext, useEffect, useState } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import { fetchBasketDevices, deleteBasketDevice, updateBasketQuantity } from "../http/deviceApi"
import { checkout } from "../http/orderApi"
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap"

const Basket = observer(() => {
    const { basket } = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [paying, setPaying] = useState(false)

    const loadBasket = async () => {
        try {
            const data = await fetchBasketDevices()
            basket.setDevices(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadBasket() }, [])

    const changeQty = async (id, quantity) => {
        if (quantity < 1) return removeItem(id)
        try {
            await updateBasketQuantity(id, quantity)
            await loadBasket()
        } catch (e) { console.error(e) }
    }

    const removeItem = async (id) => {
        try {
            await deleteBasketDevice(id)
            await loadBasket()
        } catch (e) { console.error(e) }
    }

    const pay = async () => {
        setPaying(true)
        try {
            const { url } = await checkout()
            window.location.href = url // redirect to Stripe Checkout
        } catch (e) {
            console.error(e)
            alert(e?.response?.data?.message || "Checkout failed")
            setPaying(false)
        }
    }

    const total = basket.devices.reduce(
        (sum, item) => sum + item.device.price * item.quantity, 0
    )

    if (loading) {
        return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>
    }

    return (
        <Container className="mt-4 mb-5">
            <h2 className="mb-4">Your Cart</h2>

            {basket.devices.length === 0 ? (
                <div className="text-center text-muted py-5">Your cart is empty</div>
            ) : (
                <Row>
                    <Col lg={8}>
                        {basket.devices.map(item => (
                            <Card key={item.id} className="mb-3">
                                <Card.Body className="d-flex align-items-center gap-3">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/static/${item.device.img}`}
                                        alt={item.device.name}
                                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">{item.device.name}</div>
                                        <div className="text-muted">${item.device.price}</div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button size="sm" variant="outline-secondary" onClick={() => changeQty(item.id, item.quantity - 1)}>−</Button>
                                        <span style={{ minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                                        <Button size="sm" variant="outline-secondary" onClick={() => changeQty(item.id, item.quantity + 1)}>+</Button>
                                    </div>
                                    <div className="fw-semibold" style={{ minWidth: 80, textAlign: "right" }}>
                                        ${(item.device.price * item.quantity).toFixed(2)}
                                    </div>
                                    <Button size="sm" variant="outline-danger" onClick={() => removeItem(item.id)}>✕</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>

                    <Col lg={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Order summary</Card.Title>
                                <div className="d-flex justify-content-between my-3">
                                    <span>Total</span>
                                    <span className="fw-bold fs-5">${total.toFixed(2)}</span>
                                </div>
                                <Button className="w-100" variant="success" disabled={paying} onClick={pay}>
                                    {paying ? "Redirecting…" : "Checkout"}
                                </Button>
                                <div className="text-muted small mt-2 text-center">
                                    Secure payment via Stripe
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    )
})

export default Basket