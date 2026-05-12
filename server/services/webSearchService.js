import axios from "axios";

export const searchWeb =
  async (query) => {

    try {

      const response =
        await axios.post(
          "https://api.tavily.com/search",
          {
            api_key:
              process.env.TAVILY_API_KEY,

            query,

            search_depth:
              "basic",

            include_answer: true,

            max_results: 5,
          }
        );

      return response.data;

    } catch (error) {

      console.log(
        "WEB SEARCH ERROR:",
        error.message
      );

      return null;
    }
  };