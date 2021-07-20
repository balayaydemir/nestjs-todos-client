import React, {useState} from 'react'
import { DataTable } from "primereact/datatable"
import { Column } from 'primereact/column'

const Folder = ({ folder }) => {
  const rows = folder.todos.map(todo => ({
      id: todo.id,
      name: todo.name,
      description: todo.description,
      isCompleted: todo.isCompleted,
      userName: `${todo.user.firstName} ${todo.user.lastName}`,
    }))

  const getStatusLabel = (status) => {
    switch (status) {
      case true:
        return 'Completed';

      case false:
        return 'In progress';

      default:
        return 'In progress';
    }
  }

  const statusBodyTemplate = (rowData) => {
    return getStatusLabel(rowData.isCompleted);
  }

  const editableTable = (
    <div className="card">
      <h2>{folder.name}</h2>
      <DataTable value={rows} dataKey="id">
        <Column field="name" header="Name" />
        <Column field="description" header="Description" />
        <Column field="isCompleted" header="Status" body={statusBodyTemplate} />
        <Column field="userName" header="Added by" />
        <Column body={() => <div><button>save</button></div>} />
      </DataTable>
    </div>
  )

  return <div>{editableTable}</div>
}

export default Folder
