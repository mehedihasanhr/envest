"use client";
import { loginWithUsernameAndPassword } from '@/api/loginApi';
import Button from '@/components/ui/Button'; 
import Input from '@/components/ui/form/Input';
import PasswordInput from '@/components/ui/form/PasswordInput';
import { useGlobalLoading } from '@/context/GlobalLoader';
import { useUser } from '@/context/UserProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import {useLocalStorage} from 'react-use';

export default function Login(){
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('') 
    const [loading, setLoading] = React.useState(false); 
    const [value, setValue] = useLocalStorage('xtx', '');
    const { setGlobalLoading } = useGlobalLoading(); 
    const route = useRouter();
    const {setUser} = useUser();

  
    // submit login system
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        let res = await loginWithUsernameAndPassword({
            username,
            password
        })
        
        if(res?.status === 200){
            setValue(res?.data?.data?.access_token);
            setUser(res?.data?.data?.user);
            route.push('/dashboard');
        }

        setLoading(false);
    } 

    // check user already logged in
    React.useEffect(() => {
        setGlobalLoading(true);
        
        let token = value as string;
        token = token ? token.split('0|')[1] : ''; 

        if(token){
            route.push('/dashboard');
        }else{
            setGlobalLoading(false);
        }
    }, [])

    

    return (
        <div className='w-screen h-screen flex items-center justify-center'>  
            <form action="" className='w-full max-w-[350px] p-5 shadow-md'>

                <div className='text-center mb-4'>
                <h4>Welcome Back</h4>
                <p className='text-sm text-gray-500'>Login to your account</p>
                </div>
                
                <div className='mb-4'>
                    <label htmlFor="">Username</label>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>

                <div className=''>
                    <label htmlFor="">Password</label>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className='py-5'> 
                    <Button
                        type='button'
                        loading={loading ? true : false}
                        onClick={handleSubmit as any}
                        loadingClass='flex item-center space-x-2 bg-primary-500 text-white px-3 py-1.5 w-full rounded-sm'
                        className='bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white px-3 py-1.5 w-full rounded-sm'                  
                    >
                        Login
                    </Button>
                </div>


                <div>
                    <p className='text-center text-sm text-gray-500'>{"Don't have an account?"} <Link href="/register" className='text-blue-500'>Register</Link></p>
                </div>
            </form>  
        </div>
    )

}