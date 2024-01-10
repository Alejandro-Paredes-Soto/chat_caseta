import axios from 'axios'


export const methodGet = async (servidor: string, endPoint: string, token: string) => {
    try {
        
        const BASE_URL = `http://${servidor}:10003/Data/ADV/CsE/87/${endPoint}`

        const response = await axios.get(BASE_URL, { headers: {
            token
        }})

        const status = await response.status
        const data = await response.data
       
        return {
            status,
            data
        }
    } catch (error: any) {
           
        return {
            status: 500,
            data: []
        }

    }
}


export const methodPost = async (servidor: string, endPoint: string, token: string, data: any) => {

    try {
        const BASE_URL = `http://${servidor}:10003/Data/ADV/CsE/87/${endPoint}`

        const response = await axios.post(BASE_URL, data, {
            headers: {
                token
            }
        })

        const status = await response.status
        const dataResponse = await response.data

        return {
            status,
            data: dataResponse
        }
    } catch (error) {
         
        return {
            status: 500,
            data: []
        }
    }
}

