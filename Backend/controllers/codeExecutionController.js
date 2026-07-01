import axios from 'axios';
export const runCode = async (req, res) => {
  try{
    const {code,language_id}=req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const options = {
      method: 'POST',
      url: `https://${process.env.RAPIDAPI_HOST}/submissions`,
      params: { 
        base64_encoded: 'false', 
        wait: 'true' 
      },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
      },
      data: {
        language_id: language_id || 63,
        source_code: code,
        stdin: req.body.stdin || ''
      }
    };

    const response = await axios.request(options);
    const result = response.data;

    res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      status: result.status,
      time: result.time,
      memory: result.memory
    });

  } catch (error) {
    console.error("Code Execution Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    res.status(500).json({ 
      message: "Code execution failed", 
      error: error.response?.data?.message || error.message 
    });
  }
};
