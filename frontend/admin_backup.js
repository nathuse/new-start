// Admin Dashboard JavaScript - Simple File-Based System (No Server)

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const adminSections = document.querySelectorAll('.admin-section');
const projectsGrid = document.getElementById('projectsGrid');
const equipmentsGrid = document.getElementById('equipmentsGrid');

const uploadForm = document.getElementById('uploadForm');
const addEquipmentForm = document.getElementById('addEquipmentForm');

const fileUploadArea = document.getElementById('fileUploadArea');
const uploadedFiles = document.getElementById('uploadedFiles');

const deleteModal = document.getElementById('deleteModal');
const notification = document.getElementById('notification');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// File Management - Using localStorage for persistence
let galleryImages = [];
let equipmentImages = [];
let jobs = []; // Add jobs array

// Load data from localStorage
function loadLocalData() {
    try {
        const savedGallery = localStorage.getItem('galleryImages');
        const savedEquipment = localStorage.getItem('equipmentImages');
        const savedJobs = localStorage.getItem('jobs');
        
        if (savedGallery) {
            galleryImages = JSON.parse(savedGallery);
        }
        
        if (savedEquipment) {
            equipmentImages = JSON.parse(savedEquipment);
        }
        
        if (savedJobs) {
            jobs = JSON.parse(savedJobs);
        }
        
        // If no data exists, initialize with sample data
        if (galleryImages.length === 0 && equipmentImages.length === 0 && jobs.length === 0) {
            initializeSampleData();
        }
    } catch (error) {
        console.error('Failed to load local data:', error);
    }
}

// Initialize with actual images from uploads folders
function initializeSampleData() {
    // Clear any old data first
    localStorage.removeItem('galleryImages');
    localStorage.removeItem('equipmentImages');
    localStorage.removeItem('jobs');
    
    // Sample gallery images (projects) - these would come from uploads/gallery/ folder
    galleryImages = [
        {
            filename: 'c57f57e9-8e3a-4aab-abaf-7dcb3a4f8b95.jpg',
            title: 'Construction Project 1',
            type: 'project',
            createdAt: new Date().toISOString()
        },
        {
            filename: '2025-08-04 22_43_08-TABU COMPANY PROFILE.docx (Protected View) - Word.png',
            title: 'Company Profile',
            type: 'project',
            createdAt: new Date().toISOString()
        },
        {
            filename: 'photo_2025-08-04_17-33-00.jpg',
            title: 'Construction Site',
            type: 'project',
            createdAt: new Date().toISOString()
        }
    ];
    
    // Equipment folder is empty for now
    equipmentImages = [];
    
    // Initialize with sample jobs
    jobs = [
        {
            id: 'job-001',
            title: 'Senior Construction Manager',
            department: 'Construction Management',
            location: 'Addis Ababa, Ethiopia',
            type: 'Full-time',
            experience: '5-8 years',
            salary: 'Competitive salary with benefits',
            description: 'We are seeking an experienced Construction Manager to oversee large-scale construction projects.',
            requirements: [
                'Bachelor\'s degree in Civil Engineering or Construction Management',
                'Minimum 5 years of construction management experience',
                'Strong project management and leadership skills'
            ],
            responsibilities: [
                'Oversee all aspects of construction projects from planning to completion',
                'Manage project budgets, timelines, and quality standards',
                'Coordinate with architects, engineers, and subcontractors'
            ],
            benefits: [
                'Competitive salary package',
                'Health insurance',
                'Professional development opportunities'
            ],
            postedDate: '2024-01-15',
            status: 'active'
        }
    ];
    
    // Save to localStorage
    saveLocalData();
    
    console.log('Admin panel initialized with actual images from uploads folders:', galleryImages.length, 'gallery images,', equipmentImages.length, 'equipment images,', jobs.length, 'jobs');
}

// Save data to localStorage
function saveLocalData() {
    try {
        localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
        localStorage.setItem('equipmentImages', JSON.stringify(equipmentImages));
        localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch (error) {
        console.error('Failed to save local data:', error);
    }
}

// Navigation functionality
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        adminSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetSection).classList.add('active');
        
        // Load section-specific data
        loadSectionData(targetSection);
    });
});

// Authentication Functions
function login(username, password) {
    if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
        showAdminContent();
        return true;
    } else {
        showNotification('Invalid credentials', 'error');
        return false;
    }
}

function logout() {
    window.location.reload();
}

// UI Visibility Management
function showLogin() {
    document.getElementById('login').classList.add('active');
    document.querySelector('.admin-header').style.display = 'none';
    document.querySelector('.admin-nav').style.display = 'none';
    
    adminSections.forEach(section => {
        if (section.id !== 'login') {
            section.classList.remove('active');
        }
    });
}

function showAdminContent() {
    document.getElementById('login').classList.remove('active');
    document.querySelector('.admin-header').style.display = 'flex';
    document.querySelector('.admin-nav').style.display = 'block';
    document.getElementById('dashboard').classList.add('active');
    
    // Update nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === 'dashboard') {
            link.classList.add('active');
        }
    });
    
    // Load initial data
    loadSectionData('dashboard');
}

// Dashboard functionality
async function updateDashboardStats() {
    try {
        loadLocalData();
        
        const totalProjects = galleryImages.length;
        const totalEquipments = equipmentImages.length;
        
        document.getElementById('totalProjects').textContent = totalProjects;
        document.getElementById('totalEquipments').textContent = totalEquipments;
        document.getElementById('totalGalleryImages').textContent = totalProjects; // Same as projects since they're in gallery
        
        // Load recent uploads
        loadRecentUploads();
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

async function loadRecentUploads() {
    try {
        const recentUploads = document.getElementById('recentUploads');
        const allItems = [...galleryImages, ...equipmentImages];
        
        // Sort by creation time (newest first) and take first 6
        const recent = allItems
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 6);
        
        recentUploads.innerHTML = `
            <h3>Recent Uploads</h3>
            <div class="recent-uploads-grid">
                ${recent.map(item => {
                    const img = item.type === 'equipment' ? `../uploads/equipment/${item.filename}` : `../uploads/gallery/${item.filename}`;
                    const title = item.title || item.name || item.filename;
                    const type = item.type === 'equipment' ? 'Equipment' : 'Project';
                    return `
                        <div class="upload-item-grid">
                            <img src="${img}" alt="${title}" class="upload-thumbnail-grid">
                            <div class="upload-info-grid">
                                <h4>${title}</h4>
                                <p>${type}</p>
                                <small>${formatDate(item.createdAt)}</small>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Failed to load recent uploads:', error);
    }
}

// Projects management (reads from local data)
async function loadProjects() {
    try {
        loadLocalData();
        
        projectsGrid.innerHTML = galleryImages.map(image => {
            const img = `../uploads/gallery/${image.filename}`;
            return `
                <div class="project-card" data-filename="${image.filename}">
                    <div class="project-image">
                        <img src="${img}" alt="${image.title}">
                        <div class="project-overlay">
                            <div class="project-actions">
                                <button class="delete-btn" onclick="openDeleteModal('gallery', '${image.filename}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${image.title}</h3>
                        <span class="project-category">Project</span>
                        <p class="project-description">Construction project image</p>
                        <div class="project-meta">
                            <span><i class="fas fa-map-marker-alt"></i> Location not specified</span>
                            <span><i class="fas fa-calendar"></i> N/A</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Equipments management (reads from local data)
async function loadEquipments() {
    try {
        loadLocalData();
        
        equipmentsGrid.innerHTML = equipmentImages.map(image => {
            const img = `../uploads/equipment/${image.filename}`;
            return `
                <div class="equipment-card-admin" data-filename="${image.filename}">
                    <img src="${img}" alt="${image.name}" class="equipment-image-admin">
                    <div class="equipment-content-admin">
                        <div class="equipment-title-admin">${image.name}</div>
                        <div class="equipment-specs-admin">
                            <span class="equipment-spec-tag">Equipment</span>
                        </div>
                        <div class="equipment-features-admin">
                            <span class="equipment-feature-tag">Construction</span>
                        </div>
                        <div class="equipment-actions">
                            <button class="edit-equipment-btn" onclick="editEquipment('${image.filename}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="remove-equipment-btn" onclick="openDeleteModal('equipment', '${image.filename}')">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load equipment:', error);
    }
}



// File upload functionality
fileUploadArea.addEventListener('click', () => {
    document.getElementById('projectImages').click();
});

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#FF6B35';
    fileUploadArea.style.background = '#F9FAFB';
});

fileUploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#D1D5DB';
    fileUploadArea.style.background = '#FFFFFF';
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#D1D5DB';
    fileUploadArea.style.background = '#FFFFFF';
    
    const files = e.dataTransfer.files;
    handleFileUpload(files, uploadedFiles);
});

document.getElementById('projectImages').addEventListener('change', (e) => {
    handleFileUpload(e.target.files, uploadedFiles);
});



function handleFileUpload(files, container) {
    container.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                    <button class="remove-file" onclick="removeFile(${index}, this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                container.appendChild(fileItem);
            };
            reader.readAsDataURL(file);
        }
    });
}

function removeFile(index, button) {
    button.closest('.file-item').remove();
}

// Upload form submission - saves to local data
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const category = document.getElementById('projectCategory').value;
    const location = document.getElementById('projectLocation').value;
    const year = document.getElementById('projectYear').value;
    const imageInput = document.getElementById('projectImages');
    
    if (imageInput.files.length === 0) {
        showNotification('Please select at least one image', 'error');
        return;
    }
    
    try {
        // Process images - save to local data
        for (let i = 0; i < imageInput.files.length; i++) {
            const file = imageInput.files[i];
            const filename = `${Date.now()}_${i}_${file.name}`;
            
            // Add to gallery images
            galleryImages.push({
                filename,
                title: title || filename.replace(/\.[^/.]+$/, ''),
                type: 'project',
                createdAt: new Date().toISOString()
            });
        }
        
        // Save to localStorage
        saveLocalData();
        
        // Reset form
        uploadForm.reset();
        uploadedFiles.innerHTML = '';
        
        showNotification('Project uploaded successfully!', 'success');
        
        // Refresh data
        loadLocalData();
        if (document.getElementById('dashboard').classList.contains('active')) {
            updateDashboardStats();
        }
        if (document.getElementById('projects').classList.contains('active')) {
            loadProjects();
        }
    } catch (error) {
        console.error('Upload failed:', error);
        showNotification('Failed to upload project: ' + error.message, 'error');
    }
});

// Equipment form submission - uploads image to server and saves data locally
addEquipmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('equipmentName').value;
    const specs = document.getElementById('equipmentSpecs').value.split(',').map(s => s.trim()).filter(Boolean);
    const features = document.getElementById('equipmentFeatures').value.split(',').map(f => f.trim()).filter(Boolean);
    const imageFile = document.getElementById('equipmentImage').files[0];
    
    if (!imageFile) {
        showNotification('Please select an image', 'error');
        return;
    }
    
    const submitButton = addEquipmentForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Uploading...</span>';
    
    try {
        // Create form data for server upload
        const formData = new FormData();
        formData.append('equipmentImage', imageFile);
        formData.append('equipmentName', name);
        formData.append('equipmentSpecs', specs.join(', '));
        formData.append('equipmentFeatures', features.join(', '));
        
        console.log('Uploading equipment to server...');
        
        // Try uploading to server first
        const serverUrls = [
            'http://127.0.0.1:8787/equipment',
            'http://localhost:8787/equipment'
        ];
        
        let response;
        let lastError;
        
        for (const url of serverUrls) {
            try {
                console.log(`Trying equipment upload to: ${url}`);
                response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                    credentials: 'omit'
                });
                
                if (response.ok) {
                    console.log(`Successfully uploaded to: ${url}`);
                    break;
                }
            } catch (error) {
                console.log(`Failed to upload to ${url}:`, error.message);
                lastError = error;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw lastError || new Error(`Server returned status: ${response?.status || 'unknown'}`);
        }
        
        const result = await response.json();
        console.log('Equipment upload result:', result);
        
        if (result.success) {
            console.log('Equipment upload successful:', result);
            
            // Add to equipment images with server filename
            equipmentImages.push({
                filename: result.filename,
                name: name || result.filename.replace(/\.[^/.]+$/, ''),
                specs,
                features,
                type: 'equipment',
                createdAt: new Date().toISOString()
            });
            
            // Save to localStorage
            saveLocalData();
            
            // Reset form
            addEquipmentForm.reset();
            
            showNotification(`Equipment "${name}" added successfully! Image saved as: ${result.filename}`, 'success');
            
            // Refresh data
            loadLocalData();
            if (document.getElementById('dashboard').classList.contains('active')) {
                updateDashboardStats();
            }
            if (document.getElementById('equipments').classList.contains('active')) {
                loadEquipments();
            }
        } else {
            throw new Error(result.error || 'Equipment upload failed');
        }
        
    } catch (error) {
        console.error('Equipment upload failed:', error);
        
        // Fallback: Show error message
        const errorMsg = error.message.includes('Server') || error.message.includes('fetch') 
            ? 'Unable to connect to server. Please make sure the upload server is running on port 8787.'
            : error.message;
        
        showNotification('Failed to add equipment: ' + errorMsg, 'error');
        
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
});



// Equipment editing
function editEquipment(filename) {
    const equipment = equipmentImages.find(eq => eq.filename === filename);
    if (!equipment) return;
    
    // Populate form with equipment data
    document.getElementById('equipmentName').value = equipment.name;
    document.getElementById('equipmentSpecs').value = equipment.specs?.join(', ') || '';
    document.getElementById('equipmentFeatures').value = equipment.features?.join(', ') || '';
    
    // Switch to equipment section
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById('equipments').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('[data-section="equipments"]').classList.add('active');
    
    showNotification('Edit mode activated. Make changes and submit to update the equipment.', 'warning');
}

// Delete functionality - Fixed to actually remove from local data
let deleteType = null;
let deleteId = null;

function openDeleteModal(type, id) {
    deleteType = type;
    deleteId = id;
    deleteModal.classList.add('active');
}

document.getElementById('confirmDelete').addEventListener('click', async () => {
    if (deleteType && deleteId) {
        try {
            // Remove from local data
            switch(deleteType) {
                case 'gallery':
                    galleryImages = galleryImages.filter(g => g.filename !== deleteId);
                    break;
                case 'equipment':
                    equipmentImages = equipmentImages.filter(e => e.filename !== deleteId);
                    break;
                case 'job':
                    jobs = jobs.filter(job => job.id !== deleteId);
                    break;
            }
            
            // Save to localStorage
            saveLocalData();
            
            showNotification('Item deleted successfully!', 'success');
            
                    // Refresh the appropriate section
        switch(deleteType) {
            case 'gallery':
                loadProjects();
                break;
            case 'equipment':
                loadEquipments();
                break;
            case 'job':
                loadJobs();
                break;
        }
            
            // Update dashboard if on dashboard section
            if (document.getElementById('dashboard').classList.contains('active')) {
                updateDashboardStats();
            }
        } catch (error) {
            console.error('Delete failed:', error);
            showNotification(`Failed to delete ${deleteType}: ` + error.message, 'error');
        }
        
        deleteModal.classList.remove('active');
        deleteType = null;
        deleteId = null;
    }
});

document.getElementById('cancelDelete').addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteType = null;
    deleteId = null;
});

document.getElementById('closeDeleteModal').addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteType = null;
    deleteId = null;
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'success') {
    notification.className = `notification ${type} show`;
    notification.querySelector('.notification-icon').className = `notification-icon fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}`;
    notification.querySelector('.notification-message').textContent = message;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load any existing data first
    loadLocalData();
    showLogin();
});

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    await login(username, password);
});

logoutBtn.addEventListener('click', () => {
    logout();
});

// Load section-specific data
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'projects':
            loadProjects();
            break;
        case 'equipments':
            loadEquipments();
            break;
        case 'jobs':
            loadJobs();
            break;
        case 'applicantsSection':
            loadApplicants();
            break;
    }
}

// Dashboard functionality
async function updateDashboardStats() {
    try {
        loadLocalData();
        
        const totalProjects = galleryImages.length;
        const totalEquipments = equipmentImages.length;
        const totalJobs = jobs.length;
        
        document.getElementById('totalProjects').textContent = totalProjects;
        document.getElementById('totalEquipments').textContent = totalEquipments;
        document.getElementById('totalGalleryImages').textContent = totalProjects; // Same as projects since they're in gallery
        
        // Load recent uploads
        loadRecentUploads();
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

document.getElementById('go-back-btn').addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Jobs management functions
async function loadJobs() {
    try {
        loadLocalData();
        
        const jobsGrid = document.getElementById('jobsGrid');
        if (!jobsGrid) return;
        
        jobsGrid.innerHTML = jobs.map(job => {
            return `
                <div class="job-card" data-job-id="${job.id}">
                    <div class="job-content">
                        <h3 class="job-title">${job.title}</h3>
                        <div class="job-meta">
                            <div class="job-meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${job.location}</span>
                            </div>
                            <div class="job-meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${job.type}</span>
                            </div>
                            <div class="job-meta-item">
                                <i class="fas fa-user-clock"></i>
                                <span>${job.experience}</span>
                            </div>
                        </div>
                        
                        <div class="job-actions">
                            <button class="job-edit-btn" onclick="editJob('${job.id}')">
                                <i class="fas fa-edit"></i>
                                <span>Edit</span>
                            </button>
                            <button class="job-delete-btn" onclick="openDeleteModal('job', '${job.id}')">
                                <i class="fas fa-trash"></i>
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        if (jobs.length === 0) {
            jobsGrid.innerHTML = '<p>No jobs posted yet. Add a job to get started.</p>';
        }
    } catch (error) {
        console.error('Failed to load jobs:', error);
    }
}

// Add job form handler
function handleAddJobForm() {
    const addJobForm = document.getElementById('addJobForm');
    if (!addJobForm) return;
    
    addJobForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const editJobId = this.dataset.editJobId;
        
        if (editJobId) {
            // Update existing job
            const jobIndex = jobs.findIndex(j => j.id === editJobId);
            if (jobIndex !== -1) {
                jobs[jobIndex] = {
                    ...jobs[jobIndex], // Keep existing properties like id and postedDate
                    title: formData.get('jobTitle'),
                    location: formData.get('jobLocation'),
                    type: formData.get('jobType'),
                    experience: formData.get('jobExperience'),
                    department: formData.get('jobDepartment') || 'Not specified',
                    salary: formData.get('jobSalary') || 'Not specified'
                };
                showNotification('Job updated successfully!', 'success');
            }
            
            // Reset form to add mode
            delete this.dataset.editJobId;
            this.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i><span>Post Job</span>';
        } else {
            // Create new job
            const jobData = {
                id: 'job-' + Date.now(),
                title: formData.get('jobTitle'),
                location: formData.get('jobLocation'),
                type: formData.get('jobType'),
                experience: formData.get('jobExperience'),
                department: formData.get('jobDepartment') || 'Not specified',
                salary: formData.get('jobSalary') || 'Not specified',
                postedDate: new Date().toISOString().split('T')[0],
                status: 'active'
            };
            
            // Add job to array
            jobs.push(jobData);
            showNotification('Job posted successfully!', 'success');
        }
        
        // Save to localStorage
        saveLocalData();
        
        // Reload jobs display
        loadJobs();
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Reset form
        this.reset();
    });
}

// Edit job
function editJob(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Populate form with job data
    const form = document.getElementById('addJobForm');
    if (form) {
        form.querySelector('#jobTitle').value = job.title;
        form.querySelector('#jobLocation').value = job.location;
        form.querySelector('#jobType').value = job.type;
        form.querySelector('#jobExperience').value = job.experience;
        form.querySelector('#jobDepartment').value = job.department || '';
        form.querySelector('#jobSalary').value = job.salary || '';
        
        // Change form action to update
        form.dataset.editJobId = jobId;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i><span>Update Job</span>';
        
        // Switch to jobs section and scroll to form
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById('jobs').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('[data-section="jobs"]').classList.add('active');
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize job form handler
document.addEventListener('DOMContentLoaded', () => {
    handleAddJobForm();
}); 

// Real Server Integration - Simple Resume Upload (should already be in your script.js)
async function submitJobApplication(jobId) {
    const form = document.getElementById('jobApplicationForm');
    const formData = new FormData(form);
    
    const name = formData.get('applicantName');
    const email = formData.get('applicantEmail');
    const phone = formData.get('applicantPhone');
    const resumeFile = formData.get('resume');
    
    if (!name || !email || !resumeFile) {
        alert('Please fill in all required fields and upload your resume.');
        return;
    }
    
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    try {
        formData.append('jobId', jobId);
        const response = await fetch('http://localhost:8787/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Application submitted successfully! Your resume has been received.');
            form.reset();
            closeApplicationForm();
        } else {
            throw new Error(result.error || 'Application failed');
        }
    } catch (error) {
        console.error('Application error:', error);
        alert('Error: ' + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Application Form Functions
function showApplicationForm(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const modalContent = `
        <div class="modal-overlay" id="applicationModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Apply for ${job.title}</h3>
                    <button class="modal-close" onclick="closeApplicationForm()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="jobApplicationForm">
                        <div class="form-group">
                            <label for="applicantName">Full Name *</label>
                            <input type="text" id="applicantName" name="applicantName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="applicantEmail">Email *</label>
                            <input type="email" id="applicantEmail" name="applicantEmail" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="applicantPhone">Phone Number</label>
                            <input type="tel" id="applicantPhone" name="applicantPhone">
                        </div>
                        
                        <div class="form-group">
                            <label for="resume">Resume (PDF/DOC/DOCX) *</label>
                            <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeApplicationForm()">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="submitApplication('${job.id}')">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function closeApplicationForm() {
    const modal = document.getElementById('applicationModal');
    if (modal) modal.remove();
}

async function submitApplication(jobId) {
    const form = document.getElementById('jobApplicationForm');
    const formData = new FormData(form);
    
    // Validate required fields
    if (!formData.get('applicantName') || !formData.get('applicantEmail') || !formData.get('resume')) {
        alert('Please fill all required fields');
        return;
    }

    try {
        // Show loading state
        const submitBtn = document.querySelector('#jobApplicationForm .btn-primary');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Add job ID to form data
        formData.append('jobId', jobId);
        
        // Send to server
        const response = await fetch('http://localhost:8787/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Application submitted successfully!');
            closeApplicationForm();
        } else {
            throw new Error(result.message || 'Application failed');
        }
    } catch (error) {
        console.error('Application error:', error);
        alert('Error submitting application: ' + error.message);
    } finally {
        const submitBtn = document.querySelector('#jobApplicationForm .btn-primary');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Application';
        }
    }
}

// Manual cleanup function
async function manualCleanup() {
    const cleanupBtn = document.getElementById('cleanupBtn');
    if (!cleanupBtn) return;
    
    // Confirm action
    const confirmed = confirm('This will permanently delete all application records and resume files older than 6 months. This action cannot be undone. Continue?');
    if (!confirmed) return;
    
    // Disable button and show loading
    const originalContent = cleanupBtn.innerHTML;
    cleanupBtn.disabled = true;
    cleanupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Cleaning up...</span>';
    
    try {
        console.log('Starting manual cleanup...');
        
        // Try both server URLs
        const serverUrls = [
            'http://127.0.0.1:8787/cleanup',
            'http://localhost:8787/cleanup'
        ];
        
        let response;
        let lastError;
        
        for (const url of serverUrls) {
            try {
                console.log(`Trying cleanup at: ${url}`);
                response = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'omit',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    console.log(`Successfully connected to: ${url}`);
                    break;
                }
            } catch (error) {
                console.log(`Failed to connect to ${url}:`, error.message);
                lastError = error;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw lastError || new Error(`Server returned status: ${response?.status || 'unknown'}`);
        }
        
        const result = await response.json();
        console.log('Cleanup result:', result);
        
        if (result.success) {
            showNotification('Cleanup completed successfully! Old applications have been removed.', 'success');
            // Refresh the applicants list
            loadApplicants();
        } else {
            throw new Error(result.message || 'Cleanup failed');
        }
        
    } catch (error) {
        console.error('Cleanup error:', error);
        showNotification(`Cleanup failed: ${error.message}. Make sure the upload server is running.`, 'error');
    } finally {
        // Restore button
        cleanupBtn.disabled = false;
        cleanupBtn.innerHTML = originalContent;
    }
}
// Real Server Integration - Load Applicants from MongoDB
async function loadApplicants() {
    const applicantsGrid = document.getElementById('applicantsGrid');
    if (!applicantsGrid) {
        console.error('Applicants grid element not found');
        return;
    }
    
    // Show loading state
    applicantsGrid.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Loading applicants...</div>';
    
    try {
        console.log('Loading applicants from server...');
        
        // Try both server URLs
        const serverUrls = [
            'http://127.0.0.1:8787/applicants',
            'http://localhost:8787/applicants'
        ];
        
        let response;
        let lastError;
        
        for (const url of serverUrls) {
            try {
                console.log(`Trying to fetch applicants from: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    console.log(`Successfully connected to: ${url}`);
                    break;
                }
            } catch (error) {
                console.log(`Failed to connect to ${url}:`, error.message);
                lastError = error;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw lastError || new Error(`Server returned status: ${response?.status || 'unknown'}`);
        }
        
        const applicants = await response.json();
        console.log('Loaded applicants:', applicants.length);
        
        if (applicants.length === 0) {
            applicantsGrid.innerHTML = `
                <div class="no-applicants-message">
                    <i class="fas fa-users fa-3x mb-3" style="color: #ccc;"></i>
                    <h3>No Applications Yet</h3>
                    <p>No job applications have been submitted yet. Applications will appear here once candidates apply through the website.</p>
                </div>
            `;
            return;
        }
        
        // Load local job data for matching
        loadLocalData();
        
        const applicantsHTML = applicants.map(applicant => {
            const job = jobs.find(j => j.id === applicant.jobId);
            const jobTitle = job ? job.title : `Job ID: ${applicant.jobId}`;
            const appliedDate = new Date(applicant.appliedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="admin-applicant-card">
                    <div class="admin-applicant-header">
                        <h4>${applicant.fullName}</h4>
                        <span class="applied-date" title="Applied on ${appliedDate}">${appliedDate}</span>
                    </div>
                    <div class="admin-applicant-info">
                        <p><strong>Position:</strong> ${jobTitle}</p>
                        <p><strong>Email:</strong> <a href="mailto:${applicant.email}">${applicant.email}</a></p>
                        ${applicant.phone ? `<p><strong>Phone:</strong> <a href="tel:${applicant.phone}">${applicant.phone}</a></p>` : ''}
                        ${applicant.experience ? `<p><strong>Experience:</strong> ${applicant.experience}</p>` : ''}
                        <p><strong>Resume:</strong> ${applicant.resumeOriginalName}</p>
                    </div>
                    <div class="admin-applicant-actions">
                        <a href="http://127.0.0.1:8787/download?filename=${encodeURIComponent(applicant.resumeStoredName)}" 
                           download="${applicant.resumeOriginalName}" 
                           class="btn btn-info btn-sm"
                           title="Download ${applicant.resumeOriginalName}">
                            <i class="fas fa-download"></i> Download Resume
                        </a>
                    </div>
                </div>
            `;
        }).join('');
        
        applicantsGrid.innerHTML = applicantsHTML;
        console.log(`Successfully rendered ${applicants.length} applicants`);
        
    } catch (error) {
        console.error('Error loading applicants:', error);
        applicantsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle fa-3x mb-3" style="color: #e74c3c;"></i>
                <h3>Unable to Load Applicants</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Please make sure the upload server is running on port 8787.</p>
                <button class="btn btn-primary" onclick="loadApplicants()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
}


