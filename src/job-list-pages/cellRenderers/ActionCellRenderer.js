import React, { useState } from 'react'
import { Button, Classes, Popover } from '@blueprintjs/core'
import JobForm from '../JobForm'

export const ActionCellRenderer = params => {
    const data = params.data
    const [isOpenPopover, setIsOpenPopover] = useState(false)
    const [editData,setEditData] = useState()

    const onClickEdit = data => {
        setEditData(data)
    }
    
    return (
        <>
            <Popover
                content={
                    editData &&

                    <JobForm  dataList={params.dataList} setDataList={params.setDataList} editData={editData} />
                }
            >
                <Button text="edit" icon="edit"  onClick={() => onClickEdit(data)} minimal />

            </Popover>

            <Popover
                content={
                    <div style={{ padding: 14 }}>
                        <div className='mb-10'>Are you sure you want to delete the job?</div>
                        <div className='flex-end'>
                            <Button
                                text='Yes'
                                onClick={() => params.onConfirmDelete(data)}
                                intent='danger'
                                className={Classes.POPOVER_DISMISS}
                            />
                            <Button className="ml-10" text='Cancel' className={Classes.POPOVER_DISMISS} />
                        </div>
                    </div>
                }
            >
                <Button text="delete" icon="trash" minimal />
            </Popover>
        </>
    )
}