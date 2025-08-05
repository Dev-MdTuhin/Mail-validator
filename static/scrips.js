// Modern JavaScript for Mail_Validator Interface

document.addEventListener('DOMContentLoaded', function() {
    initializeUploadArea();
    initializeFormValidation();
    initializeAnimations();
});

function initializeUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('email_file');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', function(e) {
        if (e.target !== fileInput) {
            fileInput.click();
        }
    });

    // File selection handling
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    });

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.txt')) {
                fileInput.files = files;
                handleFileSelection(file);
            } else {
                showAlert('Please select a .txt file', 'error');
            }
        }
    });

    function handleFileSelection(file) {
        if (file.name.endsWith('.txt')) {
            fileName.textContent = `${file.name} (${formatFileSize(file.size)})`;
            fileInfo.classList.remove('d-none');
            fileInput.classList.remove('is-invalid');
            fileInput.classList.add('is-valid');
            
            // Update upload area appearance
            uploadArea.classList.add('border-success');
            uploadArea.classList.remove('border-danger');
            
            // Animate file info
            fileInfo.style.animation = 'slideIn 0.3s ease';
        } else {
            showAlert('Please select a valid .txt file', 'error');
            fileInput.classList.add('is-invalid');
            uploadArea.classList.add('border-danger');
        }
    }
}

function initializeFormValidation() {
    const form = document.querySelector('.needs-validation');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                // Store original content safely
                const originalContent = submitBtn.textContent;
                const originalDisabled = submitBtn.disabled;
                
                // Clear button and add loading content safely
                submitBtn.textContent = '';
                submitBtn.disabled = true;
                
                // Create spinner icon
                const spinner = document.createElement('i');
                spinner.className = 'fas fa-spinner fa-spin me-2';
                
                // Create text node
                const text = document.createTextNode('Processing...');
                
                // Append elements safely
                submitBtn.appendChild(spinner);
                submitBtn.appendChild(text);
                
                // Re-enable after a delay if form doesn't submit
                setTimeout(() => {
                    // Clear button content safely
                    submitBtn.textContent = originalContent;
                    submitBtn.disabled = originalDisabled;
                }, 5000);
            }
        }
        
        form.classList.add('was-validated');
    });

    // Real-time password validation
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    }
}

function initializeAnimations() {
    // Animate cards on load
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Animate feature list items
    const featureItems = document.querySelectorAll('.features-box li');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 1000 + (index * 100));
    });
}

// Utility Functions
function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.container-fluid');
    if (!alertContainer) return;

    const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';
    const iconClass = type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle';

    const alertHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas ${iconClass} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Insert alert at the top
    alertContainer.insertAdjacentHTML('afterbegin', alertHTML);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// Enhanced progress tracking for process page
if (window.location.pathname.includes('process')) {
    // Add visual enhancements to progress updates
    function enhanceProgressDisplay() {
        const progressBar = document.getElementById('progress-bar');
        const statCards = document.querySelectorAll('.stat-card');
        
        // Add pulse animation to active elements
        if (progressBar) {
            progressBar.addEventListener('transitionend', function() {
                this.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            });
        }
        
        // Animate stat cards when values change
        statCards.forEach(card => {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        card.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                        }, 200);
                    }
                });
            });
            
            observer.observe(card.querySelector('.h4'), {
                childList: true,
                characterData: true,
                subtree: true
            });
        });
    }
    
    enhanceProgressDisplay();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + U for upload (when on index page)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u' && window.location.pathname === '/') {
        e.preventDefault();
        const fileInput = document.getElementById('email_file');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    // Escape key to clear form
    if (e.key === 'Escape') {
        const form = document.querySelector('form');
        if (form && confirm('Clear the form?')) {
            form.reset();
            form.classList.remove('was-validated');
            
            // Reset file info
            const fileInfo = document.getElementById('file-info');
            if (fileInfo) {
                fileInfo.classList.add('d-none');
            }
        }
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Log performance if it's slow
        if (loadTime > 3000) {
            console.warn('Page load time is slower than expected');
        }
    });
}
