import React, { useState } from 'react'
import {useQuery, useMutation, gql, useSubscription} from '@apollo/client'
import {
  FOLDERS_QUERY,
  CREATE_FOLDER_QUERY,
  DELETE_FOLDER_QUERY,
  FOLDER_ADDED_SUBSCRIPTION,
  FOLDER_DELETED_SUBSCRIPTION,
} from '../gql/folder'
import {
  CREATE_TODO_QUERY,
  DELETE_TODO_QUERY,
  EDIT_TODO_QUERY,
  TODO_ADDED_SUBSCRIPTION,
  TODO_DELETED_SUBSCRIPTION,
  TODO_EDITED_SUBSCRIPTION,
} from '../gql/todo'
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
  useSubscription(TODO_DELETED_SUBSCRIPTION, {
    onSubscriptionData(data) {
      const { client, subscriptionData } = data
      const { cache } = client
      if (!subscriptionData.data) return
      cache.evict({
        id: `Todo:${subscriptionData.data.todoDeleted.id}`,
      })
    }
  })
  useSubscription(TODO_EDITED_SUBSCRIPTION, {
    variables: { userId: parseInt(userId) },
    onSubscriptionData(data) {
      const { client, subscriptionData } = data
      const { cache } = client
      if (!subscriptionData.data) return
      cache.writeFragment({
        id: `Todo:${subscriptionData.data.todoEdited.id}`,
        data: subscriptionData.data.todoEdited,
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
  useSubscription(TODO_ADDED_SUBSCRIPTION, {
    variables: { userId: parseInt(userId) },
    onSubscriptionData(data) {
      const { client, subscriptionData } = data
      const { cache } = client
      if (!subscriptionData.data) return
      cache.modify({
        id: `Folder:${viewFolderId}`,
        fields: {
          todos(existingTodosRef = [], { readField }) {
            const newTodoRef = cache.writeFragment({
              data: subscriptionData.data.todoAdded,
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

            if (existingTodosRef.some(
              ref => readField('id', ref) === subscriptionData.data.todoAdded.id
            )) {
              return existingTodosRef
            }

            return [...existingTodosRef, newTodoRef]
          }
        },
      })
    }
  })
  useSubscription(FOLDER_ADDED_SUBSCRIPTION, {
    variables: { userId: parseInt(userId) },
    onSubscriptionData(data) {
      const { client, subscriptionData } = data
      const { cache } = client
      if (!subscriptionData.data) return
      cache.modify({
        fields: {
          getAllFolders(existingFoldersRef = [], { readField }) {
            const newFolderRef = cache.writeFragment({
              data: subscriptionData.data.folderAdded,
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

            if (existingFoldersRef.some(
              ref => readField('id', ref) === subscriptionData.data.folderAdded.id
            )) {
              return existingFoldersRef
            }

            return [...existingFoldersRef, newFolderRef]
          }
        }
      })
    },
  })
  useSubscription(FOLDER_DELETED_SUBSCRIPTION, {
    onSubscriptionData(data) {
      const { client, subscriptionData } = data
      const { cache } = client
      if (!subscriptionData.data) return
      cache.evict({
        id: `Folder:${subscriptionData.data.folderDeleted.id}`,
      })
    },
  })
  const [deleteFolder] = useMutation(DELETE_FOLDER_QUERY, {
    update(cache, { data: { deleteFolder } }) {
      cache.evict({
        id: `Folder:${deleteFolder.id}`,
      })
    }
  })
  const [createTodo] = useMutation(CREATE_TODO_QUERY, {
    update(cache, { data: { createTodo } }) {
      cache.modify({
        id: `Folder:${viewFolderId}`,
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
        },
        optimistic: true,
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

  const handleDeleteFolder = id => deleteFolder({ variables: { id: parseInt(id) } })

  const createCards = () => {
    return getAllFolders.map(folder => {
      return (
        <Card
          title={folder.name}
          key={folder.id}
          style={{ marginBottom: '2em' }}
          footer={
            <span>
              <Button
                label='Open'
                icon='pi pi-folder-open'
                className='p-button-outlined p-button-secondary'
                style={{ marginRight: '8px' }}
                onClick={() => setViewFolderId(folder.id)}
              />
              <Button
                label='Delete'
                icon='pi pi-trash'
                className='p-button-outlined p-button-danger'
                onClick={() => handleDeleteFolder(folder.id)}
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
  const handleCreateTodo = input => {
    const firstName = sessionStorage.getItem('userFirstName')
    const lastName = sessionStorage.getItem('userFirstName')
    return createTodo({
      variables: { input: { ...input, userId: parseInt(userId) } },
      optimisticResponse: {
        createTodo: {
          id: 'temp-id',
          __typename: 'Todo',
          name: input.name,
          description: input.description,
          isCompleted: false,
          user: {
            __typename: 'User',
            id: userId,
            firstName,
            lastName,
          }
        }
      }
    })
  }

  const handleSaveFolder = () => {
    return createFolder({ variables: { input: { name: folderName, userId: parseInt(userId) } } })
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
        <h3>{`Welcome ${sessionStorage.getItem('userFirstName')} ${sessionStorage.getItem('userLastName')}!`}</h3>
        <Button label='Add new folder' className='p-button-rounded' style={{margin: '16px'}} onClick={() => setOpenFolderForm(true)} />
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
