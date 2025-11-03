import api from '../config/api.js';

export const memberAPI = {
    submitApplication: async (data) => {
        const response = await api.post('/api/members/apply', data);
        return response.data;
    },

    //protected
    getAllMembers: async (status) => {
        const response = await api.get('/api/members', {
            params: { status }
        });

        return response.data;
    },

    getMember: async (id) => {
        const response = await api.get(`/api/members/${id}`);
        return response.data;
    },

    //protected
    updateMember: async (id, data) => {
        const response = await api.put(`/api/members/${id}`, data);
        return response.data;
    },

    //protected
    deleteMember: async (id) => {
        const response = await api.delete(`/api/members/${id}`);
        return response.data;
    }
};

export const eventAPI = {
    getAllEvents: async (filters) => {
        const response = await api.get('/api/events', { params: filters });
        return response.data;
    },

    getEvent: async (id) => {
        const response = await api.get(`/api/events/${id}`);
        return response.data;
    },

    //protected
    createEvent: async (data) => {
        const response = await api.post('/api/events', data);
        return response.data;
    },

    //protected
    updateEvent: async (id, data) => {
        const response = await api.put(`/api/events/${id}`, data);
        return response.data;
    },

    //protected
    deleteEvent: async (id) => {
        const response = await api.delete(`/api/events/${id}`);
        return response.data;
    }
};

export const scholarshipAPI = {
    submitApplication: async (formData) => {
        const response = await api.post('/api/scholarship/apply', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    downloadForm: async () => {
        const response = await api.get('/api/scholarship/download-form', {
            responseType: 'blob'
        });
        return response.data;
    },

    getAllScholarships: async (status) => {
        const response = await api.get('/api/scholarship', {params: { status }});
        return response.data;
    },

    getScholarship: async (id) => {
        const response = await api.get(`/api/scholarship/${id}`);
        return response.data;
    },

    updateScholarship: async (id, data) => {
        const response = await api.put(`/api/scholarship/${id}`, data);
        return response.data;
    }
};

export const authAPI = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    },
    
    // Logout
    logout: async () => {
        const response = await api.post('/api/auth/logout');
        localStorage.removeItem('token');
        return response.data;
    }
};


