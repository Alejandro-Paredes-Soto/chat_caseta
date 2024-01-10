import axios from 'axios';

const useLogin = ({ user, password }: { user: string; password: string }) => {



  const TOKEN1 = "4j~j-~x*!=_|zW6%:Yw;fx:~|_:bR_~+!EYR4E.-=2X*q:~!6c-;.Av%5|!F*|2-8e=8F.|.-5+*:m.!%79f::%:+2+J%=!;C5~-";
  

  const onLgniC2 = async (): Promise<{ status: number; data: any; message: string }> => {
    try {
    
        const req2 = await axios.post('http://localhost:10003/Data/ADV/CsE/87/LgniC2', { User: user, Password: password, L: TOKEN1 });
        
        return { status: req2.status, data: req2.data, message: req2.statusText };

  
    } catch (error: any) {
      

      return { status: 500, data: [], message: error.message };
    }
  };

  return { onLgniC2 };
};


export default useLogin