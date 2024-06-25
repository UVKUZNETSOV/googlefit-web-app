import axios from 'axios';

const call = async (accessToken) => {
  try {
    const apiUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources';

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(apiUrl, { headers });

    console.log('API response:', response.data);

    return response.data;

  } catch (error) {
    console.error('Error: ', error);
  }
};

export default call;
