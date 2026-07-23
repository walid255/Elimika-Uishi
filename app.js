// --- CONFIGURATION & STATE ---
let currentStep = 1;
let currentLanguage = 'SW'; // Default language Swahili

const quotes = {
    SW: [
        {
            text: '"Ubunifu katika ushonaji unampa mwanamke uwezo wa kujieleza na kujenga uchumi imara kupitia mikono yake mwenyewe."',
            author: '- Elimika Uishi Tanzania'
        },
        {
            text: '"Chakula na lishe bora si tu shughuli ya nyumbani, bali ni biashara yenye nguvu inayolisha na kuelimisha jamii zetu."',
            author: '- Elimika Uishi Tanzania'
        },
        {
            text: '"Kila mkate unaookwa na kila bidhaa inayouzwa ni hatua kubwa kuelekea uhuru kamili wa kifedha na kujitegemea."',
            author: '- Elimika Uishi Tanzania'
        }
    ],
    EN: [
        {
            text: '"Creativity in tailoring empowers a woman to express herself and build a strong economy through her own hands."',
            author: '- Elimika Uishi Tanzania'
        },
        {
            text: '"Good food and nutrition is not just a household chore, but a powerful enterprise that feeds and educates our communities."',
            author: '- Elimika Uishi Tanzania'
        },
        {
            text: '"Every loaf baked and every product sold is a giant step towards full financial independence and self-reliance."',
            author: '- Elimika Uishi Tanzania'
        }
    ]
};

// --- BACKGROUND SLIDESHOW ---
let activeSlide = 1;
const totalSlides = 3;
const slideIntervalTime = 5000; // 5 seconds

function startSlideshow() {
    setInterval(() => {
        // Hide current slide
        const currentSlideEl = document.getElementById(`slide${activeSlide}`);
        if (currentSlideEl) {
            currentSlideEl.classList.remove('opacity-100');
            currentSlideEl.classList.add('opacity-0');
        }

        // Increment slide index
        activeSlide = activeSlide === totalSlides ? 1 : activeSlide + 1;

        // Show next slide
        const nextSlideEl = document.getElementById(`slide${activeSlide}`);
        if (nextSlideEl) {
            nextSlideEl.classList.remove('opacity-0');
            nextSlideEl.classList.add('opacity-100');
        }

        // Update dot indicators
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index + 1 === activeSlide) {
                dot.classList.remove('bg-white/40', 'w-2');
                dot.classList.add('bg-brand-gold', 'w-8');
            } else {
                dot.classList.remove('bg-brand-gold', 'w-8');
                dot.classList.add('bg-white/40', 'w-2');
            }
        });

        // Update quotes on slide change
        updateQuote(activeSlide - 1);

    }, slideIntervalTime);
}

function updateQuote(index) {
    const quoteContainer = document.getElementById('quote-container');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    if (!quoteContainer || !quoteText || !quoteAuthor) return;

    // Fade out
    quoteContainer.classList.remove('opacity-100', 'translate-y-0');
    quoteContainer.classList.add('opacity-0', 'translate-y-2');

    setTimeout(() => {
        // Change text based on current language and active slide index
        const activeQuotes = quotes[currentLanguage];
        quoteText.textContent = activeQuotes[index].text;
        quoteAuthor.textContent = activeQuotes[index].author;

        // Fade in
        quoteContainer.classList.remove('opacity-0', 'translate-y-2');
        quoteContainer.classList.add('opacity-100', 'translate-y-0');
    }, 400);
}

// --- LANGUAGE SWITCHER ---
function toggleLanguage() {
    currentLanguage = currentLanguage === 'SW' ? 'EN' : 'SW';
    
    // Update language switcher button label
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
        langLabel.textContent = currentLanguage === 'SW' ? 'English' : 'Kiswahili';
    }

    // Toggle CSS classes to show/hide bilingual text
    const swTexts = document.querySelectorAll('.sw-text');
    const enTexts = document.querySelectorAll('.en-text');

    if (currentLanguage === 'SW') {
        swTexts.forEach(el => el.classList.remove('hidden'));
        enTexts.forEach(el => el.classList.add('hidden'));
    } else {
        swTexts.forEach(el => el.classList.add('hidden'));
        enTexts.forEach(el => el.classList.remove('hidden'));
    }

    // Refresh active quote with new language
    updateQuote(activeSlide - 1);
    
    // Refresh step header and progress indicators
    updateStepHeader();
}

// --- CONDITIONAL FORM FIELDS ---
function handleBusinessTypeChange() {
    const businessType = document.getElementById('businessType').value;
    const customBusinessContainer = document.getElementById('customBusinessContainer');
    const customBusinessInput = document.getElementById('customBusiness');

    if (businessType === 'Nyingine') {
        customBusinessContainer.classList.remove('hidden');
        customBusinessInput.setAttribute('required', 'required');
    } else {
        customBusinessContainer.classList.add('hidden');
        customBusinessInput.removeAttribute('required');
        customBusinessInput.value = '';
    }
}

function handleIdTypeChange() {
    const idType = document.getElementById('idType').value;
    const idNumberContainer = document.getElementById('idNumberContainer');
    const idNumberInput = document.getElementById('idNumber');
    const localGovLetterContainer = document.getElementById('localGovLetterContainer');
    const localGovLetterInput = document.getElementById('localGovLetterFile');

    if (idType === 'BARUA YA SERIKALI YA MTAA') {
        // Hide ID number
        idNumberContainer.classList.add('hidden');
        idNumberInput.removeAttribute('required');
        idNumberInput.value = '';

        // Show Local Gov Letter upload
        localGovLetterContainer.classList.remove('hidden');
        localGovLetterInput.setAttribute('required', 'required');
    } else {
        // Show ID number
        idNumberContainer.classList.remove('hidden');
        idNumberInput.setAttribute('required', 'required');

        // Hide Local Gov Letter upload
        localGovLetterContainer.classList.add('hidden');
        localGovLetterInput.removeAttribute('required');
        localGovLetterInput.value = '';
        document.getElementById('localGovLetterFileName').textContent = 'No file chosen';
    }
}

function handleFileChange(inputId, labelId) {
    const fileInput = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // Validate file size (Passport photo <= 3MB, Letter <= 5MB)
        const maxSize = inputId === 'passportPhotoFile' ? 3 * 1024 * 1024 : 5 * 1024 * 1024;
        
        if (file.size > maxSize) {
            alert(currentLanguage === 'SW' ? 
                `Faili hili ni kubwa sana. Upeo wa ukubwa ni ${inputId === 'passportPhotoFile' ? '3MB' : '5MB'}.` : 
                `This file is too large. Maximum size is ${inputId === 'passportPhotoFile' ? '3MB' : '5MB'}.`
            );
            fileInput.value = '';
            label.textContent = 'No file chosen';
            return;
        }

        label.textContent = file.name + ` (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        label.classList.remove('text-gray-400');
        label.classList.add('text-brand-green', 'font-semibold');
    } else {
        label.textContent = 'No file chosen';
        label.classList.remove('text-brand-green', 'font-semibold');
        label.classList.add('text-gray-400');
    }
}

// --- MULTI-STEP WIZARD LOGIC ---
function updateStepHeader() {
    const stepName = document.getElementById('step-name');
    const stepProgress = document.getElementById('step-progress');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtnText = document.getElementById('next-btn-text');
    const nextBtnIcon = document.getElementById('next-btn-icon');

    // Progress bar percent
    const progressPercent = currentStep * 25;
    progressBar.style.width = `${progressPercent}%`;

    if (currentLanguage === 'SW') {
        stepProgress.textContent = `${progressPercent}% Imekamilika`;
        
        if (currentStep === 1) {
            stepName.textContent = 'Hatua ya 1: Taarifa Binafsi';
            nextBtnText.innerHTML = '<span class="sw-text">Endelea</span>';
            nextBtnIcon.className = 'fa-solid fa-arrow-right ml-2';
            prevBtn.classList.add('invisible');
        } else if (currentStep === 2) {
            stepName.textContent = 'Hatua ya 2: Shughuli za Kiuchumi';
            nextBtnText.innerHTML = '<span class="sw-text">Endelea</span>';
            nextBtnIcon.className = 'fa-solid fa-arrow-right ml-2';
            prevBtn.classList.remove('invisible');
        } else if (currentStep === 3) {
            stepName.textContent = 'Hatua ya 3: Utambulisho na Picha';
            nextBtnText.innerHTML = '<span class="sw-text">Endelea</span>';
            nextBtnIcon.className = 'fa-solid fa-arrow-right ml-2';
            prevBtn.classList.remove('invisible');
        } else if (currentStep === 4) {
            stepName.textContent = 'Hatua ya 4: Mapitio na Kutuma';
            nextBtnText.innerHTML = '<span class="sw-text">Tuma Maombi</span>';
            nextBtnIcon.className = 'fa-solid fa-paper-plane ml-2';
            prevBtn.classList.remove('invisible');
        }
    } else {
        stepProgress.textContent = `${progressPercent}% Completed`;

        if (currentStep === 1) {
            stepName.textContent = 'Step 1: Personal Information';
            nextBtnText.innerHTML = '<span class="en-text">Continue</span>';
            nextBtnIcon.className = 'fa-solid fa-arrow-right ml-2';
            prevBtn.classList.add('invisible');
        } else if (currentStep === 2) {
            stepName.textContent = 'Step 2: Business & Economic Activity';
            nextBtnText.innerHTML = '<span class="en-text">Continue</span>';
            nextBtnIcon.className = 'fa-solid fa-arrow-right ml-2';
            prevBtn.classList.remove('invisible');
        } else if (currentStep === 3) {
            stepName.textContent = 'Step 3: ID & Documentation';
            nextBtnText.innerHTML = '<span class="en-text">Continue</span>';
            nextBtnIcon.className = 'fa-solid fa-arrow-right ml-2';
            prevBtn.classList.remove('invisible');
        } else if (currentStep === 4) {
            stepName.textContent = 'Step 4: Review & Submit';
            nextBtnText.innerHTML = '<span class="en-text">Submit Application</span>';
            nextBtnIcon.className = 'fa-solid fa-paper-plane ml-2';
            prevBtn.classList.remove('invisible');
        }
    }
}

function showStep(stepNum) {
    // Hide all step contents
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(el => el.classList.add('hidden'));

    // Show current step content
    const activeStepEl = document.getElementById(`step-${stepNum}-content`);
    if (activeStepEl) {
        activeStepEl.classList.remove('hidden');
    }

    currentStep = stepNum;
    updateStepHeader();
}

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < 4) {
            if (currentStep === 3) {
                // Populate review details in step 4 before transitioning
                populateReview();
            }
            showStep(currentStep + 1);
        } else {
            // Submit form on step 4
            submitForm();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// --- FORM VALIDATION ---
function validateStep(stepNum) {
    let isValid = true;
    const inputs = document.getElementById(`step-${stepNum}-content`).querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        // Clear any previous error styling
        input.classList.remove('border-red-500', 'ring-2', 'ring-red-200');

        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
        }

        // Specific validation logic
        if (input.type === 'number' && input.id === 'age') {
            const ageVal = parseInt(input.value);
            if (isNaN(ageVal) || ageVal < 15 || ageVal > 100) {
                isValid = false;
                input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
            }
        }

        if (input.type === 'checkbox' && !input.checked) {
            isValid = false;
            input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
        }
    });

    if (!isValid) {
        // Show user visual error cue
        const errorMsg = currentLanguage === 'SW' ? 
            'Tafadhali jaza sehemu zote zenye alama ya nyota (*) kwa usahihi.' : 
            'Please fill out all fields marked with an asterisk (*) correctly.';
        alert(errorMsg);
    }

    return isValid;
}

// --- POPULATE REVIEW DETAILS ---
function populateReview() {
    document.getElementById('rev-fullName').textContent = document.getElementById('fullName').value;
    document.getElementById('rev-age').textContent = document.getElementById('age').value;
    
    // Gender
    const genderSelect = document.getElementById('gender');
    document.getElementById('rev-gender').textContent = genderSelect.options[genderSelect.selectedIndex].text;
    
    // Residence
    document.getElementById('rev-residence').textContent = document.getElementById('residentialLocation').value;
    
    // Business Type
    const businessSelect = document.getElementById('businessType');
    let businessText = businessSelect.options[businessSelect.selectedIndex].text;
    if (businessSelect.value === 'Nyingine') {
        businessText = document.getElementById('customBusiness').value;
    }
    document.getElementById('rev-business').textContent = businessText;
    document.getElementById('rev-businessLoc').textContent = document.getElementById('businessLocation').value;
    
    // ID Type & details
    const idSelect = document.getElementById('idType');
    const idTypeVal = idSelect.value;
    document.getElementById('rev-idType').textContent = idSelect.options[idSelect.selectedIndex].text;
    
    if (idTypeVal === 'BARUA YA SERIKALI YA MTAA') {
        const fileInput = document.getElementById('localGovLetterFile');
        document.getElementById('rev-idDetail').textContent = fileInput.files.length > 0 ? 
            fileInput.files[0].name : (currentLanguage === 'SW' ? 'Haijachaguliwa' : 'Not chosen');
    } else {
        document.getElementById('rev-idDetail').textContent = document.getElementById('idNumber').value;
    }
    
    // Passport photo details
    const photoInput = document.getElementById('passportPhotoFile');
    document.getElementById('rev-passportPhoto').textContent = photoInput.files.length > 0 ? 
        photoInput.files[0].name : (currentLanguage === 'SW' ? 'Haijachaguliwa' : 'Not chosen');
}

// --- FORM SUBMISSION (FORMSPREE AJAX) ---
function submitForm() {
    const form = document.getElementById('regForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    loadingOverlay.classList.remove('hidden');

    const formData = new FormData(form);

    // Make request via fetch
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        loadingOverlay.classList.add('hidden');
        if (response.ok) {
            openSuccessModal();
            form.reset();
            // Reset wizard state
            showStep(1);
            // Reset file upload labels
            document.getElementById('localGovLetterFileName').textContent = 'No file chosen';
            document.getElementById('passportPhotoFileName').textContent = 'No file chosen';
            document.getElementById('customBusinessContainer').classList.add('hidden');
            document.getElementById('localGovLetterContainer').classList.add('hidden');
            document.getElementById('idNumberContainer').classList.remove('hidden');
        } else {
            response.json().then(data => {
                if (data.hasOwnProperty('errors')) {
                    showErrorModal(data['errors'].map(error => error['message']).join(", "));
                } else {
                    showErrorModal();
                }
            });
        }
    })
    .catch(error => {
        loadingOverlay.classList.add('hidden');
        showErrorModal();
    });
}

// --- MODAL CONTROLLERS ---
function openSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('hidden');
    // Scale animation
    setTimeout(() => {
        successModal.firstElementChild.classList.remove('scale-95');
        successModal.firstElementChild.classList.add('scale-100');
    }, 50);
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.firstElementChild.classList.remove('scale-100');
    successModal.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
        successModal.classList.add('hidden');
    }, 200);
}

function showErrorModal(customMsg = null) {
    const errorModal = document.getElementById('errorModal');
    const errorMessageText = document.getElementById('errorMessageText');

    if (customMsg) {
        errorMessageText.textContent = customMsg;
    } else {
        errorMessageText.innerHTML = currentLanguage === 'SW' ? 
            `<span class="sw-text">Haikuwezekana kutuma taarifa zako kwa sasa. Tafadhali angalia mtandao wako na ujaribu tena baadae.</span>` : 
            `<span class="en-text">Could not submit your information at this time. Please check your internet connection and try again.</span>`;
    }

    errorModal.classList.remove('hidden');
    setTimeout(() => {
        errorModal.firstElementChild.classList.remove('scale-95');
        errorModal.firstElementChild.classList.add('scale-100');
    }, 50);
}

function closeErrorModal() {
    const errorModal = document.getElementById('errorModal');
    errorModal.firstElementChild.classList.remove('scale-100');
    errorModal.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
        errorModal.classList.add('hidden');
    }, 200);
}

// --- INITIALIZE APPLICATION ---
window.addEventListener('DOMContentLoaded', () => {
    // Start background image slideshow
    startSlideshow();
});
