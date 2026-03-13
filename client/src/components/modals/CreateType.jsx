import { useState } from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { createType } from '../../http/deviceApi'

const CreateType = ({show, onHide}) =>{

  const [value, setValue] = useState('')

  const addType = () =>{
    if(!value){
      alert("Введите название типа")
      return
    }
    createType({name: value})
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
          Add new type
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Control
            value = {value}
            onChange={e => setValue(e.target.value)} 
              placeholder="Add new type"
            />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={onHide}>Close</Button>
        <Button variant='outline-success' onClick={addType}>Add</Button>
      </Modal.Footer>
    </Modal>
     )
}

export default CreateType