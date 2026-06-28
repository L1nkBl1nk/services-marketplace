import { useEffect, useState } from "react"
import { fetchMyOrders } from "../http/orderApi"
import { Container, Card, Badge, Spinner } from "react-bootstrap"

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMyOrders()
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>
    }

    return (
        <Container className="mt-4 mb-5">
            <h2 className="mb-4">My Orders</h2>

            {orders.length === 0 ? (
                <div className="text-center text-muted py-5">You have no orders yet</div>
            ) : (
                orders.map(order => (
                    <Card key={order.id} className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold">Order #{order.id}</span>
                                <Badge bg={order.status === "paid" ? "success" : "secondary"}>
                                    {order.status}
                                </Badge>
                            </div>
                            <div className="text-muted small mb-3">
                                {new Date(order.createdAt).toLocaleString()}
                            </div>
                            {order.items?.map(it => (
                                <div key={it.id} className="d-flex justify-content-between border-bottom py-1">
                                    <span>{it.name} × {it.quantity}</span>
                                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between fw-bold pt-2">
                                <span>Total</span><span>${order.total?.toFixed(2)}</span>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    )
}

export default Orders