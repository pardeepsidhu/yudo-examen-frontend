
export const getToken = ()=>{
    const user=localStorage.getItem("user")
    if(!user) return null
    return JSON.parse(user).token;
}

export const signup =async(email:string,password:string)=>{
    try { 
      
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/signup`,{
            method:"post",
            headers:{
                "content-type":"application/json",
            },
            body:JSON.stringify({email,password})
        })
        return await res.json()
    } catch (error) {
        console.log(error)
        return {error :"some error accured while signup"}
    }
}


export const signin =async(email:string,password:string)=>{
    try { 
      
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/login`,{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({email,password})
        })
        
        return await res.json()
    } catch (error) {
        console.log(error)
        return {error :"some error accured while signin"}
    }
}

export const otpVerify =async(email:string,otp:string)=>{
    try { 
      
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/verify`,{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({email,otp})
        })
        
        return await res.json()
    } catch (error) {
        console.log(error)
        return {error :"some error accured while signin"}
    }
}


export const googleLogin =async(token:string)=>{
    try { 
      console.log("this is token "+token)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/google`,{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({token})
        })
        
        return await res.json()
    } catch (error) {
        console.log(error)
        return {error :"some error accured while signin"}
    }
}

export const sendResetPassLink =async(email:string)=>{
    try { 
   
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/resetPassLink`,{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({email})
        })
        return await res.json()
    } catch (error) {
        console.log(error)
        return {error :"some error accured while signin"}
    }
}