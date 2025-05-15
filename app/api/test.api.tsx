import { getToken } from "./user.api";
import axios from "axios";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question/update/${questionData._id}`, {
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

export const getAllTestSeries = async (page: number = 1, limit: number = 10, category?: string, search?: string) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(search && { search })
    });

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/getAll?${queryParams}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching test series:', error);
    throw error;
  }
};

export const getTest = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/getTest/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      }
    });

    const data = await res.json();
    
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

export const getAttendTest = async (testId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question/getCurrentTestAttempt/${testId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      }
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch test attempt");
    }

    return data;
  } catch (error) {
    console.error("Error handling test attempt:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to handle test attempt" 
    };
  }
};

export const answerQuestion = async (testId: string, questionId: string, right: boolean) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question/answerQuestion`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      },
      body: JSON.stringify({
        testId,
        questionId,
        right
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to record answer");
    }

    return data;
  } catch (error) {
    console.error("Error recording answer:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to record answer" 
    };
  }
};

export const getTestResults = async (testId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question/getTestResults/${testId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      }
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch test results");
    }

    return data;
  } catch (error) {
    console.error("Error fetching test results:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch test results" 
    };
  }
};

export const getMyAllTestSeries = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/getTests`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch your test series");
    }

    return data;
  } catch (error) {
    console.error("Error fetching your test series:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch your test series" 
    };
  }
};


export const getMyAllTestAttended = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/getMyAllTestAttended`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      }
    });
console.log(res)
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch attended test series");
    }
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching attended test series:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch attended test series" 
    };
  }
};

export const deleteMyTest = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/test/deleteMyTest/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "auth-token": getToken()
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete test series");
    }

    return data;
  } catch (error) {
    console.error("Error deleting test series:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete test series" 
    };
  }
};