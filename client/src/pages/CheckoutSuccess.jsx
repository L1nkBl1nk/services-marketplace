import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { confirmOrder } from "../http/orderApi"
import { ORDERS_ROUTE, SHOP_ROUTE } from "../utils/consts"
import { Container, Card, Button, Spinner } from "react-bootstrap"

const CheckoutSuccess = () => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState("loading") // loading | paid | pending | error
    const [order, setOrder] = useState(null)

    useEffect(() => {
        const sessionId = params.get("session_id")
        if (!sessionId) { setStatus("error"); return }
        confirmOrder(sessionId)
            .then(data => {
                setOrder(data)
                setStatus(data.status === "paid" ? "paid" : "pending")
            })
            .catch(() => setStatus("error"))
    }, [])

    if (status === "loading") {
        return <Container className="mt-5 text-center"><Spinner animation="border" /><div className="mt-2">Confirming your payment…</div></Container>
    }

    return (
        <Container className="mt-5" style={{ maxWidth: 560 }}>
            <Card className="text-center">
                <Card.Body className="p-4">
                    {status === "paid" && (
                        <>
                            <div style={{ fontSize: 48 }}>✅</div>
                            <h3 className="mt-2">Payment successful!</h3>
                            <p className="text-muted">Thank you for your order. A confirmation is on its way.</p>
                            {order && (
                                <div className="text-start my-3">
                                    {order.items?.map(it => (
                                        <div key={it.id} className="d-flex justify-content-between border-bottom py-2">
                                            <span>{it.name} × {it.quantity}</span>
                                            <span>${(it.price * it.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between fw-bold pt-2">
                                        <span>Total</span><span>${order.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                            <Button variant="success" onClick={() => navigate(ORDERS_ROUTE)}>View my orders</Button>
                        </>
                    )}
                    {status === "pending" && (
                        <>
                            <div style={{ fontSize: 48 }}>⌛</div>
                            <h3 className="mt-2">Payment is processing</h3>
                            <p className="text-muted">We'll update your order as soon as it's confirmed.</p>
                            <Button onClick={() => navigate(ORDERS_ROUTE)}>Go to my orders</Button>
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <div style={{ fontSize: 48 }}>⚠️</div>
                            <h3 className="mt-2">Something went wrong</h3>
                            <p className="text-muted">We couldn't confirm this payment.</p>
                            <Button variant="outline-secondary" onClick={() => navigate(SHOP_ROUTE)}>Back to shop</Button>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default CheckoutSuccess