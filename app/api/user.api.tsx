
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
        if(error)
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
        if(error)
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
        if(error)
        return {error :"some error accured while signin"}
    }
}


export const googleLogin =async(token:string)=>{
    try { 
     
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/google`,{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({token})
        })
        
        return await res.json()
    } catch (error) {
        if(error)
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
        if(error)
        return {error :"some error accured while signin"}
    }
}

export const getMyProfile = async () => {
    try {
        const token = getToken();
        if (!token) {
            return { error: "Not authenticated" };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/getMyProfile`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "auth-token": token
            }
        });
        return await res.json();
    } catch (error) {
        if(error)
        return { error: "Some error occurred while fetching profile" };
    }
};


// ...existing code...

export const updateProfile = async (data: { name?: string; profile?: string }) => {
    try {
        const token = getToken();
        if (!token) {
            return { error: "Not authenticated" };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/updateProfile`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
       if(error)
        return { error: "Some error occurred while updating profile" };
    }
};



export const getUserProfileAndTests = async (id:string) => {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/getUserProfileAndTests/${id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            
            }
        });
        return await res.json();
    } catch (error) {
        if(error)
        return { error: "Some error occurred while fetching user" };
    }
};


export const resetPassword = async (token: string, password: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/resetPassword`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ token, password })
        });
        return await res.json();
    } catch (error) {
        if(error)
        return { error: "Some error occurred while resetting password" };
    }
}