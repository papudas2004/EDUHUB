import apiClient from "./apiClient";

// ==============================
// CONTACT MANAGEMENT (PRESERVED & UPGRADED)
// ==============================
export const createContact = async (contactData) => {
  return await apiClient.post("/create", contactData);
};

export const getAllContacts = async () => {
  return await apiClient.get("/contact-list");
};

export const getContactById = async (id) => {
  return await apiClient.get(`/find-by/${id}`);
};

export const updateContact = async (id, updatedData) => {
  return await apiClient.put(`/update-contact-by-id/${id}`, updatedData);
};

export const deleteContact = async (id) => {
  return await apiClient.delete(`/delete-contact-by-id/${id}`);
};