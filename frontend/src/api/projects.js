import api from './axios';

/**
 * Fetch projects data from the backend
 * @param {Object} params - Query parameters for filtering/sorting projects
 * @returns {Promise} Promise object containing projects data
 */
export const fetchProjects = async (params = {}) => {
    try {
        const response = await api.get('/projects', { params });        
        return response.data;
    } catch (error) {
        console.error(`Error fetching projects with params ${JSON.stringify(params)}:`, error.response ? error.response.data : error);
        throw error;
    }
};

/**
 * Fetch a single project by ID
 * @param {string} id - Project ID
 * @returns {Promise} Promise object containing project data
 */
export const fetchProjectById = async (id) => {
    try {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching project with id ${id}:`, error.response ? error.response.data : error);
        throw error;
    }
};

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise} Promise object containing the created project
 */
export const createProject = async (projectData) => {
    try {
        const response = await api.post('/projects', projectData);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error.response ? error.response.data : error);
        throw error;
    }
};

/**
 * Update an existing project
 * @param {string} id - Project ID
 * @param {Object} updatedProject - Updated project data
 * @returns {Promise} Promise object containing the updated project
 */
export const updateProject = async (id, updatedProject) => {
    try {
        const response = await api.put(`/projects/${id}`, updatedProject);
        return response.data;
    } catch (error) {
        console.error(`Error updating project with id ${id}:`, error.response ? error.response.data : error);
        throw error;
    }
};

/**
 * Delete a project
 * @param {string} id - Project ID
 * @returns {Promise} Promise object containing the result of deletion
 */
export const deleteProject = async (id) => {
    try {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting project with id ${id}:`, error.response ? error.response.data : error);
        throw error;
    }
};
export const fetchCompletedProjectsForInvoicing = async () => {
  try {
    const allProjects = await fetchProjects();
    console.log(allProjects, "hghhg");

    // Corrected: Access the project list from `data`
    if (!Array.isArray(allProjects.data)) {
      console.error("Projects array is undefined or not an array:", allProjects.data);
      throw new Error("Failed to load projects for invoicing");
    }

    const completedProjects = allProjects.data.filter(project =>
      project.status === 'completed' &&
      (!project.invoiceStatus || project.invoiceStatus === 'Not Invoiced')
    );

    console.log("completed pro", completedProjects);

    return {
      projects: completedProjects,
      team: allProjects.team // Optional, depends on your API
    };
  } catch (error) {
    console.error('Error fetching completed projects for invoicing:', error);
    throw error;
  }
};


export const markProjectAsInvoiced = async (id, invoiceData) => {
    try {
        // In a real app, you would send a PUT request to update this in the backend
        // const response = await api.put(`/api/projects/${id}/invoice`, invoiceData);
        // return response.data;

        const project = await fetchProjectById(id);

        // Mark the project as invoiced
        return {
            ...project,
            status: 'Invoiced',
            invoiceStatus: 'Invoiced',
            invoiceData: {
                ...invoiceData,
                createdAt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error(`Error marking project ${id} as invoiced:`, error);
        throw error;
    }
}; 