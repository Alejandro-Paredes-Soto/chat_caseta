import io from 'socket.io-client';

    const socket = io('http://127.0.0.1:9000', {
      path: '/a/d/sio/',
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      query: {
        token: 'AccesoTmpADV12311131'
      }
    })
    socket.on('connect_error', (err) => {
      // console.log('err')
      // console.log(err)
  })
  


   export default socket;


