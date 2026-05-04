import { axiosInstance } from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const generateShareLink = async (resourceType, resourceId, expiryDays = null) => {
  try {
    const payload = { resourceType, resourceId };
    if (expiryDays) payload.expiryDays = expiryDays;

    const response = await axiosInstance.post(API_PATHS.SHARE.GENERATE, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate share link' };
  }
};

const getSharedResource = async (token) => {
  try {
    const response = await axiosInstance.get(API_PATHS.SHARE.GET_SHARED(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch shared resource' };
  }
};

const getMyShareLinks = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.SHARE.GET_MY_LINKS);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch share links' };
  }
};

const revokeShareLink = async (token) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.SHARE.REVOKE(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to revoke share link' };
  }
};

const updateShareLink = async (token, expiryDays, isActive) => {
  try {
    const payload = {};
    if (expiryDays !== undefined) payload.expiryDays = expiryDays;
    if (isActive !== undefined) payload.isActive = isActive;

    const response = await axiosInstance.patch(API_PATHS.SHARE.UPDATE(token), payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update share link' };
  }
};

export { generateShareLink, getSharedResource, getMyShareLinks, revokeShareLink, updateShareLink };
