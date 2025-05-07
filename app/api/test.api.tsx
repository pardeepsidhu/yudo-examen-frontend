import { getToken } from "./user.api";

interface TestSeriesData {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  credits: string;
  _id?:string;
}

interface Question {
  _id?:string;
  title: string;
  description?: string;
  solution?: string;
  options: string[];
  rightOption: string;
  image?: string;
  video?: string;
  shorts?: string[];
  testSeriesId: string;
}

export const createTest =async(testSeriesData:TestSeriesData)=>{
    try { 
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/create`,{
            method:"post",
            headers:{
                "content-type":"application/json",
                "auth-token":getToken()
            },
            body:JSON.stringify(testSeriesData)
        })
        return await res.json()
    } catch (error) {
        console.log(error)
        return {error :"some error accured while signup"}
    }
}


export const getMyTest = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/getMyTest/${id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "auth-token": getToken()
            }
        });

        const data = await res.json();
        
        console.log(data)
        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch test");
        }

        return data;
    } catch (error) {
        console.error("Error fetching test:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to fetch test" 
        };
    }
};



export const updataMyTest =async(testSeriesData:TestSeriesData)=>{
    try { 
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/update`,{
            method:"put",
            headers:{
                "content-type":"application/json",
                "auth-token":getToken()
            },
            body:JSON.stringify(testSeriesData)
        })
        return await res.json()
    } catch (error) {
        console.log(error)
        return {error :"some error accured while updating test"}
    }
}

export const addNewQuestion = async (questionData: Question) => {
  try {
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question/create`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      },
      body: JSON.stringify(questionData)
    });

    const data = await res.json();
    console.log(data)
    if (!res.ok) {
      throw new Error(data.message || "Failed to add question");
    }

    return data;
  } catch (error) {
    console.error("Error adding question:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add question" 
    };
  }
};


export const updageMyQuestion = async (questionData: Question) => {
    try {
        console.log(questionData)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question/update`, {
        method: "put",
        headers: {
          "content-type": "application/json",
          "auth-token": getToken()
        },
        body: JSON.stringify(questionData)
      });
  
      const data = await res.json();
      console.log(data)
      if (!res.ok) {
        throw new Error(data.message || "Failed to update question");
      }
  
      return data;
    } catch (error) {
      console.error("Error updating question:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update question" 
      };
    }
  };


  export const deleteMyQuestion = async (testId:string,id:string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question/delete/${id}`, {
        method: "delete",
        headers: {
          "content-type": "application/json",
          "auth-token": getToken()
        },
        body: JSON.stringify({testId})
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update question");
      }
  
      return data;
    } catch (error) {
      console.error("Error updating question:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update question" 
      };
    }
  };