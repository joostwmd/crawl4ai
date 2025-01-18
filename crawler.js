const axios = require("axios");
require("dotenv").config();

const API_BASE_URL = "http://localhost:11235";
const API_TOKEN = process.env.CRAWL4AI_API_TOKEN;

const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
};

// Function to get task result
async function getTaskResult(taskId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/task/${taskId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting task result:", error.message);
    throw error;
  }
}

// Function to submit and wait for results
async function crawlAndWait(timeout = 300000) {
  // 5 minute timeout
  try {
    // Submit the crawl request
    const response = await axios.post(
      `${API_BASE_URL}/crawl`,
      {
        urls: "https://example.com",
        crawler_params: {
          verbose: true,
        },
        extraction_config: {
          type: "llm",
          params: {
            provider: "openai/gpt-3.5-turbo",
            api_key: process.env.OPENAI_API_KEY,
            instruction: "Extract main topics from the page",
            schema: {
              type: "object",
              properties: {
                topics: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of main topics found on the page",
                },
              },
            },
            extraction_type: "schema",
          },
        },
      },
      { headers }
    );

    const taskId = response.data.task_id;
    console.log("Task submitted with ID:", taskId);

    // Poll for results
    const startTime = Date.now();
    while (true) {
      if (Date.now() - startTime > timeout) {
        throw new Error("Task timed out");
      }

      const result = await getTaskResult(taskId);
      console.log("Current status:", result.status);

      if (result.status === "completed") {
        // Parse and return the extracted content
        const extractedData = JSON.parse(
          result.result?.extracted_content || "{}"
        );
        console.log("\nExtracted Data:");
        console.log(JSON.stringify(extractedData, null, 2));
        return extractedData;
      }

      // Wait 2 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}

// Run the crawler
async function main() {
  try {
    await crawlAndWait();
  } catch (error) {
    console.error("Main error:", error.message);
  }
}

main();
