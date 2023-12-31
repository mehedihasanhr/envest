
import axios from '@/lib/axios';

export const verifyMobile = async(code: string, token: string) => {
 
    try{
        let res = await axios.post(`/verify-mobile`, {code}, {
            headers: {
                Authorization: `Bearer ${token}`
            }}
        );
        return res;
    } catch(e) {console.log(e);}
}