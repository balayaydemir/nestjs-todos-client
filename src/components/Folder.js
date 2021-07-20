import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

const Folder = ({ folder, handleBack, handleEdit, handleDelete }) => {
  const [rows, setRows] = useState(null)

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

  const statusBodyTemplate = (rowData) => {
    return getStatusLabel(rowData.isCompleted)
  }

  const editableTable = (
    <div className='card'>
      <Button
        label='Back to folders'
        icon='pi pi-chevron-left'
        className='p-button-text'
        onClick={handleBack}
      />
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

  return <div>{editableTable}</div>
}

export default Folder
