// Main application logic for the Denton PD Review App

// --- App State ---
let currentChapter = null;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = [];
let officerName = '';
let currentReviewType = null;
let currentUnitId = null;
let currentMode = 'quiz';
let backTargetScreen = 'ROOT'; // Renamed from previousScreen, initialized to ROOT

// --- DOM Elements ---
const mainHeader = document.querySelector('header');
const welcomeScreen = document.getElementById('welcome-screen');
const unitSelectionModal = document.getElementById('unit-selection-modal');
const chapterButtonsDiv = document.getElementById('chapter-buttons');
const quizContainerDiv = document.getElementById('quiz-container');
const resultsContainerDiv = document.getElementById('results-container');
const quizTitle = document.getElementById('quiz-title');
const questionNumberSpan = document.getElementById('question-number');
const totalQuestionsSpan = document.getElementById('total-questions');
const questionTextP = document.getElementById('question-text');
const optionsContainerDiv = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const feedbackReference = document.getElementById('feedback-reference');
const scoreSpan = document.getElementById('score');
const nextQuestionBtn = document.getElementById('next-question');

// Back Buttons
const backFromUnitSelectionBtn = document.getElementById('back-from-unit-selection');
const backFromQuizBtn = document.getElementById('back-from-quiz');
const backFromFlashcardBtn = document.getElementById('back-from-flashcard');

// Flashcard DOM Elements
const flashcardContainerDiv = document.getElementById('flashcard-container');
const flashcardTitle = document.getElementById('flashcard-title');
const flashcardNumberSpan = document.getElementById('flashcard-number');
const totalFlashcardsSpan = document.getElementById('total-flashcards');
const flashcardCard = document.getElementById('flashcard-card');
const flashcardQuestionTextP = document.getElementById('flashcard-question-text');
const flashcardAnswerTextP = document.getElementById('flashcard-answer-text');
const flashcardReferenceTextP = document.getElementById('flashcard-reference-text');
const previousFlashcardBtn = document.getElementById('previous-flashcard');
const nextFlashcardBtn = document.getElementById('next-flashcard');
const mainMenuFlashcardBtn = document.getElementById('main-menu-flashcard');

// --- Data ---
const generalOrderChapters = [
    { name: "Sample Unit (1 Question)", id: "unitSample" },
    { name: "Unit 1: Role, Authority & Organization", id: "unit1" },
    { name: "Unit 2: General Operations", id: "unit2" },
    { name: "Unit 3: Critical Incident Response", id: "unit3" },
    { name: "Unit 4: Patrol Operations", id: "unit4" },
    { name: "Unit 5: Special Populations", id: "unit5" },
    { name: "Unit 6: Technology & Media", id: "unit6" },
    { name: "Unit 7: Investigations", id: "unit7" },
    { name: "Unit 8: Equipment", id: "unit8" },
    { name: "Unit 9: Custody", id: "unit9" },
    { name: "Unit 10: Personnel", id: "unit10" },
    { name: "Unit 11: Records, Property & Evidence", id: "unit11" },
    { name: "Unit 12: Support Services", id: "unit12" },
    { name: "Unit 13: Internal Affairs & Ethics", id: "unit13" },
    { name: "Unit 14: Department Property & Appearance", id: "unit14" },
    { name: "Unit 15: Off-Duty Conduct & Secondary Employment", id: "unit15" }
];

const texasConstitutionArticles = [
    { name: "Article 1: Bill of Rights", id: "article1" },
    { name: "Article 3: Legislative Department", id: "article3" },
    { name: "Article 4: Executive Department", id: "article4" },
    { name: "Article 5: Judicial Department", id: "article5" },
    { name: "Article 6: Suffrage", id: "article6" },
    { name: "Article 7: Education", id: "article7" },
    { name: "Article 8: Taxation and Revenue", id: "article8" },
    { name: "Article 9: Counties", id: "article9" },
    { name: "Article 10: Railroads", id: "article10" },
    { name: "Article 11: Municipal Corporations", id: "article11" },
    { name: "Article 12: Private Corporations (Repealed)", id: "article12" },
    { name: "Article 14: Public Lands and Land Office (Repealed)", id: "article14" },
    { name: "Article 15: Impeachment", id: "article15" },
    { name: "Article 16: General Provisions", id: "article16" },
    { name: "Article 17: Mode of Amending the Constitution of this State", id: "article17" }
];

const texasStatuteCodes = [
    { name: "Penal Code", id: "penalCode" },
    { name: "Transportation Code", id: "transportationCode" },
    { name: "Alcoholic Beverage Code", id: "alcoholicBeverageCode" },
    { name: "Health and Safety Code", id: "healthAndSafetyCode" },
    { name: "Family Code", id: "familyCode" },
    { name: "Local Government Code", id: "localGovernmentCode" },
    { name: "Code of Criminal Procedure", id: "codeOfCriminalProcedure" },
    { name: "Education Code", id: "educationCode" },
    { name: "Government Code", id: "governmentCode" },
    { name: "Parks and Wildlife Code", id: "parksAndWildlifeCode" },
    { name: "Business and Commerce Code", id: "businessAndCommerceCode" },
    { name: "Property Code", id: "propertyCode" }
];

const tpcaCriticalAreas = [
    { name: "Use of Force", id: "useOfForce" },
    { name: "Emergency Vehicle Operation and Pursuits", id: "emergencyVehicleOperationAndPursuits" },
    { name: "Search, Seizure, and Arrest", id: "searchSeizureAndArrest" },
    { name: "Care, Custody and Restraint of Prisoners", id: "careCustodyAndRestraintOfPrisoners" },
    { name: "Domestic Violence and agency employee domestic conduct", id: "domesticViolenceAndAgencyEmployeeDomesticConduct" },
    { name: "Off-Duty Conduct", id: "offDutyConduct" },
    { name: "Selection and Hiring", id: "selectionAndHiring" },
    { name: "Sexual Harassment", id: "sexualHarassment" },
    { name: "Complaint and Internal Affairs Management", id: "complaintAndInternalAffairsManagement" },
    { name: "Narcotics, SWAT, and High-Risk Warrant Service", id: "narcoticsSwatAndHighRiskWarrantService" },
    { name: "Dealing with the Mentally Ill and Developmentally Disabled", id: "dealingWithTheMentallyIllAndDevelopmentallyDisabled" },
    { name: "Property and Evidence Management", id: "propertyAndEvidenceManagement" }
];

const bpocWeeks = [
    { name: "Week 1", id: "week1" },
    { name: "Week 2", id: "week2" },
    { name: "Week 3", id: "week3" },
    { name: "Week 4", id: "week4" },
    { name: "Week 5", id: "week5" },
    { name: "Week 6", id: "week6" },
    { name: "Week 7", id: "week7" },
    { name: "Week 8", id: "week8" },
    { name: "Week 9", id: "week9" },
    { name: "Week 10", id: "week10" },
    { name: "Week 11", id: "week11" },
    { name: "Week 12", id: "week12" },
    { name: "Week 13", id: "week13" },
    { name: "Week 14", id: "week14" },
    { name: "Week 15", id: "week15" },
    { name: "Week 16", id: "week16" },
    { name: "Week 17", id: "week17" },
    { name: "Week 18", id: "week18" },
    { name: "Week 19", id: "week19" },
    { name: "Week 20", id: "week20" },
    { name: "Week 21", id: "week21" }
];

const reviewTypes = [
    { id: 'generalOrders', name: 'General Orders', hasUnits: true, chapters: generalOrderChapters, questionLimit: 100 },
    { id: 'tcole', name: 'TCOLE Review', hasUnits: false, questionLimit: 250 },
    { id: 'texasConstitutions', name: 'Texas Constitutions', hasUnits: true, chapters: texasConstitutionArticles, questionLimit: 100 },
    { id: 'texasStatutes', name: 'Texas Statutes', hasUnits: true, chapters: texasStatuteCodes, questionLimit: 100 },
    { id: 'tpcaBestPractices', name: 'TPCA Best Practices', hasUnits: true, chapters: tpcaCriticalAreas, questionLimit: 100 },
    { id: 'BPOC', name: 'BPOC Review', hasUnits: true, chapters: bpocWeeks, questionLimit: 100 }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Attach event listeners for main menu/cancel buttons
    const closeModalBtn = document.getElementById('close-modal');
    const mainMenuQuizBtn = document.getElementById('main-menu-quiz');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', showWelcomeScreen);
    } else {
        console.warn('close-modal button not found during init');
    }
    
    if (mainMenuQuizBtn) {
        mainMenuQuizBtn.addEventListener('click', showWelcomeScreen);
    } else {
        console.warn('main-menu-quiz button not found during init');
    }
    
    // Attach other event listeners
    if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', nextQuestion);
    if (flashcardCard) flashcardCard.addEventListener('click', flipFlashcard);
    if (previousFlashcardBtn) previousFlashcardBtn.addEventListener('click', previousFlashcard);
    if (nextFlashcardBtn) nextFlashcardBtn.addEventListener('click', nextFlashcard);
    if (mainMenuFlashcardBtn) mainMenuFlashcardBtn.addEventListener('click', showWelcomeScreen);

    if (backFromUnitSelectionBtn) backFromUnitSelectionBtn.addEventListener('click', goBack);
    if (backFromQuizBtn) backFromQuizBtn.addEventListener('click', goBack);
    if (backFromFlashcardBtn) backFromFlashcardBtn.addEventListener('click', goBack);

    // Ensure we start with the correct initial state
    showWelcomeScreen(); 
    if (quizContainerDiv) quizContainerDiv.classList.add('hidden');
    if (resultsContainerDiv) resultsContainerDiv.classList.add('hidden');
    if (flashcardContainerDiv) flashcardContainerDiv.classList.add('hidden');

    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// --- UI Rendering ---
function renderModeSelection() {
    const welcomeScreenEl = document.getElementById('welcome-screen');
    const modeContainer = document.getElementById('mode-selection-container');
    const buttonsParent = document.getElementById('mode-selection-buttons'); 
    const reviewContainer = document.getElementById('review-type-container');
    const unitModal = document.getElementById('unit-selection-modal');

    // Check for required elements
    if (!welcomeScreenEl || !modeContainer || !buttonsParent) {
        console.error("Critical UI elements missing for renderModeSelection:", {
            welcomeScreenEl: !!welcomeScreenEl,
            modeContainer: !!modeContainer,
            buttonsParent: !!buttonsParent
        });
        return; 
    }
    
    console.log('renderModeSelection: Setting visibility states');
    
    // Ensure correct visibility states
    welcomeScreenEl.classList.remove('hidden');
    if (unitModal) unitModal.classList.add('hidden');
    modeContainer.classList.remove('hidden');
    if (reviewContainer) reviewContainer.classList.add('hidden');

    // Clear and recreate buttons
    console.log('renderModeSelection: Clearing existing buttons');
    buttonsParent.innerHTML = '';    console.log('renderModeSelection: Creating new buttons');
    
    // Create Quiz button
    const quizButton = document.createElement('button');
    quizButton.className = 'bg-purple-600 text-white px-6 md:px-8 py-3 md:py-3 rounded-lg hover:bg-purple-700 transition-colors text-base md:text-lg min-h-12 md:min-h-auto';
    quizButton.textContent = 'Start Quiz Review';
    quizButton.onclick = () => selectMode('quiz');
    
    // Force button visibility with inline styles for debugging
    quizButton.style.display = 'inline-block';
    quizButton.style.visibility = 'visible';
    quizButton.style.opacity = '1';
    quizButton.style.minHeight = '48px';
    quizButton.style.minWidth = '200px';
    
    buttonsParent.appendChild(quizButton);

    // Create Flashcard button
    const flashcardButton = document.createElement('button');
    flashcardButton.className = 'bg-teal-600 text-white px-6 md:px-8 py-3 md:py-3 rounded-lg hover:bg-teal-700 transition-colors text-base md:text-lg min-h-12 md:min-h-auto';
    flashcardButton.textContent = 'Start Flashcards';
    flashcardButton.onclick = () => selectMode('flashcards');
    
    // Force button visibility with inline styles for debugging
    flashcardButton.style.display = 'inline-block';
    flashcardButton.style.visibility = 'visible';
    flashcardButton.style.opacity = '1';
    flashcardButton.style.minHeight = '48px';
    flashcardButton.style.minWidth = '200px';
    
    buttonsParent.appendChild(flashcardButton);

    // Also force the container styles
    buttonsParent.style.display = 'flex';
    buttonsParent.style.flexDirection = 'column';
    buttonsParent.style.gap = '1rem';
    buttonsParent.style.alignItems = 'center';
    modeContainer.style.display = 'block';

    // Set navigation state
    backTargetScreen = 'ROOT';

    // Hide old buttons if they exist
    const oldSingleUnitBtn = document.getElementById('start-single-unit');
    const oldAllUnitsBtn = document.getElementById('start-all-units');
    if(oldSingleUnitBtn) oldSingleUnitBtn.classList.add('hidden');
    if(oldAllUnitsBtn) oldAllUnitsBtn.classList.add('hidden');
    
    console.log('renderModeSelection completed successfully. Buttons in container:', buttonsParent.children.length);
    console.log('Mode container visible:', !modeContainer.classList.contains('hidden'));
    console.log('Welcome screen visible:', !welcomeScreenEl.classList.contains('hidden'));
}

function selectMode(mode) {
    if (!handleNameCheck()) return;
    currentMode = mode;
    renderReviewTypeSelection(); 
    // backTargetScreen is set by renderReviewTypeSelection
}

function renderReviewTypeSelection() {
    const welcomeScreenEl = document.getElementById('welcome-screen');
    const modeSelectionContainer = document.getElementById('mode-selection-container');
    const reviewTypeContainer = document.getElementById('review-type-container');
    const reviewTypeButtonContainer = document.getElementById('review-type-buttons');
    const unitModal = document.getElementById('unit-selection-modal');

    if (!welcomeScreenEl || !modeSelectionContainer || !reviewTypeContainer || !reviewTypeButtonContainer || !unitModal) {
        console.error("One or more critical UI elements are missing for renderReviewTypeSelection.");
        if (welcomeScreenEl) welcomeScreenEl.classList.remove('hidden');
        return;
    }

    welcomeScreenEl.classList.remove('hidden'); // Ensure overall welcome screen is visible
    unitModal.classList.add('hidden');       // Ensure unit modal is hidden

    if (modeSelectionContainer) modeSelectionContainer.classList.add('hidden');
    if (reviewTypeContainer) reviewTypeContainer.classList.remove('hidden');

    reviewTypeButtonContainer.innerHTML = ''; 

    reviewTypes.forEach(type => {
        const button = document.createElement('button');
        button.className = 'bg-blue-600 text-white px-6 md:px-8 py-3 md:py-3 rounded-lg hover:bg-blue-700 transition-colors text-base md:text-lg min-h-12 md:min-h-auto';
        button.textContent = type.name;
        button.onclick = () => selectReviewType(type);
        reviewTypeButtonContainer.appendChild(button);
    });

    const modeButtonContainer = document.getElementById('mode-selection-buttons');
    if (modeButtonContainer) modeButtonContainer.classList.add('hidden');

    backTargetScreen = 'mode-selection'; // If on review type selection, back goes to mode selection

    const oldSingleUnitBtn = document.getElementById('start-single-unit');
    const oldAllUnitsBtn = document.getElementById('start-all-units');
    if(oldSingleUnitBtn) oldSingleUnitBtn.classList.add('hidden');
    if(oldAllUnitsBtn) oldAllUnitsBtn.classList.add('hidden');
}

function selectReviewType(reviewType) {
    if (!handleNameCheck()) return; 

    currentReviewType = reviewType;
    if (reviewType.hasUnits) {
        let modalTitle = 'Select Unit'; 
        if (currentMode === 'flashcards') modalTitle = `Select Unit for Flashcards`;

        if (reviewType.id === 'texasConstitutions') {
            modalTitle = currentMode === 'flashcards' ? 'Select Article for Flashcards' : 'Select Article';
        } else if (reviewType.id === 'texasStatutes') {
            modalTitle = currentMode === 'flashcards' ? 'Select Statute Code for Flashcards' : 'Select Statute Code';
        } else if (reviewType.id === 'tpcaBestPractices') {
            modalTitle = currentMode === 'flashcards' ? 'Select Critical Area for Flashcards' : 'Select Critical Area';
        } else if (reviewType.id === 'BPOC') {
            modalTitle = currentMode === 'flashcards' ? `Select Week for ${reviewType.name} Flashcards` : `Select Week for ${reviewType.name}`;
        } else if (currentMode === 'flashcards') { 
             modalTitle = `Select Unit for ${reviewType.name} Flashcards`;
        }
        renderChapterButtons(reviewType.chapters, modalTitle);
        unitSelectionModal.classList.remove('hidden');
        // backTargetScreen is set by renderChapterButtons
    } else {
        if (currentMode === 'quiz') {
            startQuiz(reviewType.id, null);
        } else {
            startFlashcards(reviewType.id, null);
        }
        // backTargetScreen is set by startQuiz/startFlashcards
    }
}

function renderChapterButtons(chapters, modalTitle = 'Select Unit') { 
    const modalHeader = unitSelectionModal.querySelector('h2');
    const welcomeScreenEl = document.getElementById('welcome-screen');

    if (modalHeader) {
        modalHeader.textContent = modalTitle;
    }
    chapterButtonsDiv.innerHTML = '';

    // This function populates unitSelectionModal, so ensure it's visible and welcome is hidden
    if (unitSelectionModal) unitSelectionModal.classList.remove('hidden');
    if (welcomeScreenEl) welcomeScreenEl.classList.add('hidden');

    const allButton = document.createElement('button');
    allButton.className = 'w-full bg-green-600 text-white p-3 md:p-4 rounded-lg text-base md:text-lg font-semibold hover:bg-green-700 transition-colors shadow-sm mb-2 min-h-12 md:min-h-auto';
    
    let allButtonText = 'All Units'; 
    if (currentReviewType.id === 'texasConstitutions') {
        allButtonText = 'All Articles';
    } else if (currentReviewType.id === 'texasStatutes') {
        allButtonText = 'All Statute Codes';
    } else if (currentReviewType.id === 'tpcaBestPractices') {
        allButtonText = 'All Critical Areas';
    } else if (currentReviewType.id === 'BPOC') {
        allButtonText = 'All Weeks';
    }
    allButton.textContent = allButtonText;

    allButton.onclick = () => {
        unitSelectionModal.classList.add('hidden');
        if (currentMode === 'quiz') {
            startQuiz(currentReviewType.id, 'all');
        } else {
            startFlashcards(currentReviewType.id, 'all');
        }
        // backTargetScreen is set by startQuiz/startFlashcards
    };
    chapterButtonsDiv.appendChild(allButton);

    chapters.forEach(chapter => {
        const button = document.createElement('button');
        button.className = 'w-full bg-blue-600 text-white p-3 md:p-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm min-h-12 md:min-h-auto';
        button.textContent = chapter.name;
        button.onclick = () => {
            unitSelectionModal.classList.add('hidden');
            if (currentReviewType.id === 'BPOC') {
                handleBpocWeekSelection(currentReviewType.id, chapter.id);
                // backTargetScreen will be set within handleBpocWeekSelection or renderSubcategorySelection
            } else {
                if (currentMode === 'quiz') {
                    startQuiz(currentReviewType.id, chapter.id);
                } else {
                    startFlashcards(currentReviewType.id, chapter.id);
                }
                // backTargetScreen is set by startQuiz/startFlashcards
            }
        };
        chapterButtonsDiv.appendChild(button);
    });
    backTargetScreen = 'review-type-selection'; // If on chapter/unit selection, back goes to review type selection
}

async function handleBpocWeekSelection(reviewTypeId, weekId) {
    currentUnitId = weekId; 
    let bpocData;
    try {
        // Ensure allReviewData is loaded, or fetch specifically if not.
        // Assuming allReviewData.BPOC is populated by data.js
        if (!allReviewData.BPOC) {
            console.warn("allReviewData.BPOC not found, attempting to fetch...");
            const response = await fetch(`data/BPOC.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for BPOC.json`);
            allReviewData.BPOC = await response.json(); // Populate it if it was missing
        }
        bpocData = allReviewData.BPOC; // Use the globally (or freshly) loaded data
        if (!bpocData) throw new Error("BPOC data could not be loaded or is empty.");

    } catch (error) {
        console.error("Error accessing or fetching BPOC data for subcategory check:", error);
        alert(`Error loading data for ${weekId}. Please try again or check console.`);
        showWelcomeScreen(); 
        return;
    }

    const weekData = bpocData[weekId];
    if (typeof weekData === 'object' && weekData !== null && !Array.isArray(weekData)) {
        renderSubcategorySelection(reviewTypeId, weekId, Object.keys(weekData));
        unitSelectionModal.classList.remove('hidden'); 
        // backTargetScreen is set by renderSubcategorySelection
    } else {
        if (currentMode === 'quiz') {
            startQuiz(reviewTypeId, weekId); 
        } else {
            startFlashcards(reviewTypeId, weekId); 
        }
        // backTargetScreen is set by startQuiz/startFlashcards
    }
}

function renderSubcategorySelection(reviewTypeId, weekId, subcategoryNames) {
    const modalHeader = unitSelectionModal.querySelector('h2');
    const weekDisplayName = bpocWeeks.find(w => w.id === weekId)?.name || weekId;
    const welcomeScreenEl = document.getElementById('welcome-screen');

    if (modalHeader) {
        modalHeader.textContent = `Select Subcategory for ${weekDisplayName}`;
    }
    chapterButtonsDiv.innerHTML = ''; 

    // This function populates unitSelectionModal, so ensure it's visible and welcome is hidden
    if (unitSelectionModal) unitSelectionModal.classList.remove('hidden');
    if (welcomeScreenEl) welcomeScreenEl.classList.add('hidden');

    const allSubcategoriesButton = document.createElement('button');
    allSubcategoriesButton.className = 'w-full bg-green-600 text-white p-3 md:p-4 rounded-lg text-base md:text-lg font-semibold hover:bg-green-700 transition-colors shadow-sm mb-2 min-h-12 md:min-h-auto';
    allSubcategoriesButton.textContent = `All Subcategories in ${weekDisplayName}`;
    allSubcategoriesButton.onclick = () => {
        unitSelectionModal.classList.add('hidden');
        if (currentMode === 'quiz') {
            startQuiz(reviewTypeId, weekId, 'all_subcategories'); 
        } else {
            startFlashcards(reviewTypeId, weekId, 'all_subcategories');
        }
        // backTargetScreen is set by startQuiz/startFlashcards
    };
    chapterButtonsDiv.appendChild(allSubcategoriesButton);

    subcategoryNames.forEach(subcategoryName => {
        const button = document.createElement('button');
        button.className = 'w-full bg-blue-600 text-white p-3 md:p-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm min-h-12 md:min-h-auto';
        button.textContent = subcategoryName;
        button.onclick = () => {
            unitSelectionModal.classList.add('hidden');
            if (currentMode === 'quiz') {
                startQuiz(reviewTypeId, weekId, subcategoryName); 
            } else {
                startFlashcards(reviewTypeId, weekId, subcategoryName);
            }
            // backTargetScreen is set by startQuiz/startFlashcards
        };
        chapterButtonsDiv.appendChild(button);
    });
    backTargetScreen = 'unit-selection'; // If on subcategory selection, back goes to unit (week) selection
}


// --- User Interaction & Flow ---
function handleNameCheck() {
    const nameInput = document.getElementById('officer-name'); 
    officerName = nameInput.value; 
    if (officerName.trim() === '') { 
        nameInput.classList.add('border-red-500', 'ring-red-500');
        nameInput.placeholder = 'Your name is required!';
        setTimeout(() => {
            nameInput.classList.remove('border-red-500', 'ring-red-500');
            nameInput.placeholder = 'Enter your full name';
        }, 2500);
        return false;
    }
    nameInput.classList.remove('border-red-500', 'ring-red-500');
    return true;
}

function showWelcomeScreen() {
     console.log('showWelcomeScreen called');
     
     // Hide all other containers first
     if (quizContainerDiv) quizContainerDiv.classList.add('hidden');
     if (flashcardContainerDiv) flashcardContainerDiv.classList.add('hidden'); 
     if (resultsContainerDiv) {
         resultsContainerDiv.innerHTML = ''; 
         resultsContainerDiv.classList.add('hidden');
     }
     if (unitSelectionModal) unitSelectionModal.classList.add('hidden'); 
     
     // Ensure the main welcome screen element itself is visible
     const welcomeScreenEl = document.getElementById('welcome-screen');
     if (!welcomeScreenEl) {
         console.error('Welcome screen element not found!');
         return;
     }
     welcomeScreenEl.classList.remove('hidden');
     console.log('Welcome screen made visible');
     
     // Show header and footer
     if (mainHeader) mainHeader.classList.remove('hidden');
     const footer = document.getElementById('main-page-footer');
     if (footer) footer.classList.remove('hidden'); 

     // Reset state variables
     currentReviewType = null; 
     currentUnitId = null; 
     currentMode = 'quiz';
     backTargetScreen = 'ROOT';
     
     // Force reset the button containers to initial state
     const modeContainer = document.getElementById('mode-selection-container');
     const reviewContainer = document.getElementById('review-type-container');
     
     if (!modeContainer || !reviewContainer) {
         console.error('Required containers not found!', { modeContainer: !!modeContainer, reviewContainer: !!reviewContainer });
         return;
     }
     
     // Ensure containers are in correct state
     modeContainer.classList.remove('hidden');
     reviewContainer.classList.add('hidden');
     console.log('Containers set to correct visibility state');
     
     // Clear any existing content to prevent conflicts
     const modeButtonsContainer = document.getElementById('mode-selection-buttons');
     const reviewButtonsContainer = document.getElementById('review-type-buttons');
     
     if (modeButtonsContainer) {
         modeButtonsContainer.innerHTML = '';
         console.log('Mode buttons container cleared');
     }
     if (reviewButtonsContainer) {
         reviewButtonsContainer.innerHTML = '';
         console.log('Review buttons container cleared');
     }
     
     // Call renderModeSelection to rebuild the mode buttons
     console.log('About to call renderModeSelection');
     renderModeSelection(); 
     console.log('showWelcomeScreen completed');
}

// --- Back Button Logic ---
function goBack() {
    // Start by hiding all primary content views
    welcomeScreen.classList.add('hidden');
    unitSelectionModal.classList.add('hidden');
    quizContainerDiv.classList.add('hidden');
    flashcardContainerDiv.classList.add('hidden');
    resultsContainerDiv.classList.add('hidden'); 

    mainHeader.classList.remove('hidden');
    document.getElementById('main-page-footer').classList.remove('hidden');

    switch (backTargetScreen) {
        case 'mode-selection':
            renderModeSelection(); 
            break;
        case 'review-type-selection':
            renderReviewTypeSelection(); 
            break;
        case 'unit-selection': 
            if (currentReviewType && currentReviewType.hasUnits) {
                let modalTitle = 'Select Unit'; 
                if (currentReviewType.id === 'texasConstitutions') modalTitle = 'Select Article';
                else if (currentReviewType.id === 'texasStatutes') modalTitle = 'Select Statute Code';
                else if (currentReviewType.id === 'tpcaBestPractices') modalTitle = 'Select Critical Area';
                else if (currentReviewType.id === 'BPOC') modalTitle = `Select Week for ${currentReviewType.name}`;
                else modalTitle = `Select Unit for ${currentReviewType.name}`;
                renderChapterButtons(currentReviewType.chapters, modalTitle);
                // unitSelectionModal.classList.remove('hidden'); // renderChapterButtons now handles this
            } else {
                console.warn("goBack to 'unit-selection' called without valid currentReviewType. Falling back to welcome screen.");
                showWelcomeScreen();
            }
            break;
        case 'subcategory-selection':
            // Ensure allReviewData and allReviewData.BPOC are available
            if (currentReviewType && currentReviewType.id === 'BPOC' && currentUnitId && 
                typeof allReviewData !== 'undefined' && allReviewData.BPOC && 
                typeof allReviewData.BPOC[currentUnitId] === 'object' && 
                !Array.isArray(allReviewData.BPOC[currentUnitId])) {
                renderSubcategorySelection(currentReviewType.id, currentUnitId, Object.keys(allReviewData.BPOC[currentUnitId]));
                // unitSelectionModal.classList.remove('hidden'); // renderSubcategorySelection now handles this
            } else {
                console.warn("goBack to 'subcategory-selection' called with invalid state or missing BPOC data. Fallback initiated.", { currentReviewType, currentUnitId, bpocDataExists: typeof allReviewData !== 'undefined' && !!allReviewData.BPOC });
                if (currentReviewType && currentReviewType.hasUnits) {
                    goBackToUnitSelection(); 
                } else {
                    showWelcomeScreen();
                }
            }
            break;
        case 'ROOT':
        default:
            showWelcomeScreen(); 
            break;
    }
}

function goBackToUnitSelection() { 
    if (currentReviewType && currentReviewType.hasUnits) {
        let modalTitle = 'Select Unit';
        if (currentReviewType.id === 'texasConstitutions') modalTitle = 'Select Article';
        else if (currentReviewType.id === 'texasStatutes') modalTitle = 'Select Statute Code';
        else if (currentReviewType.id === 'tpcaBestPractices') modalTitle = 'Select Critical Area';
        else if (currentReviewType.id === 'BPOC') modalTitle = `Select Week for ${currentReviewType.name}`;
        else modalTitle = `Select Unit for ${currentReviewType.name}`;
        renderChapterButtons(currentReviewType.chapters, modalTitle); // This will show modal and hide welcome
    } else {
        showWelcomeScreen();
    }
}

// --- Quiz Logic ---
async function startQuiz(reviewTypeId, unitId, subcategoryId = null) { 
    mainHeader.classList.remove('hidden');
    document.getElementById('main-page-footer').classList.remove('hidden'); 
    currentUnitId = unitId; 
    // currentReviewType should already be set when selectReviewType was called.

    // Set backTargetScreen based on the screen this quiz is launched FROM
    if (subcategoryId) {
        backTargetScreen = 'subcategory-selection';
    } else if (unitId) { // This includes 'all' or a specific unit/week
        backTargetScreen = 'unit-selection';
    } else { // No unitId implies launched directly from review type (e.g., TCOLE)
        backTargetScreen = 'review-type-selection';
    }

    const reviewTypeDetails = reviewTypes.find(rt => rt.id === reviewTypeId);
    if (!reviewTypeDetails) {
        console.error("Review type details not found for:", reviewTypeId);
        return;
    }

    let questionPool = [];
    let quizName = reviewTypeDetails.name; 
    const questionLimit = reviewTypeDetails.questionLimit;

    let allReviewDataForType = {};
    try {
        // Ensure allReviewData is loaded, or fetch specifically if not.
        // Assuming allReviewData[reviewTypeId] is populated by data.js
        if (typeof allReviewData === 'undefined' || !allReviewData[reviewTypeId]) {
            console.warn(`allReviewData.${reviewTypeId} not found, attempting to fetch...`);
            const response = await fetch(`data/${reviewTypeId}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${reviewTypeId}.json`);
            }
            if (typeof allReviewData === 'undefined') { // Initialize allReviewData if it's completely undefined
                window.allReviewData = {}; // Or however it's structured globally
            }
            allReviewData[reviewTypeId] = await response.json();
        }
        allReviewDataForType = allReviewData[reviewTypeId];
        if (!allReviewDataForType) throw new Error (`Data for ${reviewTypeId} could not be loaded or is empty.`);

    } catch (error) {
        console.error("Error fetching review data:", error);
        questionPool = [{ question: `Error loading questions for ${reviewTypeDetails.name}. (${error.message}). Please try again later.`, answer: "OK", options: ["OK"], reference: "N/A" }];
        questions = questionPool;
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        scoreSpan.textContent = score;
        quizTitle.textContent = `Error - ${reviewTypeDetails.name}`;
        totalQuestionsSpan.textContent = questions.length;
        welcomeScreen.classList.add('hidden');
        resultsContainerDiv.innerHTML = '';
        resultsContainerDiv.classList.add('hidden');
        quizContainerDiv.classList.remove('hidden');
        displayQuestion();
        return; 
    }

    if (reviewTypeDetails.id === 'BPOC') {
        if (unitId === 'all') { 
            currentChapter = { name: `Comprehensive BPOC Review`, id: "all" };
            quizName = currentChapter.name;
            for (const weekKey in allReviewDataForType) {
                const weekContent = allReviewDataForType[weekKey];
                if (typeof weekContent === 'object' && !Array.isArray(weekContent)) {
                    questionPool.push(...Object.values(weekContent).flat());
                } else if (Array.isArray(weekContent)) {
                    questionPool.push(...weekContent);
                }
            }
        } else { 
            currentChapter = reviewTypeDetails.chapters.find(c => c.id === unitId); 
            if (!currentChapter) {
                console.error(`BPOC chapter/week not found for id: ${unitId}`);
                questionPool = [{ question: `Week ${unitId} not found.`, answer: "OK", options: ["OK"], reference: "N/A" }];
            } else {
                quizName = `${reviewTypeDetails.name} - ${currentChapter.name}`;
                const weekData = allReviewDataForType[unitId];

                if (typeof weekData === 'object' && weekData !== null && !Array.isArray(weekData)) { 
                    if (subcategoryId === 'all_subcategories') {
                        questionPool = Object.values(weekData).flat();
                        quizName += ` - All Subcategories`;
                    } else if (subcategoryId) {
                        // Robust subcategory matching (case-insensitive, trimmed)
                        const subcatKey = Object.keys(weekData).find(k => k.trim().toLowerCase() === subcategoryId.trim().toLowerCase());
                        if (subcatKey && Array.isArray(weekData[subcatKey]) && weekData[subcatKey].length > 0) {
                            questionPool = [...weekData[subcatKey]];
                            quizName += ` - ${subcatKey}`;
                        } else {
                            questionPool = [{ question: `No questions found for subcategory '${subcategoryId}' in ${currentChapter.name}.`, answer: "OK", options: ["OK"], reference: "N/A" }];
                            quizName += ` - Subcategory Not Found`;
                        }
                    } else if (!subcategoryId) {
                        questionPool = [{ question: `Error: Subcategory not selected for ${currentChapter.name}.`, answer: "OK", options: ["OK"], reference: "N/A" }];
                        quizName += ` - Error: No Subcategory`;
                    }
                } else if (Array.isArray(weekData)) { 
                    questionPool = [...weekData]; 
                } else { 
                    questionPool = [{ question: `No questions found for ${currentChapter.name}.`, answer: "OK", options: ["OK"], reference: "N/A" }];
                }
            }
        }
    } else if (reviewTypeDetails.hasUnits) { 
        if (unitId === 'all') {
            currentChapter = { name: `Comprehensive ${reviewTypeDetails.name}`, id: "all" };
            quizName = currentChapter.name;
            if (typeof allReviewDataForType === 'object' && !Array.isArray(allReviewDataForType)) {
                 questionPool = Object.values(allReviewDataForType).flat(); 
            } else if (Array.isArray(allReviewDataForType)) { 
                questionPool = allReviewDataForType;
            } else {
                questionPool = []; 
            }
        } else {
            currentChapter = reviewTypeDetails.chapters.find(c => c.id === unitId);
            if (!currentChapter) {
                console.error(`Chapter not found for id: ${unitId} in review type ${reviewTypeId}`);
                questionPool = [{ question: `Unit ${unitId} not found.`, answer: "OK", options: ["OK"], reference: "N/A" }];
            } else {
                quizName = `${reviewTypeDetails.name} - ${currentChapter.name}`;
                let unitQuestions = allReviewDataForType[unitId];
                if (!unitQuestions || (Array.isArray(unitQuestions) && unitQuestions.length === 0)) {
                    let unitType = 'unit'; 
                    if (reviewTypeId === 'texasConstitutions') unitType = 'article';
                    if (reviewTypeId === 'texasStatutes') unitType = 'statute code';
                    if (reviewTypeId === 'tpcaBestPractices') unitType = 'critical area';
                    unitQuestions = [{ question: `This ${unitType} has no questions yet. Please check back later.`, answer: "OK", options: ["OK"], reference: "N/A" }];
                }
                questionPool = Array.isArray(unitQuestions) ? [...unitQuestions] : [];
                 if (!Array.isArray(unitQuestions)) { 
                    console.error(`Expected array for unit ${unitId} in ${reviewTypeId}, got object:`, unitQuestions);
                    questionPool = [{ question: `Error loading questions for ${currentChapter.name}.`, answer: "OK", options: ["OK"], reference: "N/A" }];
                }
            }
        }
    } else { 
        currentChapter = { name: reviewTypeDetails.name, id: reviewTypeId }; 
        quizName = currentChapter.name;
        questionPool = Array.isArray(allReviewDataForType) ? [...allReviewDataForType] : [];
        if (questionPool.length === 0) {
            questionPool = [{ question: `This section (${reviewTypeDetails.name}) has no questions yet.`, answer: "OK", options: ["OK"], reference: "N/A" }];
        }
    }

    if (questionPool.length > 0 && questionPool.every(q => typeof q === 'object' && q && q.question && q.options && q.answer)) {
        questions = [...questionPool].sort(() => Math.random() - 0.5);
        if (questionLimit && questions.length > questionLimit) {
            questions = questions.slice(0, questionLimit);
        }
    } else if (questionPool.length > 0) { 
        console.warn("Question pool contained invalid items. Filtering them out.", questionPool);
        questions = questionPool.filter(q => typeof q === 'object' && q && q.question && q.options && q.answer);
        if (questions.length === 0) { 
             if (questionPool.length === 1 && questionPool[0].question.toLowerCase().includes("error")) {
                questions = questionPool;
            } else {
                questions = [{ question: "No valid questions could be loaded for this selection.", answer: "OK", options: ["OK"], reference: "N/A" }];
            }
        } else { 
            questions = questions.sort(() => Math.random() - 0.5);
             if (questionLimit && questions.length > questionLimit) {
                questions = questions.slice(0, questionLimit);
            }
        }
    } else { 
        questions = [{ question: "No questions available for this selection.", answer: "OK", options: ["OK"], reference: "N/A" }];
    }
    
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    scoreSpan.textContent = score;
    quizTitle.textContent = quizName; 
    totalQuestionsSpan.textContent = questions.length;
    
    welcomeScreen.classList.add('hidden');
    resultsContainerDiv.innerHTML = '';
    resultsContainerDiv.classList.add('hidden');
    quizContainerDiv.classList.remove('hidden');

    displayQuestion();
}

function displayQuestion() {
    feedbackContainer.classList.add('hidden');
    nextQuestionBtn.classList.add('hidden');

    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    if (!question || typeof question.question === 'undefined') {
        console.error("Invalid question object at index:", currentQuestionIndex, question);
        questionTextP.textContent = "Error: Could not load this question.";
        optionsContainerDiv.innerHTML = '';
        const okButton = document.createElement('button');
        okButton.textContent = "Continue";
        okButton.onclick = nextQuestion;
        optionsContainerDiv.appendChild(okButton);
        nextQuestionBtn.classList.remove('hidden'); 
        return;
    }

    questionNumberSpan.textContent = currentQuestionIndex + 1;
    questionTextP.textContent = question.question;
    optionsContainerDiv.innerHTML = '';
    
    const options = Array.isArray(question.options) ? question.options : [];
    if (options.length === 0 && question.answer === "OK") { 
         const button = document.createElement('button');
        button.className = 'w-full text-left bg-white p-3 md:p-4 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-blue-500 transition-colors min-h-12 md:min-h-auto text-sm md:text-base';
        button.textContent = "OK";
        button.onclick = () => selectOption(button, "OK", question.answer, question.reference || "N/A");
        optionsContainerDiv.appendChild(button);
    } else {
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'w-full text-left bg-white p-3 md:p-4 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-blue-500 transition-colors min-h-12 md:min-h-auto text-sm md:text-base';
            button.textContent = option;
            button.onclick = () => selectOption(button, option, question.answer, question.reference);
            optionsContainerDiv.appendChild(button);
        });
    }
}

function selectOption(button, selectedAnswer, correctAnswer, reference) {
    const isCorrect = selectedAnswer.toLowerCase() === correctAnswer.toLowerCase();
    userAnswers.push({ question: questions[currentQuestionIndex].question, selected: selectedAnswer, correct: correctAnswer, isCorrect: isCorrect, reference: reference });

    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
        button.classList.add('correct');
        feedbackText.textContent = "Correct!";
    } else {
        button.classList.add('incorrect');
        feedbackText.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
        Array.from(optionsContainerDiv.children).forEach(child => {
            if (child.textContent.toLowerCase() === correctAnswer.toLowerCase()) {
                child.classList.add('correct');
            }
        });
    }
    feedbackReference.textContent = `Reference: ${reference || 'N/A'}`;
    feedbackContainer.classList.remove('hidden');
    
    Array.from(optionsContainerDiv.children).forEach(child => child.classList.add('disabled-option'));
    nextQuestionBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showResults() {
    quizContainerDiv.classList.add('hidden');
    resultsContainerDiv.innerHTML = ''; 
    resultsContainerDiv.classList.remove('hidden');
    mainHeader.classList.add('hidden'); 
    document.getElementById('main-page-footer').classList.add('hidden');

    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;

    const resultsTitleElement = document.createElement('h2');
    resultsTitleElement.className = 'text-4xl font-bold text-gray-800 mb-4 text-center';
    resultsTitleElement.textContent = 'Quiz Results';
    resultsContainerDiv.appendChild(resultsTitleElement);

    const officerInfo = document.createElement('p');
    officerInfo.className = 'text-lg text-gray-700 mb-2 text-center';
    officerInfo.textContent = `Officer: ${officerName}`;
    resultsContainerDiv.appendChild(officerInfo);

    const quizInfo = document.createElement('p');
    quizInfo.className = 'text-lg text-gray-700 mb-6 text-center';
    let quizTakenName = quizTitle.textContent || (currentReviewType ? currentReviewType.name : 'Quiz');
    quizInfo.textContent = `Quiz Taken: ${quizTakenName}`;
    resultsContainerDiv.appendChild(quizInfo);

    const scoreInfo = document.createElement('p');
    scoreInfo.className = 'text-2xl font-semibold text-gray-800 mb-6 text-center';
    scoreInfo.textContent = `Your Score: ${score} out of ${questions.length} (${percentage.toFixed(1)}%})`;
    resultsContainerDiv.appendChild(scoreInfo);

    if (questions.length > 0 && questions.every(q => q && q.question)) { // Check if questions are valid
        const reviewTitle = document.createElement('h3');
        reviewTitle.className = 'text-2xl font-semibold text-gray-800 mb-4 mt-8 text-center';
        reviewTitle.textContent = 'Review Your Answers';
        resultsContainerDiv.appendChild(reviewTitle);

        const reviewContainer = document.createElement('div');
        reviewContainer.className = 'space-y-6';

        userAnswers.forEach((answer, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'p-6 bg-white rounded-xl shadow-lg border';
            questionDiv.classList.add(answer.isCorrect ? 'border-green-500' : 'border-red-500');

            const qText = document.createElement('p');
            qText.className = 'text-lg font-semibold text-gray-800 mb-2';
            qText.textContent = `${index + 1}. ${answer.question}`;
            questionDiv.appendChild(qText);

            const userAnswerText = document.createElement('p');
            userAnswerText.className = 'text-md text-gray-700';
            userAnswerText.innerHTML = `Your answer: <span class="${answer.isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}">${answer.selected}</span>`;
            questionDiv.appendChild(userAnswerText);

            if (!answer.isCorrect) {
                const correctAnswerText = document.createElement('p');
                correctAnswerText.className = 'text-md text-green-700 font-semibold';
                correctAnswerText.textContent = `Correct answer: ${answer.correct}`;
                questionDiv.appendChild(correctAnswerText);
            }
            if (answer.reference && answer.reference !== "N/A") {
                const referenceText = document.createElement('p');
                referenceText.className = 'text-sm text-gray-500 mt-1';
                referenceText.textContent = `Reference: ${answer.reference}`;
                questionDiv.appendChild(referenceText);
            }
            reviewContainer.appendChild(questionDiv);
        });
        resultsContainerDiv.appendChild(reviewContainer);
    } else {
        const noQuestionsMessage = document.createElement('p');
        noQuestionsMessage.className = 'text-lg text-gray-700 text-center';
        noQuestionsMessage.textContent = 'No questions were available for this quiz or an error occurred loading them.';
        resultsContainerDiv.appendChild(noQuestionsMessage);
    }

    const mainMenuBtn = document.createElement('button');
    mainMenuBtn.id = 'main-menu-results';
    mainMenuBtn.className = 'block mx-auto mt-10 bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors text-xl shadow-md';
    mainMenuBtn.textContent = 'Main Menu';
    mainMenuBtn.onclick = showWelcomeScreen;
    resultsContainerDiv.appendChild(mainMenuBtn);
}


// --- Flashcard Logic ---
async function startFlashcards(reviewTypeId, unitId, subcategoryId = null) {
    mainHeader.classList.remove('hidden');
    document.getElementById('main-page-footer').classList.remove('hidden');
    currentUnitId = unitId;
    // currentReviewType should already be set

    // Set backTargetScreen based on the screen these flashcards are launched FROM
    if (subcategoryId) {
        backTargetScreen = 'subcategory-selection';
    } else if (unitId) { // This includes 'all' or a specific unit/week
        backTargetScreen = 'unit-selection';
    } else { // No unitId implies launched directly from review type
        backTargetScreen = 'review-type-selection';
    }

    const reviewTypeDetails = reviewTypes.find(rt => rt.id === reviewTypeId);
    if (!reviewTypeDetails) {
        console.error("Review type details not found for flashcards:", reviewTypeId);
        return;
    }

    let questionPool = [];
    let cardSetName = reviewTypeDetails.name;
    const questionLimit = reviewTypeDetails.questionLimit; 

    let allReviewDataForType = {};
    try {
        // Ensure allReviewData is loaded, or fetch specifically if not.
        if (typeof allReviewData === 'undefined' || !allReviewData[reviewTypeId]) {
            console.warn(`allReviewData.${reviewTypeId} not found for flashcards, attempting to fetch...`);
            const response = await fetch(`data/${reviewTypeId}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${reviewTypeId}.json`);
            if (typeof allReviewData === 'undefined') {
                window.allReviewData = {};
            }
            allReviewData[reviewTypeId] = await response.json();
        }
        allReviewDataForType = allReviewData[reviewTypeId];
        if (!allReviewDataForType) throw new Error (`Data for ${reviewTypeId} could not be loaded or is empty for flashcards.`);
    } catch (error) {
        console.error("Error fetching review data for flashcards:", error);
        questionPool = [{ question: `Error loading flashcards for ${reviewTypeDetails.name}. (${error.message})`, answer: "Please try again.", reference: "N/A" }];
    }

    if (reviewTypeDetails.id === 'BPOC') {
        if (unitId === 'all') {
            currentChapter = { name: `Comprehensive BPOC Flashcards`, id: "all" };
            cardSetName = currentChapter.name;
            for (const weekKey in allReviewDataForType) {
                const weekContent = allReviewDataForType[weekKey];
                if (typeof weekContent === 'object' && !Array.isArray(weekContent)) {
                    questionPool.push(...Object.values(weekContent).flat());
                } else if (Array.isArray(weekContent)) {
                    questionPool.push(...weekContent);
                }
            }
        } else { 
            currentChapter = reviewTypeDetails.chapters.find(c => c.id === unitId);
            if (!currentChapter) {
                console.error(`BPOC chapter/week not found for id: ${unitId} in flashcards`);
                questionPool = [{ question: `Week ${unitId} not found for flashcards.`, answer: "Error", reference: "N/A" }];
            } else {
                cardSetName = `${reviewTypeDetails.name} - ${currentChapter.name}`;
                const weekData = allReviewDataForType[unitId];

                if (typeof weekData === 'object' && weekData !== null && !Array.isArray(weekData)) {
                    if (subcategoryId === 'all_subcategories') {
                        questionPool = Object.values(weekData).flat();
                        cardSetName += ` - All Subcategories`;
                    } else if (subcategoryId && weekData[subcategoryId]) {
                        questionPool = [...weekData[subcategoryId]];
                        cardSetName += ` - ${subcategoryId}`;
                    } else if (!subcategoryId) {
                        console.warn(`BPOC week ${unitId} has subcategories, but none selected for flashcards. Loading all from week.`);
                        questionPool = Object.values(weekData).flat(); // Default to all subcategories of the week
                        cardSetName += ` - All Subcategories (Default)`;
                    } else {
                        questionPool = [{ question: `Subcategory '${subcategoryId}' not found in ${currentChapter.name} for flashcards.`, answer: "Error", reference: "N/A" }];
                        cardSetName += ` - Subcategory Not Found`;
                    }
                } else if (Array.isArray(weekData)) {
                    questionPool = [...weekData];
                } else {
                    questionPool = [{ question: `No flashcards found for ${currentChapter.name}.`, answer: "Check later.", reference: "N/A" }];
                }
            }
        }
    } else if (reviewTypeDetails.hasUnits) {
        if (unitId === 'all') {
            currentChapter = { name: `Comprehensive ${reviewTypeDetails.name} Flashcards`, id: "all" };
            cardSetName = currentChapter.name;
            if (typeof allReviewDataForType === 'object' && !Array.isArray(allReviewDataForType)) {
                questionPool = Object.values(allReviewDataForType).flat();
            } else if (Array.isArray(allReviewDataForType)) {
                questionPool = allReviewDataForType;
            } else {
                questionPool = [];
            }
        } else {
            currentChapter = reviewTypeDetails.chapters.find(c => c.id === unitId);
            if (!currentChapter) {
                 console.error(`Chapter not found for id: ${unitId} in flashcards type ${reviewTypeId}`);
                 questionPool = [{ question: `Unit ${unitId} not found for flashcards.`, answer: "Error", reference: "N/A" }];
            } else {
                cardSetName = `${reviewTypeDetails.name} - ${currentChapter.name}`;
                let unitQuestions = allReviewDataForType[unitId];
                if (!unitQuestions || (Array.isArray(unitQuestions) && unitQuestions.length === 0)) {
                    let unitType = 'unit';
                    if (reviewTypeId === 'texasConstitutions') unitType = 'article';
                    if (reviewTypeId === 'texasStatutes') unitType = 'statute code';
                    if (reviewTypeId === 'tpcaBestPractices') unitType = 'critical area';
                    unitQuestions = [{ question: `This ${unitType} has no flashcards yet.`, answer: "Please check back later.", reference: "N/A" }];
                }
                questionPool = Array.isArray(unitQuestions) ? [...unitQuestions] : [];
                if (!Array.isArray(unitQuestions)) {
                    console.error(`Expected array for flashcard unit ${unitId} in ${reviewTypeId}, got object:`, unitQuestions);
                    questionPool = [{ question: `Error loading flashcards for ${currentChapter.name}.`, answer: "Error", reference: "N/A" }];
                }
            }
        }
    } else {
        currentChapter = { name: reviewTypeDetails.name, id: reviewTypeId };
        cardSetName = currentChapter.name;
        questionPool = Array.isArray(allReviewDataForType) ? [...allReviewDataForType] : [];
         if (questionPool.length === 0) {
            questionPool = [{ question: `This section (${reviewTypeDetails.name}) has no flashcards yet.`, answer: "Please check back later.", reference: "N/A" }];
        }
    }

    if (questionPool.length > 0 && questionPool.every(q => typeof q === 'object' && q && q.question && q.answer)) {
        questions = [...questionPool].sort(() => Math.random() - 0.5);
        if (questionLimit && questions.length > questionLimit) {
            questions = questions.slice(0, questionLimit);
        }
    } else if (questionPool.length > 0) {
        console.warn("Flashcard pool contained invalid items. Filtering them out.", questionPool);
        questions = questionPool.filter(q => typeof q === 'object' && q && q.question && q.answer);
        if (questions.length === 0) {
            if (questionPool.length === 1 && questionPool[0].question.toLowerCase().includes("error")) {
                questions = questionPool;
            } else {
                questions = [{ question: "No valid flashcards could be loaded.", answer: "Error", reference: "N/A" }];
            }
        }
    } else {
        questions = [{ question: "No flashcards available for this selection.", answer: "Error", reference: "N/A" }];
    }
    
    currentQuestionIndex = 0; 
    
    flashcardTitle.textContent = cardSetName;
    totalFlashcardsSpan.textContent = questions.length;
    
    welcomeScreen.classList.add('hidden');
    quizContainerDiv.classList.add('hidden');
    resultsContainerDiv.classList.add('hidden');
    flashcardContainerDiv.classList.remove('hidden');

    displayFlashcard();
}


function displayFlashcard() {
    if (!questions || questions.length === 0 || !questions[currentQuestionIndex]) {
        flashcardQuestionTextP.textContent = "No flashcards available or error loading.";
        flashcardAnswerTextP.textContent = "";
        flashcardReferenceTextP.textContent = "";
        flashcardNumberSpan.textContent = "0";
        totalFlashcardsSpan.textContent = "0";
        previousFlashcardBtn.classList.add('hidden');
        nextFlashcardBtn.classList.add('hidden');
        if(flashcardCard) flashcardCard.classList.remove('is-flipped');
        return;
    }

    // Ensure currentQuestionIndex is within bounds
    if (currentQuestionIndex >= questions.length) currentQuestionIndex = questions.length - 1;
    if (currentQuestionIndex < 0) currentQuestionIndex = 0;

    const card = questions[currentQuestionIndex];
    if (!card || typeof card.question === 'undefined' || typeof card.answer === 'undefined') {
        flashcardQuestionTextP.textContent = "Error loading this flashcard.";
        flashcardAnswerTextP.textContent = "Please try again.";
        flashcardReferenceTextP.textContent = "";
    } else {
        flashcardQuestionTextP.textContent = card.question;
        flashcardAnswerTextP.textContent = card.answer;
        flashcardReferenceTextP.textContent = card.reference ? `Reference: ${card.reference}` : "";
    }
    
    flashcardNumberSpan.textContent = currentQuestionIndex + 1;
    totalFlashcardsSpan.textContent = questions.length; // Ensure this is updated if questions array changes
    
    if(flashcardCard) flashcardCard.classList.remove('is-flipped');

    previousFlashcardBtn.classList.remove('hidden');
    nextFlashcardBtn.classList.remove('hidden');
    previousFlashcardBtn.disabled = currentQuestionIndex === 0;
    nextFlashcardBtn.disabled = currentQuestionIndex >= questions.length - 1; // Use >= to be safe

    previousFlashcardBtn.classList.toggle('opacity-50', previousFlashcardBtn.disabled);
    nextFlashcardBtn.classList.toggle('opacity-50', nextFlashcardBtn.disabled);
}

function flipFlashcard() {
    if(flashcardCard) flashcardCard.classList.toggle('is-flipped');
}

function previousFlashcard() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayFlashcard();
    }
}

function nextFlashcard() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayFlashcard();
    }
}

// --- Results & Reporting ---
function getRecommendations() {
    const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);
    if(incorrectAnswers.length === 0) {
        return '<p>Excellent work! No specific areas for review based on this perfect score.</p>';
    }
    

    
    const topics = {};
    incorrectAnswers.forEach(ans => {
        if (ans.reference === 'N/A') return;
        
        let topicKey = ans.reference; 

        if (currentReviewType) {
            if (currentReviewType.id === 'generalOrders') {
                // Extracts 'Chapter X' from 'GO X.Y.Z' or similar
                const match = ans.reference.match(/^GO\s*(\d+)/i);
                if (match && match[1]) {
                    topicKey = `General Order Chapter ${match[1]}`;
                } else {
                    topicKey = ans.reference; // Fallback if GO format is unexpected
                }
            } else if (currentReviewType.id === 'texasConstitutions') {
                // Extracts 'Article X' from 'TX Const. Art. X Sec. Y'
                const match = ans.reference.match(/^TX Const\.\s*Art\.\s*(\w+)/i);
                if (match && match[1]) {
                    // Attempt to find the article name from the configured list
                    const articleDetail = texasConstitutionArticles.find(art => art.id.toLowerCase() === `article${match[1]}`.toLowerCase());
                    topicKey = articleDetail ? articleDetail.name : `Texas Constitution Article ${match[1]}`;
                } else {
                    topicKey = ans.reference; // Fallback
                }
            } else if (currentReviewType.id === 'texasStatutes') {
                // Example: Reference "PC 1.01" -> topicKey "Penal Code"
                // Example: Reference "TX CCP Art. 1.01" -> topicKey "Code of Criminal Procedure"
                const statuteCodeDetails = texasStatuteCodes.find(code => {
                    // Create a flexible regex to match common prefixes like "PC", "TC", "ABC", "HSC", "FC", "LGC", "CCP", "EC", "GC", "PWC", "BCC", "PROP"
                    // This is a simplified approach; more robust parsing might be needed if reference formats vary wildly.
                    const codePrefix = ans.reference.split(' ')[0].toUpperCase();
                    const idPrefix = code.id.replace(/Code$/, '').toUpperCase(); // e.g. penalCode -> PENAL
                     // Add more specific matches if needed for other codes with common abbreviations
                    return idPrefix.startsWith(codePrefix) || code.name.toUpperCase().startsWith(codePrefix);
                });
                if (statuteCodeDetails) {
                    topicKey = statuteCodeDetails.name;
                } else {
                    // Fallback if no specific code is matched from reference
                    const firstWord = ans.reference.split(' ')[0];
                    const matchedCode = texasStatuteCodes.find(c => c.id.toLowerCase().startsWith(firstWord.toLowerCase().replace(/code$/, '')));
                    topicKey = matchedCode ? matchedCode.name : ans.reference;
                }
            } else if (currentReviewType.id === 'tpcaBestPractices') {
                // Example: Reference "TPCA BP 1.1" -> topicKey "Use of Force"
                // This requires that TPCA references clearly map to one of the critical areas.
                // For simplicity, we'll try to match based on the reference prefix or a keyword.
                const criticalAreaDetail = tpcaCriticalAreas.find(area => {
                    // A more robust mapping might be needed if references are not standardized.
                    // This is a basic attempt to link reference to area name or ID.
                    const refUpper = ans.reference.toUpperCase();
                    const areaNameUpper = area.name.toUpperCase();
                    const areaIdUpper = area.id.toUpperCase();
                    return refUpper.includes(areaNameUpper) || refUpper.includes(areaIdUpper) || areaNameUpper.includes(refUpper.split(' ')[0]);
                });
                if (criticalAreaDetail) {
                    topicKey = criticalAreaDetail.name;
                } else {
                    topicKey = ans.reference; // Fallback
                }
            } else {
                topicKey = ans.reference;
            }
        }

        if(topics[topicKey]){
            topics[topicKey]++;
        } else {
            topics[topicKey] = 1;
        }
    });

    if (Object.keys(topics).length === 0) {
         return '<p>Good effort. Please review the material again.</p>';
    }

    let recommendations = '<p class="mb-4">Based on your results, it is recommended to focus your review on the following areas:</p><ul class="list-disc list-inside space-y-2">';
    for(const topic in topics) {
        recommendations += `<li><strong>${topic}:</strong> You missed ${topics[topic]} question(s) in this area. A thorough review is advised.</li>`;
    }
    recommendations += '</ul>';
    return recommendations;
}

function generateReportHTML() {
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100) : 0;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const recommendationsText = getRecommendations(); // Renamed for clarity
    const timePrinted = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const radius = 70; // Increased radius for a larger circle
    const strokeWidth = 14; // Thicker stroke
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Determine pass/fail status and corresponding colors
    const passThreshold = 80; // Example threshold
    const isPass = percentage >= passThreshold;
    const scoreColorClass = isPass ? 'text-green-600' : 'text-red-600';
    const scoreBgClass = isPass ? 'bg-green-50' : 'bg-red-50';
    const progressRingColor = isPass ? 'text-green-500' : 'text-red-500'; // For the ring itself

    return `
        <div class="report-container bg-white p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
            <header class="report-header border-b-2 border-gray-300 pb-6 mb-8">
                <div class="flex flex-col sm:flex-row justify-between items-center">
                    <div class="flex items-center mb-4 sm:mb-0">
                        <img src="assets/DPD email logo.png" alt="Denton PD Logo" class="h-20 w-20 mr-4 rounded-full shadow-md">
                        <div>
                            <h1 class="text-3xl sm:text-4xl font-bold text-gray-800">Performance Review</h1>
                            <p class="text-lg text-gray-600">Denton Police Department</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">Date: ${date}</p>
                        <p class="text-sm text-gray-500 print-only">Time Printed: ${timePrinted}</p>
                    </div>
                </div>
            </header>

            <section class="report-body grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div class="md:col-span-1 officer-info bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm"> <!-- Renamed class -->
                    <h3 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Officer Information</h3> <!-- Renamed text -->
                    <div class="space-y-3">
                        <div><strong class="block text-sm font-medium text-gray-500">Name:</strong> <span class="text-lg text-gray-800">${officerName}</span></div> <!-- Renamed variable -->
                        <div><strong class="block text-sm font-medium text-gray-500">Assessment Type:</strong> <span class="text-lg text-gray-800">${currentReviewType.name}</span></div>
                        ${currentReviewType.hasUnits && currentUnitId !== 'all' ? `<div><strong class="block text-sm font-medium text-gray-500">Unit Tested:</strong> <span class="text-lg text-gray-800">${currentChapter.name.replace(currentReviewType.name + " - ", "")}</span></div>` : ''}
                        ${currentUnitId === 'all' ? `<div><strong class="block text-sm font-medium text-gray-500">Unit Tested:</strong> <span class="text-lg text-gray-800">All Units</span></div>` : ''}

                        <!-- New field for Date of Assessment -->
                        <div><strong class="block text-sm font-medium text-gray-500">Date of Assessment:</strong> <span class="text-lg text-gray-800">${date}</span></div>
                    </div>
                </div>

                <div class="md:col-span-2 performance-summary">
                    <h3 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Assessment Results</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                        <div class="score-visual text-center p-2 sm:p-4">
                            <svg class="w-40 h-40 sm:w-48 sm:h-48 mx-auto" viewBox="0 0 ${2 * (radius + strokeWidth)} ${2 * (radius + strokeWidth)}">
                                <circle class="text-gray-200" stroke-width="${strokeWidth}" stroke="currentColor" fill="transparent" r="${radius}" cx="${radius + strokeWidth}" cy="${radius + strokeWidth}" />
                                <circle class="progress-ring__circle ${progressRingColor}" stroke-width="${strokeWidth}" stroke-dasharray="${circumference} ${circumference}" style="stroke-dashoffset:${offset}; transition: stroke-dashoffset 1s ease-out;" stroke-linecap="round" stroke="currentColor" fill="transparent" r="${radius}" cx="${radius + strokeWidth}" cy="${radius + strokeWidth}" />
                                <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="text-3xl sm:text-4xl font-bold ${scoreColorClass} fill-current">${percentage.toFixed(0)}%</text>
                            </svg>
                            <p class="mt-2 text-lg font-semibold ${scoreColorClass}">${isPass ? 'Status: PASS' : 'Status: NEEDS IMPROVEMENT'}</p>
                        </div>
                        <div class="score-details space-y-3 ${scoreBgClass} p-4 rounded-lg shadow-sm">
                            <div class="flex justify-between items-center">
                                <span class="text-md font-medium text-gray-700">Total Questions:</span>
                                <span class="text-xl font-bold text-gray-900">${totalQuestions}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-md font-medium text-green-700">Correct Answers:</span>
                                <span class="text-xl font-bold text-green-700">${score}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-md font-medium text-red-700">Incorrect Answers:</span>
                                <span class="text-xl font-bold text-red-700">${totalQuestions - score}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="recommendations-section mt-8 pt-6 border-t border-gray-300">
                <h3 class="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-blue-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    Recommendations for Review
                </h3>
                <div class="text-gray-700 bg-sky-50 p-6 rounded-lg shadow-sm prose max-w-none">${recommendationsText}</div>
            </section>
            
            <section class="signature-section mt-12 pt-10 border-t-2 border-dashed border-gray-400 print-only">
                 <h3 class="text-xl font-semibold text-gray-700 mb-6 text-center">Signatures</h3>
                 <div class="grid grid-cols-2 gap-12">
                    <div class="signature-line">
                        <p class="text-gray-600 text-sm">Officer Signature:</p> <!-- Renamed text -->
                        <div class="mt-12 border-b-2 border-gray-500"></div>
                    </div>
                    <div class="signature-line">
                        <p class="text-gray-600 text-sm">Supervisor Signature:</p>
                        <div class="mt-12 border-b-2 border-gray-500"></div>
                    </div>
                 </div>
                 <p class="text-center text-sm text-gray-600 mt-10"><em>Official Training Report - Denton Police Department</em></p>
            </section>

            <div class="report-actions mt-10 pt-8 border-t border-gray-300 no-print">
                <div class="flex justify-center gap-4">
                    <button id="print-report-btn" class="action-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Print Report
                    </button>
                     <button id="main-menu-results" class="action-button-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="m3 9 9-7 9  7v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    `;
}
