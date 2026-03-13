import {Modal, Button, Form} from 'react-bootstrap'
import { useState } from 'react'
import { createBrand } from '../../http/deviceApi'

const CreateBrand = ({show, onHide}) =>{
  const [value, setValue] = useState('')

  const addBrand = () =>{
    if(!value){
      alert("Введите название типа")
      return
    }
    createBrand({name: value})
    .then(data => {
      setValue('')
      onHide()
    })
  }  
     return(
     <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new brand
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Control 
              value = {value}
              onChange={e => setValue(e.target.value)} 
              placeholder="Add new brand"
            />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={onHide}>Close</Button>
        <Button variant='outline-success' onClick={addBrand}>Add</Button>
      </Modal.Footer>
    </Modal>
     )
}

export default CreateBrand