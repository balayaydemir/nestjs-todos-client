import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { FOLDERS_QUERY, CREATE_FOLDER_QUERY } from "../gql/folder";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import Folder from './Folder'

const Home = ({ userId }) => {
  const [openFolderForm, setOpenFolderForm] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [viewFolder, setViewFolder] = useState(null)
  const { data, loading } = useQuery(FOLDERS_QUERY)
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
                label="Open"
                icon="pi pi-folder-open"
                className="p-button-outlined p-button-secondary"
                onClick={() => setViewFolder(folder)}
              />
            </span>
          }
        >
          {`${folder.todos.length} todo${folder.todos.length === 1 ? '' : 's'}`}
        </Card>
      )
    })
  }

  const handleCloseFolderForm = () => {
    setOpenFolderForm(false)
    setFolderName('')
  }

  const handleSaveFolder = () => {
    return createFolder({ variables: { input: { name: folderName } } })
  }

  const renderView = () => {
    if (viewFolder) {
      return <Folder folder={viewFolder} />
    }
    return (
      <>
        <Button label="Add new folder" className="p-button-rounded" style={{margin: '16px'}} onClick={() => setOpenFolderForm(true)}/>
        {createCards()}
        <Dialog
          header="Add new folder"
          visible={openFolderForm}
          style={{width: '50vw'}}
          footer={
            <div>
              <Button label="Cancel" icon="pi pi-times" onClick={handleCloseFolderForm} className="p-button-text"/>
              <Button label="Save" disabled={!folderName} icon="pi pi-check" onClick={handleSaveFolder} autoFocus/>
            </div>
          }
          onHide={handleCloseFolderForm}
        >
              <span className="p-float-label" style={{marginTop: '28px', width: '100%'}}>
              <InputText id="folderName" value={folderName} onChange={e => setFolderName(e.target.value)}  style={{width: '100%'}} />
              <label htmlFor="folderName">Folder name</label>
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
