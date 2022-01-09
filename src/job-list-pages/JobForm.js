import React, { memo, useEffect, useState } from 'react'
import { FormGroup, InputGroup, Intent, Menu, MenuItem, Popover, PopoverPosition, Button, Classes, Card } from '@blueprintjs/core'
import { useFormik } from 'formik'
import *as yup from 'yup'
import { InitialFormData } from '../constants/InitialFormData';
import { LocalStorageTerminal } from '../utils/LocalStorageTerminal';
import { CustomToaster } from '../utils/Toaster';
import axios from 'axios';
import { SortDatas, } from '../utils/SortDatas';


const jobRegex = /^[A-Za-z]+$/;
const createdValidationSchema = yup.object().shape({
    job: yup.string().max(70, 'Maximum 70 character').matches(jobRegex, 'Only English letters').required('Required field'),
    priority: yup.object().required("Required field")
})
let dummy = [
    { name: "Urgent", ordinal: 1 },
    { name: "Regular", ordinal: 2 },
    { name: "Trivial", ordinal: 3 }
]

const JobForm = props => {
    const [priorityList, setPriorityList] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8080/').then(res => {
            if (res?.data)
                setPriorityList(res.data)
            else (setPriorityList(dummy))
        })
    }, [])

    const onSave = values => {
        const isJobExist = props?.dataList.find(data => data?.job === values?.job)

        if (!isJobExist) {
            let newArr = [...props.dataList]
            newArr.push(values)
            LocalStorageTerminal.setItem("jobList", newArr).then(() => {
                LocalStorageTerminal.getItem("jobList").then(val => {
                    const sortedData = SortDatas(val)
                    props.setDataList(sortedData)
                    CustomToaster("success", "Job Added")
                }
                )
            })
        } else CustomToaster("danger", "Error! Job Added Before")
    }
    const onUpdate = values => {
        let newArr = [...props.dataList]
        const indexOfSameVal = newArr.findIndex(data => data.job === values.job)
        newArr[indexOfSameVal] = values
        console.log(newArr)
        LocalStorageTerminal.setItem("jobList", newArr).then(() => {
            LocalStorageTerminal.getItem("jobList").then(val => {
                const sortedData = SortDatas(val)
                props.setDataList(sortedData)
                CustomToaster("success", "Job Updated")

            })
        })


    }
    const formik = useFormik({
        initialValues: props?.editData ? props.editData : InitialFormData,
        validationSchema: createdValidationSchema,
        onSubmit: values => (props.editData ? onUpdate(values) : onSave(values))
    })
    const {
        values,
        errors,
        handleBlur,
        handleChange,
        setFieldValue,
        handleSubmit,
    } = formik
    return (
        <div className='job-container'>
            <Card className='card-width'>

                <FormGroup
                    label="Job: "
                    helperText={errors?.job || ""}
                    intent="danger"
                >
                    <InputGroup value={values?.job} onChange={handleChange} disabled={props?.editData} intent={errors?.job ? Intent.DANGER : Intent.NONE} name="job" onBlur={handleBlur}
                    // maxLength={70}
                    />
                </FormGroup>
                <FormGroup
                    label="Priority:"
                    intent='danger'
                    helperText={errors?.priority || ""}
                >
                    <Popover position={PopoverPosition.BOTTOM} captureDismiss={true}>
                        <Button text={values?.priority?.name || "Seçiniz"} rightIcon="chevron-down" onBlur={handleBlur} className={Classes.POPOVER_DISMISS_OVERRIDE} />
                        <Menu>
                            {priorityList.map((data, i) => (
                                <MenuItem key={i} text={data.name} onClick={() => setFieldValue('priority', data)} className={Classes.POPOVER_DISMISS_OVERRIDE} />
                            ))}
                        </Menu>
                    </Popover>

                </FormGroup>
                <Button text={props?.editData ? "Update" : "Create"} intent={Intent.SUCCESS} onClick={handleSubmit} />
            </Card>
        </div>
    )
}
export default memo(JobForm)