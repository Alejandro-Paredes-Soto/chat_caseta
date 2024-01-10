import { notification } from 'antd';


const useNotification = ({ type, message, description, duration }:
    { type: 'error' | 'info' | 'success' | 'warning', message: string, description: string, duration: number }) => {

    notification.config({
        maxCount: 1,
        duration: duration
    })
    
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.open({
            message: message,
            description: description,
            duration: duration,
            type: type
        })
    
    }

    return {
        openNotification,
        contextHolder
    }

}

export default useNotification