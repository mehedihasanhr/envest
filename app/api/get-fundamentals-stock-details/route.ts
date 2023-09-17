import { ApiConfig } from '@/config/apiConfig'
import axios from 'axios'
import { NextResponse } from 'next/server'

 

export const dynamic = 'force-dynamic';
// get exchange data
export async function GET (request : Request){
    // exchange id from request
    const {searchParams} = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const exchange = searchParams.get('exchange');
    // const lang = searchParams.get('lang');
    const baseUrl = ApiConfig.baseUrl 
    
  const symbolExchange = `${symbol}.${exchange}`;
    
  const url = `${baseUrl}/fundamentals/${symbolExchange}?apitoken=${ApiConfig.apiKey}` 
 
   
  try{
      const response = await axios.get(url) 
      const data = await response.data

      try{ 
        if(data.General.LogoURL == null){
            // return genaral data
            return new Response(JSON.stringify(data), {
              headers: {  
                'content-type': 'application/json;charset=UTF-8',
              },
            })
        }
        
        const logo = await axios.get(`${baseUrl}${data.General.LogoURL}?apitoken=${ApiConfig.apiKey}`)  
        data.General.logo = await logo.data;

          
      // return genaral data
      return new Response(JSON.stringify(data), {
        headers: {  
          'content-type': 'application/json;charset=UTF-8',
        },
      })
      }catch(error:any){
        console.log(error);
      } 
  }catch(error:any){
    console.log(error);
  } 
} 