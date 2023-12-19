import { type Socket, io} from 'socket.io-client4';
import { ServerToHikvisionConsumerEvents } from '@/app-admin/interfaces/socketio.interfaces'

    const socket: Socket<ServerToHikvisionConsumerEvents> = io('http://127.0.0.1:9000', {
      reconnectionDelayMax: 2000,
      reconnectionDelay: 500,
      path: '/api/socketio/v2',
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true
   
   })

   socket.on('connect_error', (err: Error) => {
    console.log('Error de socket')
    console.log(err)
   })
  
   socket.connect();

   export default socket;


