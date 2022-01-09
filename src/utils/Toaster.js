import { Toaster } from '@blueprintjs/core'

export const CustomToaster = (intent = "success", message = "", position = "bottom-right") => {
    const toaster = Toaster.create({ position })
    toaster.show({
        intent,
        message
    })
}