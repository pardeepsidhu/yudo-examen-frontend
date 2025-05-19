export const genereateContent = async (prompt:string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ai/generete`, {
        method: "post",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({prompt})
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to generete AI content");
      }
  
      return data;
    } catch (error) {
     if(error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generete AI content" 
      };
    }
  };