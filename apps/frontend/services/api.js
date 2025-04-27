export const login = async (mobile, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      mobile,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (mobile, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      mobile,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 