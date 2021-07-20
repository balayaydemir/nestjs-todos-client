import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

const Folder = ({ folder, handleBack, handleEdit, handleDelete, handleCreate }) => {
  const [rows, setRows] = useState(null)
  const [openTodoForm, setOpenTodoForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const newRows = folder.todos.map(todo => ({
      id: todo.id,
      name: todo.name,
      description: todo.description,
      isCompleted: todo.isCompleted,
      userName: `${todo.user.firstName} ${todo.user.lastName}`,
    }))
    setRows(newRows)
  }, [folder])

  const handleCloseTodoForm = () => {
    setOpenTodoForm(false)
    setName('')
    setDescription('')
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case true:
        return 'Completed'

      case false:
        return 'In progress'

      default:
        return 'In progress'
    }
  }

  const saveTodo = () => {
    handleCreate({ name, description, folderId: parseInt(folder.id) })
    handleCloseTodoForm()
  }

  const editTodo = (id, completed) => {
    const todoToEdit = folder.todos.find(folder => folder.id === id)
    const inputParams = {
      id: parseInt(todoToEdit.id),
      name: todoToEdit.name,
      description: todoToEdit.description,
      isCompleted: completed,
      folderId: parseInt(folder.id),
    }
    handleEdit(inputParams)
  }

  const deleteTodo = id => handleDelete(parseInt(id))

  const editBodyTemplate = (rowData) => {
    return (
      <span>
        <Button
          icon='pi pi-check'
          className='p-button-rounded p-button-success'
          style={{ marginRight: '8px' }}
          onClick={() => editTodo(rowData.id, true)}
        />
        <Button
          icon='pi pi-times'
          className='p-button-rounded p-button-danger'
          style={{ marginRight: '8px' }}
          onClick={() => editTodo(rowData.id, false)}
        />
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-secondary p-button-text'
          onClick={() => deleteTodo(rowData.id)}
        />
      </span>
    )
  }

  const statusDefaultStyles = {
    borderRadius: '2px',
    padding: '.25em .5rem',
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '.3px',
  }

  const statusBodyTemplate = rowData => {
    return (
      <span
        style={rowData.isCompleted
          ? { backgroundColor: '#C8E6C9', color: '#256029', ...statusDefaultStyles }
          : { backgroundColor: '#FFCDD2', color: '#C63737', ...statusDefaultStyles }
        }
      >
        {getStatusLabel(rowData.isCompleted)}
      </span>
    )
  }

  const editableTable = (
    <div className='card'>
      <div style={{ display: 'flex', flexDirection: 'column', width: '15%' }}>
        <Button
          label='Back to folders'
          icon='pi pi-chevron-left'
          className='p-button-text'
          onClick={handleBack}
        />
        <Button
          label='Add new todo'
          className='p-button-rounded'
          style={{ margin: '16px 0' }}
          onClick={() => setOpenTodoForm(true)}
        />
      </div>
      <h2>
        {`${folder.name} (${folder.todos.length} todo${folder.todos.length === 1 ? '' :'s'})`}
      </h2>
      <DataTable value={rows} dataKey='id'>
        <Column field='name' header='Name' />
        <Column field='description' header='Description' />
        <Column field='isCompleted' header='Status' body={statusBodyTemplate} />
        <Column field='userName' header='Last edited by' />
        <Column body={editBodyTemplate} />
      </DataTable>
    </div>
  )

  return (
    <div>
      {editableTable}
      <Dialog
        header='Add new todo'
        visible={openTodoForm}
        style={{ width: '50vw' }}
        footer={
          <div>
            <Button label='Cancel' icon='pi pi-times' onClick={handleCloseTodoForm} className='p-button-text' />
            <Button label='Save' disabled={!name || !description} icon='pi pi-check' onClick={saveTodo} autoFocus />
          </div>
        }
        onHide={handleCloseTodoForm}
      >
        <span className='p-float-label' style={{marginTop: '28px', width: '100%'}}>
          <InputText id='name' value={name} onChange={e => setName(e.target.value)}  style={{width: '100%'}} />
          <label htmlFor='name'>Name</label>
        </span>
        <span className='p-float-label' style={{marginTop: '28px', width: '100%'}}>
          <InputText id='description' value={description} onChange={e => setDescription(e.target.value)}  style={{width: '100%'}} />
          <label htmlFor='description'>Description</label>
        </span>
      </Dialog>
    </div>
  )
}

export default Folder
