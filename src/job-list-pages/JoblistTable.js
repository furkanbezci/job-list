import React, { useEffect, useState } from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import JobForm from './JobForm';
import { ActionCellRenderer } from './cellRenderers/ActionCellRenderer';
import { LocalStorageTerminal } from '../utils/LocalStorageTerminal';
import { CustomToaster } from '../utils/Toaster';
import axios from 'axios';
import { SortDatas } from '../utils/SortDatas';

const JoblistTable = () => {
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        let jobDatasInLocalStorage = localStorage.getItem("jobList")
        if (jobDatasInLocalStorage) {
            const sortedData = SortDatas(JSON.parse(jobDatasInLocalStorage))
            setDataList(sortedData)
        }
    }, [])

    // onChange={(e) => {
    //     let value = e.target.value

    //     value = value.replace(/[^A-Za-z]/ig, '')

    //     this.setState({
    //       value,
    //     })
    //   }}
    const onConfirmDelete = item => {
        const filtered = dataList.filter(data => data.job !== item.job)

        LocalStorageTerminal.setItem("jobList", filtered).then(val => {
            setDataList(filtered);
            CustomToaster("success", "Job Deleted")
        })
    }



    return (
        <div style={{ height: 600 ,padding:5}}>

            <JobForm setDataList={setDataList} dataList={dataList} />
            <div className='ag-theme-alpine' style={{ height: 500 }} >
                <AgGridReact
                    style={{ height: 500 }}
                    rowData={dataList}
                    defaultColDef={{
                        sortable: true,
                        minWidth: 80,
                        filter: true,
                        resizable: true,
                        autoHeight: true,
                        wrapText: true,
                        flex: 1,
                        floatingFilter: true,
                    }}
                    frameworkComponents={{
                        actionCellRenderer: ActionCellRenderer,
                    }}
                    // domLayout={'autoHeight'}
                    pagination={true}
                    paginationPageSize={10}
                    rowClassRules={{
                        'priority-urgent': function (params) {
                            const { name } = params.data.priority
                            if (name === "Urgent")
                                return (name)
                        },
                        'priority-regular': function (params) {
                            const { name } = params.data.priority
                            if (name === "Regular")
                                return (name)
                        },
                        'priority-trivial': function (params) {
                            const { name } = params.data.priority
                            if (name === "Trivial")
                                return (name)
                        },

                    }}
                    postSort={(rowNodes) => {
                        let nextInsertPos = 0;
                        for (let i = 0; i < rowNodes.length; i++) {
                            const priority = rowNodes[i].data.priority;
                            if (priority === 'Urgent') {
                                rowNodes.splice(nextInsertPos, 0, rowNodes.splice(i, 1)[0]);
                                nextInsertPos++;
                            }
                        }
                    }}

                >
                    <AgGridColumn headerName="Job" field="job" />
                    <AgGridColumn headerName="Priority" field="priority.name"
                    />
                    <AgGridColumn headerName="Actions" field="actions" cellRenderer="actionCellRenderer"
                        cellRendererParams={{
                            onConfirmDelete: onConfirmDelete,
                            dataList: dataList,
                            setDataList: setDataList,
                        }}
                    />
                </AgGridReact>
            </div>
            

        </div>
    )
}
export default JoblistTable