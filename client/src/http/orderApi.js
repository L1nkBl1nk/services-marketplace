import { $authHost } from "./index";

// Start a Stripe Checkout session; returns { url } to redirect the browser to
export const checkout = async () => {
    const {data} = await $authHost.post('api/order/checkout')
    return data
}

// Confirm payment after Stripe redirects back with a session_id
export const confirmOrder = async (sessionId) => {
    const {data} = await $authHost.get('api/order/confirm', {params: {session_id: sessionId}})
    return data
}

// Order history for the current user
export const fetchMyOrders = async () => {
    const {data} = await $authHost.get('api/order')
    return data
}