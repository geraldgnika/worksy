import { API_ENDPOINTS } from './api_endpoints';
import http_interceptors from './http_interceptors';

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile); 

  try {
    const response = await http_interceptors.post(API_ENDPOINTS.USER.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading the image:', error); 
    throw error;
  }
};

export default uploadImage;
