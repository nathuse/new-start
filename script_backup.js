// Initialize all modal functionality
function initializeModals() {
    // Vision & Mission Modal
    const openVisionMissionModal = document.getElementById('openVisionMissionModal');
    const visionMissionModal = document.getElementById('visionMissionModal');
    const closeVisionMissionModal = document.getElementById('closeVisionMissionModal');
    
    if (openVisionMissionModal && visionMissionModal) {
        openVisionMissionModal.onclick = function() {
            visionMissionModal.classList.add('active');
        };
    }
    
    if (closeVisionMissionModal && visionMissionModal) {
        closeVisionMissionModal.onclick = function() {
            visionMissionModal.classList.remove('active');
        };
    }
    
    // Vision Modal - Goes back to parent modal
    const openVisionModal = document.getElementById('openVisionModal');
    const visionModal = document.getElementById('visionModal');
    const closeVisionModal = document.getElementById('closeVisionModal');
    
    if (openVisionModal && visionModal && visionMissionModal) {
        openVisionModal.onclick = function() {
            visionMissionModal.classList.remove('active');
            visionModal.classList.add('active');
        };
    }
    
    if (closeVisionModal && visionModal && visionMissionModal) {
        closeVisionModal.onclick = function() {
            visionModal.classList.remove('active');
            visionMissionModal.classList.add('active'); // Go back to parent
        };
    }
    
    // Mission Modal - Goes back to parent modal
    const openMissionModal = document.getElementById('openMissionModal');
    const missionModal = document.getElementById('missionModal');
    const closeMissionModal = document.getElementById('closeMissionModal');
    
    if (openMissionModal && missionModal && visionMissionModal) {
        openMissionModal.onclick = function() {
            visionMissionModal.classList.remove('active');
            missionModal.classList.add('active');
        };
    }
    
    if (closeMissionModal && missionModal && visionMissionModal) {
        closeMissionModal.onclick = function() {
            missionModal.classList.remove('active');
            visionMissionModal.classList.add('active'); // Go back to parent
        };
    }
    
    // Values Modal - Goes back to parent modal
    const openValueModal = document.getElementById('openValueModal');
    const valueModal = document.getElementById('valueModal');
    const closeValueModal = document.getElementById('closeValueModal');
    
    if (openValueModal && valueModal && visionMissionModal) {
        openValueModal.onclick = function() {
            visionMissionModal.classList.remove('active');
            valueModal.classList.add('active');
        };
    }
    
    if (closeValueModal && valueModal && visionMissionModal) {
        closeValueModal.onclick = function() {
            valueModal.classList.remove('active');
            visionMissionModal.classList.add('active'); // Go back to parent
        };
    }
    
    // Organizational Structure Modal
    const openOrgStructureModal = document.getElementById('openOrgStructureModal');
    const orgStructureModal = document.getElementById('orgStructureModal');
    const closeOrgStructureModal = document.getElementById('closeOrgStructureModal');
    
    if (openOrgStructureModal && orgStructureModal) {
        openOrgStructureModal.onclick = function() {
            orgStructureModal.classList.add('active');
        };
    }
    
    if (closeOrgStructureModal && orgStructureModal) {
        closeOrgStructureModal.onclick = function() {
            orgStructureModal.classList.remove('active');
        };
    }
    
    // Close modals when clicking outside content
    if (visionMissionModal) {
        visionMissionModal.onclick = function(e) {
            if (e.target === this) this.classList.remove('active');
        };
    }
    
    if (visionModal && visionMissionModal) {
        visionModal.onclick = function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                visionMissionModal.classList.add('active'); // Go back to parent
            }
        };
    }
    
    if (missionModal && visionMissionModal) {
        missionModal.onclick = function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                visionMissionModal.classList.add('active'); // Go back to parent
            }
        };
    }
    
    if (valueModal && visionMissionModal) {
        valueModal.onclick = function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                visionMissionModal.classList.add('active'); // Go back to parent
            }
        };
    }
    
    // Fullscreen functionality
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenClose = document.getElementById('fullscreenClose');
    
    if (fullscreenBtn && fullscreenOverlay) {
        fullscreenBtn.onclick = function() {
            fullscreenOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }
    
    if (fullscreenClose && fullscreenOverlay) {
        fullscreenClose.onclick = function() {
            fullscreenOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };
    }
    
    if (fullscreenOverlay) {
        fullscreenOverlay.onclick = function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        };
    }
    
    // Close fullscreen with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fullscreenOverlay && fullscreenOverlay.classList.contains('active')) {
            fullscreenOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    console.log('Modal functionality initialized successfully');
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal functionality first
    initializeModals();
    
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Skip if href is just "#" (invalid selector)
            if (targetId === '#' || !targetId) {
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Project filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // If Gallery button, do not apply filter logic; let modal handler take over
            if (this.id === 'gallery-btn') {
                return;
            }
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Add loading state to projects grid
            const projectsGrid = document.querySelector('.projects-grid');
            projectsGrid.style.opacity = '0.7';
            projectsGrid.style.pointerEvents = 'none';

            // Delay for better UX
            setTimeout(() => {
                // Re-query project cards to include dynamically loaded items
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                        card.style.display = 'block';
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 400);
                    }
                });

                // Remove loading state
                setTimeout(() => {
                    projectsGrid.style.opacity = '1';
                    projectsGrid.style.pointerEvents = 'auto';
                }, 500);
            }, 200);
        });
    });

    // Equipment card hover effects
    const equipmentCards = document.querySelectorAll('.equipment-card');
    equipmentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth scroll for equipment CTA buttons
    const equipmentCTABtns = document.querySelectorAll('.equipment-cta .btn');
    equipmentCTABtns.forEach(btn => {
        if (btn.getAttribute('href') === '#contact') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const contactSection = document.querySelector('#contact');
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });

    // Equipment stats counter animation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(statNumber => {
                    const finalValue = statNumber.textContent;
                    const isPercentage = finalValue.includes('%');
                    const isTime = finalValue.includes('/');
                    
                    if (!isTime && !isPercentage) {
                        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                        animateNumber(statNumber, 0, numericValue, finalValue);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const equipmentStats = document.querySelector('.equipment-stats');
    if (equipmentStats) {
        statsObserver.observe(equipmentStats);
    }

    function animateNumber(element, start, end, finalText) {
        const duration = 2000;
        const increment = (end - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = finalText;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (finalValue.includes('+') ? '+' : '');
            }
        }, 16);
    }

    // Update navigation for equipment link
    const equipmentNavLink = document.querySelector('a[href="#equipments"]');
    if (equipmentNavLink) {
        equipmentNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            const equipmentSection = document.querySelector('#equipments');
            if (equipmentSection) {
                equipmentSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Modal functionality for bidding process
    document.addEventListener('DOMContentLoaded', function() {
        const helpButton = document.getElementById('helpButton');
        const modal = document.getElementById('biddingProcessModal');
        const closeModal = document.getElementById('closeModal');
        
        // Open modal when help button is clicked
        if (helpButton) {
            helpButton.addEventListener('click', function() {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        }
        
        // Close modal when close button is clicked
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Restore scrolling
            });
        }
        
        // Close modal when clicking outside the modal content
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Animate process steps when modal opens
        const processSteps = document.querySelectorAll('.modal-body .process-step');
        
        function animateSteps() {
            processSteps.forEach((step, index) => {
                setTimeout(() => {
                    step.style.opacity = '0';
                    step.style.transform = 'translateX(-20px)';
                    step.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        step.style.opacity = '1';
                        step.style.transform = 'translateX(0)';
                    }, 100);
                }, index * 100);
            });
        }
        
        // Trigger animation when modal opens
        if (helpButton) {
            helpButton.addEventListener('click', function() {
                setTimeout(animateSteps, 300);
            });
        }
    });

    // Update the existing form functionality
    document.addEventListener('DOMContentLoaded', function() {
        // Multi-step form functionality
        const formSteps = document.querySelectorAll('.form-step');
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        const progressStep = document.querySelector('.progress-step');
        
        // Update progress bar
        function updateProgress(step) {
            const progress = (step / 3) * 100;
            if (progressStep) {
                progressStep.style.width = `${progress}%`;
            }
        }
        
        // Validate form step
        function validateStep(step) {
            const requiredFields = step.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                const formGroup = field.closest('.form-group');
                
                if (!field.value.trim()) {
                    formGroup.classList.add('error');
                    isValid = false;
                } else {
                    formGroup.classList.remove('error');
                }
            });
            
            return isValid;
        }
        
        // Next button functionality
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = this.closest('.form-step');
                const currentStepNum = parseInt(currentStep.dataset.step);
                
                if (validateStep(currentStep)) {
                    currentStep.classList.remove('active');
                    
                    const nextStep = document.querySelector(`.form-step[data-step="${currentStepNum + 1}"]`);
                    if (nextStep) {
                        nextStep.classList.add('active');
                        updateProgress(currentStepNum + 1);
                        
                        // Scroll to top of form
                        nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
        
        // Previous button functionality
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = this.closest('.form-step');
                const currentStepNum = parseInt(currentStep.dataset.step);
                
                currentStep.classList.remove('active');
                
                const prevStep = document.querySelector(`.form-step[data-step="${currentStepNum - 1}"]`);
                if (prevStep) {
                    prevStep.classList.add('active');
                    updateProgress(currentStepNum - 1);
                    
                    // Scroll to top of form
                    nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Show/hide other project type field
        const projectTypeSelect = document.getElementById('projectType');
        const otherProjectTypeGroup = document.getElementById('otherProjectTypeGroup');
        
        if (projectTypeSelect) {
            projectTypeSelect.addEventListener('change', function() {
                if (this.value === 'other') {
                    otherProjectTypeGroup.style.display = 'block';
                    document.getElementById('otherProjectType').required = true;
                } else {
                    otherProjectTypeGroup.style.display = 'none';
                    document.getElementById('otherProjectType').required = false;
                }
            });
        }
        
        // File upload functionality
        const fileInput = document.getElementById('projectFiles');
        const fileList = document.getElementById('fileList');
        
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                displayFiles(this.files);
            });
        }
        
        function displayFiles(files) {
            if (!fileList) return;
            
            fileList.innerHTML = '';
            
            Array.from(files).forEach((file, index) => {
                const fileSize = (file.size / 1024 / 1024).toFixed(2);
                
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="fas ${getFileIcon(file.name)}"></i>
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${fileSize} MB</span>
                    </div>
                    <button type="button" class="file-remove" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                fileList.appendChild(fileItem);
            });
            
            // Add remove functionality
            const removeButtons = fileList.querySelectorAll('.file-remove');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.closest('.file-item').remove();
                });
            });
        }
        
        function getFileIcon(fileName) {
            const extension = fileName.split('.').pop().toLowerCase();
            
            if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
                return 'fa-file-image';
            } else if (['pdf'].includes(extension)) {
                return 'fa-file-pdf';
            } else if (['doc', 'docx'].includes(extension)) {
                return 'fa-file-word';
            } else if (['xls', 'xlsx'].includes(extension)) {
                return 'fa-file-excel';
            } else if (['zip', 'rar', '7z'].includes(extension)) {
                return 'fa-file-archive';
            } else if (['dwg', 'dxf'].includes(extension)) {
                return 'fa-drafting-compass';
            } else {
                return 'fa-file';
            }
        }

        // Bidding form functionality removed - replaced with job listings

        // Real-time validation
        const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                const formGroup = this.closest('.form-group');
                
                if (this.hasAttribute('required') && !this.value.trim()) {
                    formGroup.classList.add('error');
                } else {
                    formGroup.classList.remove('error');
                }
            });
            
            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup.classList.contains('error') && this.value.trim()) {
                    formGroup.classList.remove('error');
                }
            });
        });
        
        // Initialize progress bar
        updateProgress(1);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" (invalid selector)
            if (href === '#' || !href) {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    const animatedElements = document.querySelectorAll('.equipment-card, .stat-card, .service-item');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
});

// Modal functionality - Fixed navigation flow (now handled by initializeModals)

// Modal functionality - All modals now handled by initializeModals function

// File-based image loading system - No server needed
let galleryImages = [];
let equipmentImages = [];
let jobs = []; // Add jobs array

// Pagination variables
let currentJobPage = 1;
const jobsPerPage = 3;

// Load data from uploads folder by scanning directory
async function loadAllData() {
    try {
        // Try to load from localStorage first
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
        
        // If no saved data, initialize with actual folder contents
        if (galleryImages.length === 0 && equipmentImages.length === 0 && jobs.length === 0) {
            await initializeFromFolders();
        }
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Initialize with actual images from uploads folders
async function initializeFromFolders() {
    try {
        console.log('Initializing from folders...');
        
        // Load jobs from jobs.json file
        try {
            const jobsResponse = await fetch('jobs.json');
            if (jobsResponse.ok) {
                const jobsData = await jobsResponse.json();
                jobs = jobsData.jobs || [];
                localStorage.setItem('jobs', JSON.stringify(jobs));
                console.log('Loaded jobs from jobs.json:', jobs.length);
            }
        } catch (error) {
            console.error('Failed to load jobs.json:', error);
            // Initialize with sample jobs if file not found
            jobs = [];
        }
        
        // Create list of actual images found in the uploads folders
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
        
        // Save to localStorage
        localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
        localStorage.setItem('equipmentImages', JSON.stringify(equipmentImages));
        
        console.log('Initialized with actual images from uploads folders:', galleryImages.length, 'gallery images,', equipmentImages.length, 'equipment images,', jobs.length, 'jobs');
        console.log('Gallery images:', galleryImages);
        
    } catch (error) {
        console.error('Failed to initialize from folders:', error);
    }
}

// Render job listings from local data with pagination
async function renderJobListings() {
    const jobsList = document.getElementById('jobsList');
    if (!jobsList) return;
    
    try {
        await loadAllData();
        
        if (!Array.isArray(jobs) || jobs.length === 0) {
            jobsList.innerHTML = `
                <div class="no-jobs-message">
                    <h4>No job openings available at the moment</h4>
                    <p>Please check back later or contact us directly if you're interested in joining our team.</p>
                    <a href="#contact" class="btn btn-primary">
                        <i class="fas fa-envelope"></i>
                        <span>Contact Us</span>
                    </a>
                </div>
            `;
            return;
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(jobs.length / jobsPerPage);
        const startIndex = (currentJobPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        const currentJobs = jobs.slice(startIndex, endIndex);
        
        // Render current page jobs
        const jobsHtml = currentJobs.map(job => {
            return `
                <div class="job-card" data-job-id="${job.id}">
                    <div class="job-header">
                        <div>
                            <h3 class="job-title">${job.title}</h3>
                            <div class="job-department">${job.department}</div>
                        </div>
                        <div class="job-badge">${job.type}</div>
                    </div>
                    
                    <div class="job-meta">
                        <div class="job-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${job.location}</span>
                        </div>
                        <div class="job-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${job.experience}</span>
                        </div>
                        <div class="job-meta-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>${job.salary}</span>
                        </div>
                    </div>
                    
                    <div class="job-description">${job.description}</div>
                    
                    <div class="job-actions">
                        <a href="#contact" class="job-apply-btn">
                            <i class="fas fa-paper-plane"></i>
                            <span>Apply Now</span>
                        </a>
                        <button class="job-details-btn" onclick="showJobDetails('${job.id}')">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add pagination if needed
        let paginationHtml = '';
        if (totalPages > 1) {
            paginationHtml = `
                <div class="job-pagination">
                    ${currentJobPage > 1 ? `<button class="pagination-btn prev-btn" onclick="changeJobPage(${currentJobPage - 1})">
                        <i class="fas fa-chevron-left"></i>
                        <span>Previous</span>
                    </button>` : ''}
                    
                    <span class="pagination-info">Page ${currentJobPage} of ${totalPages}</span>
                    
                    ${currentJobPage < totalPages ? `<button class="pagination-btn next-btn" onclick="changeJobPage(${currentJobPage + 1})">
                        <span>Next</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>` : ''}
                </div>
            `;
        }
        
        jobsList.innerHTML = jobsHtml + paginationHtml;
    } catch (error) {
        console.error('Failed to load job listings:', error);
        jobsList.innerHTML = `
            <div class="no-jobs-message">
                <h4>Unable to load job listings</h4>
                <p>Please contact us directly.</p>
                <a href="#contact" class="btn btn-primary">
                    <i class="fas fa-envelope"></i>
                    <span>Contact Us</span>
                </a>
            </div>
        `;
    }
}

// Change job page
function changeJobPage(newPage) {
    currentJobPage = newPage;
    renderJobListings();
}

// Show job details modal
function showJobDetails(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Create modal content
    const modalContent = `
        <div class="modal-overlay" id="jobDetailsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${job.title}</h3>
                    <button class="modal-close" onclick="closeJobDetails()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="job-details">
                        <div class="job-meta">
                            <div class="job-meta-item">
                                <i class="fas fa-building"></i>
                                <span>${job.department}</span>
                            </div>
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
                            <div class="job-meta-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>${job.salary}</span>
                            </div>
                        </div>
                        
                        <div class="job-section">
                            <h4>Job Description</h4>
                            <p>${job.description}</p>
                        </div>
                        
                        <div class="job-section">
                            <h4>Requirements</h4>
                            <ul>
                                ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="job-section">
                            <h4>Responsibilities</h4>
                            <ul>
                                ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        </div>
                        
                        ${job.benefits && job.benefits.length > 0 ? `
                        <div class="job-section">
                            <h4>Benefits</h4>
                            <ul>
                                ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                        
                        <div class="job-actions">
                            <a href="#contact" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i>
                                <span>Apply for this Position</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Show modal
    const modal = document.getElementById('jobDetailsModal');
    modal.classList.add('active');
}

// Close job details modal
function closeJobDetails() {
    const modal = document.getElementById('jobDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Render public equipment cards from local data
async function renderPublicEquipments() {
    const grid = document.getElementById('equipmentGridPublic');
    if (!grid) return;
    
    try {
        await loadAllData();
        
        if (!Array.isArray(equipmentImages) || equipmentImages.length === 0) {
            // Keep existing static content if no equipment data
            return;
        }
        
        const html = equipmentImages.map(it => {
            const img = `uploads/equipment/${it.filename}`;
            return `
            <div class="equipment-card" data-category="transport">
                <div class="equipment-image">
                    <img src="${img}" alt="${it.name || 'Equipment'}" class="equipment-img">
                </div>
                <div class="equipment-content">
                    <div class="equipment-header">
                        <h3 class="equipment-title">${it.name || 'Equipment'}</h3>
                        <div class="equipment-icon"><i class="fas fa-cog"></i></div>
                    </div>
                    <div class="equipment-specs">
                        <div class="spec-item"><i class="fas fa-cube"></i><span>Construction Equipment</span></div>
                    </div>
                    <div class="equipment-features">
                        <span class="feature-tag">Professional Grade</span>
                    </div>
                </div>
            </div>`;
        }).join('');
        
        // Replace any static/demo cards with dynamic content
        grid.innerHTML = html;
    } catch (e) {
        console.error('Failed to load equipment:', e);
    }
}

// Render Projects from local data
async function renderProjects() {
    const container = document.getElementById('projects-section');
    if (!container) return;
    
    try {
        await loadAllData();
        
        if (!Array.isArray(galleryImages) || galleryImages.length === 0) {
            // Keep existing static content if no project data
            return;
        }
        
        const html = galleryImages.map(img => {
            const imgSrc = `uploads/gallery/${img.filename}`;
            return `
            <div class="project-card" data-category="all">
                <div class="project-image">
                    <img src="${imgSrc}" alt="${img.title}" class="project-img">
                    <div class="project-overlay">
                        <div class="project-content">
                            <div class="project-meta">
                                <span class="project-category">Project</span>
                                <div class="project-stats">
                                    <span><i class="fas fa-calendar"></i> 2024</span>
                                    <span><i class="fas fa-map-marker-alt"></i> Construction Site</span>
                                </div>
                            </div>
                            <h3 class="project-title">${img.title}</h3>
                            <p class="project-description">Construction project showcase</p>
                            <a href="#contact" class="project-cta">
                                <span>View Details</span>
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
        
        // Insert new cards at the end, preserving existing content
        container.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Gallery functionality - Fixed modal overlay issue
document.addEventListener('DOMContentLoaded', function() {
    const galleryBtn = document.getElementById('gallery-btn');
    if (!galleryBtn) return;

    async function openGallery() {
        try {
            // Use custom modal
            let galleryModal = document.getElementById('customGalleryModal');
            
            if (!galleryModal) {
                galleryModal = document.createElement('div');
                galleryModal.id = 'customGalleryModal';
                galleryModal.className = 'custom-gallery-modal';
                galleryModal.innerHTML = `
                    <div class="custom-modal-content">
                        <div class="custom-modal-header">
                            <h3><i class="fas fa-images"></i> Project Gallery</h3>
                            <button class="custom-modal-close">&times;</button>
                        </div>
                        <div class="custom-modal-body">
                            <div class="gallery-container" id="gallery-container">
                                <!-- Gallery images will be loaded here -->
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(galleryModal);
                
                // Add event listener for the close button
                galleryModal.querySelector('.custom-modal-close').addEventListener('click', closeCustomGallery);
            }
            
            const galleryContainer = document.getElementById('gallery-container');
            
            if (!Array.isArray(galleryImages) || galleryImages.length === 0) {
                galleryContainer.innerHTML = '<div class="no-images-message"><i class="fas fa-image fa-3x mb-3"></i><p>No images uploaded yet. Use the admin panel to upload images.</p></div>';
            } else {
                const html = galleryImages.map(img => {
                    const imgSrc = `uploads/gallery/${encodeURIComponent(img.filename)}`;
                    return `
                        <div class="gallery-item-wrapper">
                            <img src="${imgSrc}" alt="${img.filename}" class="gallery-thumb" 
                                 data-src="${imgSrc}" data-title="${img.title || img.filename}">
                        </div>`;
                }).join('');
                
                galleryContainer.innerHTML = html;

                // Add click event listeners to all gallery images
                const galleryItems = galleryContainer.querySelectorAll('.gallery-item-wrapper');
                galleryItems.forEach(item => {
                    item.addEventListener('click', function() {
                        const img = this.querySelector('img');
                        const src = img.getAttribute('data-src');
                        const title = img.getAttribute('data-title');
                        openLightbox(src, title);
                    });
                });
            }
            
            // Show the custom modal
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
        } catch (e) {
            console.error('Failed to open gallery:', e);
        }
    }

    galleryBtn.addEventListener('click', openGallery);
});

// Close custom gallery modal
function closeCustomGallery() {
    const modal = document.getElementById('customGalleryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close custom gallery when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('customGalleryModal');
    if (modal && e.target === modal) {
        closeCustomGallery();
    }
});

// Lightbox functionality for individual images - FIXED
function openLightbox(imageSrc, imageTitle) {
    // Create lightbox modal if it doesn't exist
    let lightboxModal = document.getElementById('customImageLightbox');
    
    if (!lightboxModal) {
        lightboxModal = document.createElement('div');
        lightboxModal.id = 'customImageLightbox';
        lightboxModal.className = 'lightbox-modal';
        document.body.appendChild(lightboxModal);
    }
    
    // Set the lightbox content
    lightboxModal.innerHTML = `
        <div class="lightbox-content">
            <div class="lightbox-header">
                <h3>${imageTitle}</h3>
                <button class="lightbox-close">&times;</button>
            </div>
            <div class="lightbox-body">
                <img src="${imageSrc}" alt="${imageTitle}" class="lightbox-image">
            </div>
        </div>
    `;
    
    // Add event listener for the close button
    lightboxModal.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    // Show the lightbox
    lightboxModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightboxModal = document.getElementById('customImageLightbox');
    if (lightboxModal) {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close lightbox when clicking outside
document.addEventListener('click', function(e) {
    const lightboxModal = document.getElementById('customImageLightbox');
    if (lightboxModal && e.target === lightboxModal) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
        closeCustomGallery();
    }
});

// Fetch and render on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load data first, then render
    loadAllData().then(() => {
        // Load equipment and projects from actual uploads folders
        renderPublicEquipments();
        renderProjects();
        renderJobListings(); // Add job listings rendering
    });
});

// Responsive Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sideMenuPanel = document.getElementById('sideMenuPanel');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    
    // Mobile side menu functionality
    if (hamburgerBtn && sideMenuPanel && sideMenuOverlay && closeMenuBtn) {
        // Open side menu
        hamburgerBtn.addEventListener('click', function() {
            sideMenuPanel.classList.add('active');
            sideMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close side menu
        function closeSideMenu() {
            sideMenuPanel.classList.remove('active');
            sideMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        closeMenuBtn.addEventListener('click', closeSideMenu);
        sideMenuOverlay.addEventListener('click', closeSideMenu);
        
        // Close menu when clicking on navigation links
        const sideMenuLinks = document.querySelectorAll('.side-menu-link');
        sideMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Don't close for modal triggers
                if (this.id === 'openVisionMissionModalMobile' || this.id === 'openOrgStructureModalMobile') {
                    return;
                }
                closeSideMenu();
            });
        });
        
        // Close menu with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sideMenuPanel.classList.contains('active')) {
                closeSideMenu();
            }
        });
        
        // Handle mobile modal triggers
        const openVisionMissionModalMobile = document.getElementById('openVisionMissionModalMobile');
        const openOrgStructureModalMobile = document.getElementById('openOrgStructureModalMobile');
        
        if (openVisionMissionModalMobile) {
            openVisionMissionModalMobile.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Opening Vision & Mission modal from mobile menu');
                // Open vision mission modal
                const visionMissionModal = document.getElementById('visionMissionModal');
                if (visionMissionModal) {
                    visionMissionModal.classList.add('active');
                    console.log('Vision & Mission modal opened successfully');
                    // Close side menu after opening modal
                    closeSideMenu();
                } else {
                    console.error('Vision & Mission modal element not found');
                    alert('Error: Vision & Mission modal not found. Please refresh the page.');
                }
            });
        }
        
        if (openOrgStructureModalMobile) {
            openOrgStructureModalMobile.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Opening Organizational Structure modal from mobile menu');
                // Open organizational structure modal
                const orgStructureModal = document.getElementById('orgStructureModal');
                if (orgStructureModal) {
                    orgStructureModal.classList.add('active');
                    console.log('Organizational Structure modal opened successfully');
                    // Close side menu after opening modal
                    closeSideMenu();
                } else {
                    console.error('Organizational Structure modal element not found');
                    alert('Error: Organizational Structure modal not found. Please refresh the page.');
                }
            });
        }
    }
});