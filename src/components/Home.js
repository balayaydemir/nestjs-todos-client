import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { FOLDERS_QUERY, CREATE_FOLDER_QUERY } from '../gql/folder'
import { CREATE_TODO_QUERY, DELETE_TODO_QUERY, EDIT_TODO_QUERY } from '../gql/todo'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import Folder from './Folder'

const Home = ({ userId }) => {
  const [openFolderForm, setOpenFolderForm] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [viewFolderId, setViewFolderId] = useState(null)
  const { data, loading } = useQuery(FOLDERS_QUERY)
  const [createTodo] = useMutation(CREATE_TODO_QUERY, {
    update(cache, { data: { createTodo } }) {
      cache.modify({
        id: `Folder${viewFolderId}`,
        fields: {
          todos(existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: createTodo,
              fragment: gql`
                  fragment NewTodo on Todo {
                      id
                      name
                      description
                      isCompleted
                      user {
                          id
                          firstName
                          lastName
                      }
                  }
              `
            })
            return [...existingTodos, newTodoRef]
          }
        }
      })
    }
  })
  const [deleteTodo] = useMutation(DELETE_TODO_QUERY, {
    update(cache, { data: { deleteTodo } }) {
      cache.evict({
        id: `Todo:${deleteTodo.id}`,
      })
    }
  })
  const [editTodo] = useMutation(EDIT_TODO_QUERY, {
    update(cache, { data: { editTodo } }) {
      cache.writeFragment({
        id: `Todo:${editTodo.id}`,
        data: editTodo,
        fragment: gql`
            fragment EditTodo on Todo {
                id
                name
                description
                isCompleted
                user {
                    id
                    firstName
                    lastName
                }
            }
        `
      })
    }
  })
  const [createFolder] = useMutation(CREATE_FOLDER_QUERY, {
    onCompleted() {
      setOpenFolderForm(false)
      setFolderName('')
    },
    update(cache, { data: { createFolder } }) {
      cache.modify({
        fields: {
          getAllFolders(existingFolders = []) {
            const newFolderRef = cache.writeFragment({
              data: createFolder,
              fragment: gql`
                  fragment NewFolder on Folder {
                      id
                      name
                      todos {
                          id
                          name
                          description
                          isCompleted
                          user {
                              id
                              firstName
                              lastName
                          }
                      }
                  }
              `
            })
            return [...existingFolders, newFolderRef]
          }
        }
      })
    }
  })

  if (loading) return <ProgressSpinner />

  const { getAllFolders } = data

  const viewFolder = getAllFolders.find(folder => folder.id === viewFolderId)

  const createCards = () => {
    return getAllFolders.map(folder => {
      return (
        <Card
          title={folder.name}
          key={folder.id}
          style={{ cursor: 'pointer', marginBottom: '2em' }}
          footer={
            <span>
              <Button
                label='Open'
                icon='pi pi-folder-open'
                className='p-button-outlined p-button-secondary'
                onClick={() => setViewFolderId(folder.id)}
              />
            </span>
          }
        >
          {`${folder.todos.length} todo${folder.todos.length === 1 ? '' : 's'}`}
        </Card>
      )
    })
  }

  const handleNavigateBack = () => {
    setViewFolderId(null)
  }

  const handleCloseFolderForm = () => {
    setOpenFolderForm(false)
    setFolderName('')
  }

  const handleEditTodo = input => editTodo({ variables: { input: { ...input, userId: parseInt(userId) } } })
  const handleDeleteTodo = id => deleteTodo({ variables: { id } })
  const handleCreateTodo = input => createTodo({ variables: { input: { ...input, userId: parseInt(userId) } } })

  const handleSaveFolder = () => {
    return createFolder({ variables: { input: { name: folderName } } })
  }

  const renderView = () => {
    if (viewFolderId) {
      return (
        <Folder
          folder={viewFolder}
          handleBack={handleNavigateBack}
          handleDelete={handleDeleteTodo}
          handleEdit={handleEditTodo}
          handleCreate={handleCreateTodo}
        />
        )
    }
    return (
      <>
        <Button label='Add new folder' className='p-button-rounded' style={{margin: '16px'}} onClick={() => setOpenFolderForm(true)}/>
        {createCards()}
        <Dialog
          header='Add new folder'
          visible={openFolderForm}
          style={{width: '50vw'}}
          footer={
            <div>
              <Button label='Cancel' icon='pi pi-times' onClick={handleCloseFolderForm} className='p-button-text'/>
              <Button label='Save' disabled={!folderName} icon='pi pi-check' onClick={handleSaveFolder} autoFocus/>
            </div>
          }
          onHide={handleCloseFolderForm}
        >
              <span className='p-float-label' style={{marginTop: '28px', width: '100%'}}>
              <InputText id='folderName' value={folderName} onChange={e => setFolderName(e.target.value)}  style={{width: '100%'}} />
              <label htmlFor='folderName'>Folder name</label>
              </span>
        </Dialog>
      </>
    )
  }

  return (
    <div>
      {renderView()}
    </div>
  )
}

export default Home
