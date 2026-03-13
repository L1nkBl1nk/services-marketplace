import { Container, Form, Card, Button, Row  } from "react-bootstrap"
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from '../utils/consts'
import { login, registration } from "../http/userApi"
import { useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../main"

const Auth = observer(() =>{
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const auth = async () =>{
        let data
        try{
        if(isLogin){
            data = await login(email, password)
            console.log(data)
        }else{
            data = await registration(email, password)
            console.log(data)
        }
            user.setUser(data)
            user.setIsAuth(true)
            navigate(SHOP_ROUTE)
    }catch(e){
        const message = e.response?.data?.message || e.message
        alert(message)
        }
    }

    return(
        <Container 
            className="d-flex justify-content-center align-items-center "
            style={{height: window.innerHeight -54}}
        >
            <Card style={{width:600}} className='p-5'>
                <h2 className="m-auto">{isLogin ? "Login" : "Registration"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control 
                        className="mt-2"
                        placeholder="email@expample.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control 
                        className="mt-2"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </Form>
                <Row className="d-flex justify-content-between mt-3">
                    {isLogin?
                    <div>
                        Dont have an account? <NavLink to={REGISTRATION_ROUTE}>Create now!</NavLink>
                    </div>
                    :
                    <div>
                        Already have an account? <NavLink to={LOGIN_ROUTE}>Login now!</NavLink>
                    </div>
                    }
                    <Button 
                        className="mt-2 align-self-end" 
                        variant={'outline-success'}
                        onClick={auth}
                        >
                        {isLogin ? "Login" : "Create now!"}
                    </Button>
                </Row>
            </Card>
            
        </Container>
    )
})

export default Auth