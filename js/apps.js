// Main application logic for the Denton PD Review App

// --- App State ---
let currentChapter = null;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = [];
let officerName = ''; // Renamed from recruitName
let currentReviewType = null; // To store 'generalOrders', 'tcole', etc.
let currentUnitId = null; // To store specific unitId if applicable
let currentMode = 'quiz'; // 'quiz' or 'flashcards'

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
// Renamed chaptersData to generalOrderChapters for clarity
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
    { name: "Unit 15 & 16: Off-Duty, Secondary Employment & Wellness", id: "unit15" } // Renamed and combined
    // Unit 16 is removed
];

const texasConstitutionArticles = [
    { name: "Article 1: Bill of Rights", id: "article1" },
    { name: "Article 2: The Powers of Government", id: "article2" },
    { name: "Article 3: Legislative Department", id: "article3" },
    { name: "Article 4: Executive Department", id: "article4" },
    { name: "Article 5: Judicial Department", id: "article5" },
    { name: "Article 6: Suffrage", id: "article6" },
    { name: "Article 7: Education", id: "article7" },
    { name: "Article 8: Taxation and Revenue", id: "article8" },
    { name: "Article 9: Counties", id: "article9" },
    { name: "Article 10: Railroads", id: "article10" },
    { name: "Article 11: Municipal Corporations", id: "article11" },
    { name: "Article 12: Private Corporations", id: "article12" },
    { name: "Article 13: Spanish and Mexican Land Titles (Repealed)", id: "article13" },
    { name: "Article 14: Public Lands and Land Office", id: "article14" },
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

const reviewTypes = [
    { id: 'generalOrders', name: 'General Orders', hasUnits: true, chapters: generalOrderChapters, questionLimit: 100 },
    { id: 'tcole', name: 'TCOLE Review', hasUnits: false, questionLimit: 250 },
    { id: 'texasConstitutions', name: 'Texas Constitutions', hasUnits: true, chapters: texasConstitutionArticles, questionLimit: 100 },
    { id: 'texasStatutes', name: 'Texas Statutes', hasUnits: true, chapters: texasStatuteCodes, questionLimit: 100 },
    { id: 'tpcaBestPractices', name: 'TPCA Best Practices', hasUnits: true, chapters: tpcaCriticalAreas, questionLimit: 100 } // Added TPCA
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', init);

function init() {
    // document.getElementById('start-single-unit').addEventListener('click', showUnitSelection);
    // document.getElementById('start-all-units').addEventListener('click', startAllUnitsQuiz);
    document.getElementById('close-modal').addEventListener('click', () => unitSelectionModal.classList.add('hidden'));
    document.getElementById('main-menu-quiz').addEventListener('click', showWelcomeScreen);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    
    // Flashcard listeners
    if (flashcardCard) flashcardCard.addEventListener('click', flipFlashcard);
    if (previousFlashcardBtn) previousFlashcardBtn.addEventListener('click', previousFlashcard);
    if (nextFlashcardBtn) nextFlashcardBtn.addEventListener('click', nextFlashcard);
    if (mainMenuFlashcardBtn) mainMenuFlashcardBtn.addEventListener('click', showWelcomeScreen);

    renderModeSelection(); // Initial call to render mode selection
    // renderReviewTypeSelection(); // This will be called after mode selection
    // Hide containers that shouldn't be visible on load
    quizContainerDiv.classList.add('hidden');
    resultsContainerDiv.classList.add('hidden');
    flashcardContainerDiv.classList.add('hidden');

    // Set current year in the footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// --- UI Rendering ---
function renderModeSelection() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const modeButtonContainer = document.getElementById('mode-selection-buttons');
    modeButtonContainer.innerHTML = ''; // Clear existing buttons

    const quizButton = document.createElement('button');
    quizButton.className = 'bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg';
    quizButton.textContent = 'Start Quiz Review';
    quizButton.onclick = () => selectMode('quiz');
    modeButtonContainer.appendChild(quizButton);

    const flashcardButton = document.createElement('button');
    flashcardButton.className = 'bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors text-lg';
    flashcardButton.textContent = 'Start Flashcards';
    flashcardButton.onclick = () => selectMode('flashcards');
    modeButtonContainer.appendChild(flashcardButton);

    // Hide review type buttons until a mode is selected
    const reviewTypeButtonContainer = welcomeScreen.querySelector('#review-type-buttons');
    if (reviewTypeButtonContainer) reviewTypeButtonContainer.classList.add('hidden');
}

function selectMode(mode) {
    if (!handleNameCheck()) return;
    currentMode = mode;
    renderReviewTypeSelection(); // Now show review type selection
    const modeButtonContainer = document.getElementById('mode-selection-buttons');
    if (modeButtonContainer) modeButtonContainer.classList.add('hidden'); // Hide mode buttons
}

function renderReviewTypeSelection() {
    const welcomeScreen = document.getElementById('welcome-screen');
    let reviewTypeButtonContainer = welcomeScreen.querySelector('#review-type-buttons');

    if (!reviewTypeButtonContainer) {
        reviewTypeButtonContainer = document.createElement('div');
        reviewTypeButtonContainer.id = 'review-type-buttons';
        reviewTypeButtonContainer.className = 'flex flex-col sm:flex-row justify-center gap-4 mt-6';
        const nameInput = document.getElementById('officer-name');
        nameInput.insertAdjacentElement('afterend', reviewTypeButtonContainer);
    } else {
        reviewTypeButtonContainer.innerHTML = ''; // Clear existing buttons if any
        reviewTypeButtonContainer.classList.remove('hidden'); // Make sure it's visible
    }

    reviewTypes.forEach(type => {
        const button = document.createElement('button');
        button.className = 'bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg';
        button.textContent = type.name;
        button.onclick = () => selectReviewType(type);
        reviewTypeButtonContainer.appendChild(button);
    });

    // Hide old buttons if they exist (or repurpose them)
    const oldSingleUnitBtn = document.getElementById('start-single-unit');
    const oldAllUnitsBtn = document.getElementById('start-all-units');
    if(oldSingleUnitBtn) oldSingleUnitBtn.classList.add('hidden');
    if(oldAllUnitsBtn) oldAllUnitsBtn.classList.add('hidden');
}

function selectReviewType(reviewType) {
    if (!handleNameCheck()) return; // Should have already been checked by selectMode, but good for safety

    currentReviewType = reviewType;
    if (reviewType.hasUnits) {
        let modalTitle = 'Select Unit'; // Default
        if (currentMode === 'flashcards') modalTitle = `Select Unit for Flashcards`;

        if (reviewType.id === 'texasConstitutions') {
            modalTitle = currentMode === 'flashcards' ? 'Select Article for Flashcards' : 'Select Article';
        } else if (reviewType.id === 'texasStatutes') {
            modalTitle = currentMode === 'flashcards' ? 'Select Statute Code for Flashcards' : 'Select Statute Code';
        } else if (reviewType.id === 'tpcaBestPractices') {
            modalTitle = currentMode === 'flashcards' ? 'Select Critical Area for Flashcards' : 'Select Critical Area';
        } else if (currentMode === 'flashcards') {
            modalTitle = `Select Unit for ${reviewType.name} Flashcards`;
        }
        renderChapterButtons(reviewType.chapters, modalTitle);
        unitSelectionModal.classList.remove('hidden');
    } else {
        if (currentMode === 'quiz') {
            startQuiz(reviewType.id, null);
        } else {
            startFlashcards(reviewType.id, null);
        }
    }
}

function renderChapterButtons(chapters, modalTitle = 'Select Unit') { 
    const modalHeader = unitSelectionModal.querySelector('h2');
    if (modalHeader) {
        modalHeader.textContent = modalTitle;
    }
    chapterButtonsDiv.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.className = 'w-full bg-green-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-sm mb-2';
    
    let allButtonText = 'All Units'; // Default
    if (currentReviewType.id === 'texasConstitutions') {
        allButtonText = 'All Articles';
    } else if (currentReviewType.id === 'texasStatutes') {
        allButtonText = 'All Statute Codes';
    } else if (currentReviewType.id === 'tpcaBestPractices') {
        allButtonText = 'All Critical Areas';
    }
    allButton.textContent = allButtonText;

    allButton.onclick = () => {
        unitSelectionModal.classList.add('hidden');
        if (currentMode === 'quiz') {
            startQuiz(currentReviewType.id, 'all');
        } else {
            startFlashcards(currentReviewType.id, 'all');
        }
    };
    chapterButtonsDiv.appendChild(allButton);

    chapters.forEach(chapter => {
        const button = document.createElement('button');
        button.className = 'w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm';
        button.textContent = chapter.name;
        button.onclick = () => {
            unitSelectionModal.classList.add('hidden');
            if (currentMode === 'quiz') {
                startQuiz(currentReviewType.id, chapter.id);
            } else {
                startFlashcards(currentReviewType.id, chapter.id);
            }
        };
        chapterButtonsDiv.appendChild(button);
    });
}

// --- User Interaction & Flow ---
function handleNameCheck() {
    const nameInput = document.getElementById('officer-name'); // Changed ID from recruit-name
    officerName = nameInput.value; // Renamed from recruitName
    if (officerName.trim() === '') { // Renamed from recruitName
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
     quizContainerDiv.classList.add('hidden');
     flashcardContainerDiv.classList.add('hidden'); // Hide flashcard container
     resultsContainerDiv.innerHTML = ''; // Clear before hiding
     resultsContainerDiv.classList.add('hidden');
     welcomeScreen.classList.remove('hidden');
     mainHeader.classList.remove('hidden');
     document.getElementById('main-page-footer').classList.remove('hidden'); // Show main page footer

     // Ensure correct visibility of button containers on welcome screen
     const modeButtonContainer = document.getElementById('mode-selection-buttons');
     if (modeButtonContainer) modeButtonContainer.classList.remove('hidden'); // Show mode buttons

     const reviewTypeButtonContainer = document.getElementById('review-type-buttons');
     if (reviewTypeButtonContainer) reviewTypeButtonContainer.classList.add('hidden'); // Hide review type buttons initially

     currentReviewType = null; // Reset review type
     currentUnitId = null; // Reset unit ID
     currentMode = 'quiz'; // Reset mode to default

     renderModeSelection(); // Re-render mode selection buttons. This also ensures review-type-buttons are hidden.
}

// --- Quiz Logic ---
async function startQuiz(reviewTypeId, unitId) { // Made async
    mainHeader.classList.remove('hidden');
    document.getElementById('main-page-footer').classList.remove('hidden'); 
    currentUnitId = unitId; 

    const reviewTypeDetails = reviewTypes.find(rt => rt.id === reviewTypeId);
    if (!reviewTypeDetails) return;

    let questionPool = [];
    let quizName = reviewTypeDetails.name;
    const questionLimit = reviewTypeDetails.questionLimit;

    // --- Dynamic Data Fetching ---
    let allReviewDataForType = {}; // To store fetched data
    try {
        const response = await fetch(`data/${reviewTypeId}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allReviewDataForType = await response.json();
    } catch (error) {
        console.error("Error fetching review data:", error);
        // Display an error message to the user or handle appropriately
        questionPool = [{ question: `Error loading questions for ${reviewTypeDetails.name}. Please try again later.`, answer: "OK", options: ["OK"], reference: "N/A" }];
        // Proceed with minimal questions to show the error
        questions = questionPool;
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        scoreSpan.textContent = score;
        quizTitle.textContent = currentChapter ? currentChapter.name : reviewTypeDetails.name;
        totalQuestionsSpan.textContent = questions.length;
        welcomeScreen.classList.add('hidden');
        resultsContainerDiv.innerHTML = '';
        resultsContainerDiv.classList.add('hidden');
        quizContainerDiv.classList.remove('hidden');
        displayQuestion();
        return; // Stop further execution if data fetch fails critically
    }
    // --- End Dynamic Data Fetching ---

    if (reviewTypeDetails.hasUnits) {
        if (unitId === 'all') { 
            currentChapter = { name: `Comprehensive ${reviewTypeDetails.name}`, id: "all" };
            // Check if the fetched data is an object (like generalOrders) or an array (if structure varies)
            if (typeof allReviewDataForType === 'object' && !Array.isArray(allReviewDataForType)) {
                 questionPool = Object.values(allReviewDataForType).flat(); 
            } else if (Array.isArray(allReviewDataForType)) { // Should not happen for unitized data as per new structure
                questionPool = allReviewDataForType; // Fallback, though new structure is { unitId: [], ...}
            } else {
                questionPool = []; // Should not happen
            }
        } else {
            currentChapter = reviewTypeDetails.chapters.find(c => c.id === unitId);
            if (!currentChapter) return;
            quizName = `${reviewTypeDetails.name} - ${currentChapter.name}`;
            // Access questions for the specific unit from the fetched data
            let unitQuestions = allReviewDataForType[unitId];
            if (!unitQuestions || unitQuestions.length === 0) {
                let unitType = 'unit'; // Default
                if (reviewTypeId === 'texasConstitutions') unitType = 'article';
                if (reviewTypeId === 'texasStatutes') unitType = 'statute code';
                if (reviewTypeId === 'tpcaBestPractices') unitType = 'critical area';
                unitQuestions = [{ question: `This ${unitType} has no questions yet. Please check back later.`, answer: "OK", options: ["OK"], reference: "N/A" }];
            }
            questionPool = [...unitQuestions];
        }
    } else { // For TCOLE (which is an array of questions directly)
        currentChapter = { name: reviewTypeDetails.name, id: reviewTypeId }; // No specific sub-unit
        // The fetched data for non-unit types (like TCOLE) should be an array of questions
        questionPool = Array.isArray(allReviewDataForType) ? [...allReviewDataForType] : [];
        if (questionPool.length === 0) {
            questionPool = [{ question: `This section (${reviewTypeDetails.name}) has no questions yet.`, answer: "OK", options: ["OK"], reference: "N/A" }];
        }
    }

    // Shuffle and slice questions
    questions = questionPool.sort(() => Math.random() - 0.5);
    if (questionLimit && questions.length > questionLimit) {
        questions = questions.slice(0, questionLimit);
    }
    
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    scoreSpan.textContent = score;
    quizTitle.textContent = quizName; // Use the determined quizName
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
    questionNumberSpan.textContent = currentQuestionIndex + 1;
    questionTextP.textContent = question.question;
    optionsContainerDiv.innerHTML = '';
    
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'w-full text-left bg-white p-4 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-blue-500 transition-colors';
        button.textContent = option;
        button.onclick = () => selectOption(button, option, question.answer, question.reference);
        optionsContainerDiv.appendChild(button);
    });
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
    feedbackReference.textContent = `Reference: ${reference}`;
    feedbackContainer.classList.remove('hidden');
    
    Array.from(optionsContainerDiv.children).forEach(child => child.classList.add('disabled-option'));
    nextQuestionBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// --- Flashcard Logic ---
async function startFlashcards(reviewTypeId, unitId) {
    mainHeader.classList.remove('hidden');
    document.getElementById('main-page-footer').classList.remove('hidden');
    currentUnitId = unitId;

    const reviewTypeDetails = reviewTypes.find(rt => rt.id === reviewTypeId);
    if (!reviewTypeDetails) return;

    let questionPool = [];
    let flashcardDeckName = reviewTypeDetails.name;

    try {
        const response = await fetch(`data/${reviewTypeId}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const allReviewDataForType = await response.json();

        if (reviewTypeDetails.hasUnits) {
            if (unitId === 'all') {
                currentChapter = { name: `Comprehensive ${reviewTypeDetails.name} Flashcards`, id: "all" };
                flashcardDeckName = currentChapter.name;
                if (typeof allReviewDataForType === 'object' && !Array.isArray(allReviewDataForType)) {
                    questionPool = Object.values(allReviewDataForType).flat();
                } else {
                    questionPool = [];
                }
            } else {
                currentChapter = reviewTypeDetails.chapters.find(c => c.id === unitId);
                if (!currentChapter) return;
                flashcardDeckName = `${reviewTypeDetails.name} Flashcards - ${currentChapter.name}`;
                let unitQuestions = allReviewDataForType[unitId];
                if (!unitQuestions || unitQuestions.length === 0) {
                    let unitType = 'unit';
                    if (reviewTypeId === 'texasConstitutions') unitType = 'article';
                    if (reviewTypeId === 'texasStatutes') unitType = 'statute code';
                    if (reviewTypeId === 'tpcaBestPractices') unitType = 'critical area';
                    unitQuestions = [{ question: `This ${unitType} has no flashcards yet.`, answer: "N/A", options: [], reference: "N/A" }];
                }
                questionPool = [...unitQuestions];
            }
        } else { // For TCOLE (array of questions)
            currentChapter = { name: `${reviewTypeDetails.name} Flashcards`, id: reviewTypeId };
            flashcardDeckName = currentChapter.name;
            questionPool = Array.isArray(allReviewDataForType) ? [...allReviewDataForType] : [];
            if (questionPool.length === 0) {
                questionPool = [{ question: `This section (${reviewTypeDetails.name}) has no flashcards yet.`, answer: "N/A", options: [], reference: "N/A" }];
            }
        }
    } catch (error) {
        console.error("Error fetching flashcard data:", error);
        questionPool = [{ question: `Error loading flashcards for ${reviewTypeDetails.name}. Please try again.`, answer: "Error", options: [], reference: "System Error" }];
    }

    questions = questionPool.sort(() => Math.random() - 0.5); // Shuffle for flashcards too
    currentQuestionIndex = 0;

    flashcardTitle.textContent = flashcardDeckName;
    totalFlashcardsSpan.textContent = questions.length;

    welcomeScreen.classList.add('hidden');
    quizContainerDiv.classList.add('hidden');
    resultsContainerDiv.classList.add('hidden');
    flashcardContainerDiv.classList.remove('hidden');

    displayFlashcard();
}

function displayFlashcard() {
    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
        // Optionally handle end of flashcards (e.g., show a message or loop)
        flashcardQuestionTextP.textContent = "No more cards.";
        flashcardAnswerTextP.textContent = "";
        flashcardReferenceTextP.textContent = "";
        flashcardCard.classList.remove('is-flipped');
        previousFlashcardBtn.disabled = true;
        nextFlashcardBtn.disabled = true;
        return;
    }

    const cardData = questions[currentQuestionIndex];
    flashcardNumberSpan.textContent = currentQuestionIndex + 1;
    flashcardQuestionTextP.textContent = cardData.question;
    flashcardAnswerTextP.textContent = cardData.answer;
    flashcardReferenceTextP.textContent = cardData.reference ? `Reference: ${cardData.reference}` : "";
    flashcardCard.classList.remove('is-flipped');

    previousFlashcardBtn.disabled = currentQuestionIndex === 0;
    nextFlashcardBtn.disabled = currentQuestionIndex === questions.length - 1;
}

function flipFlashcard() {
    flashcardCard.classList.toggle('is-flipped');
}

function nextFlashcard() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayFlashcard();
    }
}

function previousFlashcard() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
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
                <div class="md:col-span-1 officer-info bg-gray-50 p-6 rounded-lg shadow-sm"> <!-- Renamed class -->
                    <h3 class="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">Officer Information</h3> <!-- Renamed text -->
                    <div class="space-y-3">
                        <div><strong class="block text-sm font-medium text-gray-500">Name:</strong> <span class="text-lg text-gray-800">${officerName}</span></div> <!-- Renamed variable -->
                        <div><strong class="block text-sm font-medium text-gray-500">Assessment Type:</strong> <span class="text-lg text-gray-800">${currentReviewType.name}</span></div>
                        ${currentReviewType.hasUnits && currentUnitId !== 'all' ? `<div><strong class="block text-sm font-medium text-gray-500">Unit Tested:</strong> <span class="text-lg text-gray-800">${currentChapter.name.replace(currentReviewType.name + " - ", "")}</span></div>` : ''}
                        ${currentUnitId === 'all' ? `<div><strong class="block text-sm font-medium text-gray-500">Unit Tested:</strong> <span class="text-lg text-gray-800">All Units</span></div>` : ''}
                    </div>
                </div>

                <div class="md:col-span-2 performance-summary">
                    <h3 class="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">Assessment Results</h3>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showResults() {
    quizContainerDiv.classList.add('hidden');
    mainHeader.classList.add('hidden'); // Hide main header on results page
    document.getElementById('main-page-footer').classList.add('hidden'); // Hide main page footer on results page

    const reportHTML = generateReportHTML();
    resultsContainerDiv.innerHTML = reportHTML;
    resultsContainerDiv.classList.remove('hidden');
    document.getElementById('print-area').innerHTML = reportHTML; // Prepare for printing


    // Animate the progress ring
    const circle = document.querySelector('.progress-ring__circle');
    if (circle) {
        // This forces a reflow, which is necessary for the transition to work on the first render
        circle.getBoundingClientRect(); 
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const scorePercentage = questions.length > 0 ? (score / questions.length) : 0;
        const offset = circumference - scorePercentage * circumference;
        circle.style.strokeDashoffset = offset;
    }

    document.getElementById('main-menu-results').addEventListener('click', showWelcomeScreen);
    document.getElementById('print-report-btn').addEventListener('click', () => window.print());
}
