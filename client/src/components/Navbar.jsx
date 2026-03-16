import { useContext } from "react"
import { Context } from "../main"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Container } from 'react-bootstrap';
import  {Link, NavLink } from 'react-router-dom';
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import {useNavigate} from 'react-router-dom'

const Navbarchik= observer(() =>{
    const navigate = useNavigate()
    const {user} = useContext(Context)

    const logOut =()=>{
      user.setUser=({})
      user.setIsAuth(false)
    }
    return(
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
          <NavLink style={{color:"white"}} to={SHOP_ROUTE}>StoreName</NavLink>
          {user.isAuth ? <Nav className="ms-auto" style={{color: 'white'}}>
            <Button variant="outline-light" onClick={logOut}>Log out</Button>
            <Button variant="outline-light" onClick={() => navigate(ADMIN_ROUTE)} className="ms-2">Admin panel</Button>
            <Button variant="outline-light" onClick={() => navigate(BASKET_ROUTE)} className="ms-2">Shopping Cart</Button>
          </Nav> :
          <Nav className="ms-auto" style={{color: 'white'}}>
            <Button variant="outline-light" onClick={() => navigate(LOGIN_ROUTE)}>Log in</Button>
          </Nav>
          }
          
       </Container>
      </Navbar>
    
    )
})

export default Navbarchik