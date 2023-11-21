const baseUrl = "http://localhost:5000/api/queries";

let token: null | string = null;

// const setToken = (newToken: string) => {
//   token = `bearer ${newToken}`;
// };

export interface QueryParameters {
  week_start: string;
  week_end: string;
  dma_name: string;
  refresh_start: string;
  refresh_end: string;
  name: string;
}

const create = async (
  requestParameters: QueryParameters,
  access_token: string
) => {
  try {
    console.log(token);
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_token,
      },
      body: JSON.stringify(requestParameters),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during query creation:", error);
    throw error;
  }
};

const queriesService = {
  // setToken,
  create,
};

export default queriesService;
