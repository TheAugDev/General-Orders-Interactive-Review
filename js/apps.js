// Main application logic for the Denton PD Review App

// --- App State ---
let currentChapter = null;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = [];
let recruitName = '';
let currentReviewType = null; // To store 'generalOrders', 'tcole', etc.
let currentUnitId = null; // To store specific unitId if applicable

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
    { name: "Unit 15: Off-Duty Conduct & Secondary Employment", id: "unit15" },
    { name: "Unit 16: Health & Wellness", id: "unit16" }
];

const reviewTypes = [
    { id: 'generalOrders', name: 'General Orders', hasUnits: true, chapters: generalOrderChapters, questionLimit: 100 },
    { id: 'tcole', name: 'TCOLE Review', hasUnits: false, questionLimit: 250 },
    { id: 'texasConstitutions', name: 'Texas Constitutions', hasUnits: false, questionLimit: 100 }, // Example limit
    { id: 'texasStatutes', name: 'Texas Statutes', hasUnits: false, questionLimit: 100 } // Example limit
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', init);

function init() {
    // document.getElementById('start-single-unit').addEventListener('click', showUnitSelection);
    // document.getElementById('start-all-units').addEventListener('click', startAllUnitsQuiz);
    document.getElementById('close-modal').addEventListener('click', () => unitSelectionModal.classList.add('hidden'));
    document.getElementById('main-menu-quiz').addEventListener('click', showWelcomeScreen);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    // renderChapterButtons(); // This will be called after review type selection
    renderReviewTypeSelection(); // New function to show review type buttons
    // Hide containers that shouldn't be visible on load
    quizContainerDiv.classList.add('hidden');
    resultsContainerDiv.classList.add('hidden');
}

// --- UI Rendering ---
function renderReviewTypeSelection() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const existingButtons = welcomeScreen.querySelector('#review-type-buttons');
    if (existingButtons) existingButtons.remove(); // Remove if already exists to prevent duplication

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'review-type-buttons';
    buttonContainer.className = 'flex flex-col sm:flex-row justify-center gap-4 mt-6';

    reviewTypes.forEach(type => {
        const button = document.createElement('button');
        button.className = 'bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg';
        button.textContent = type.name;
        button.onclick = () => selectReviewType(type);
        buttonContainer.appendChild(button);
    });
    // Insert after the name input, before existing buttons if any, or append
    const nameInput = document.getElementById('recruit-name');
    nameInput.insertAdjacentElement('afterend', buttonContainer);

    // Hide old buttons if they exist (or repurpose them)
    const oldSingleUnitBtn = document.getElementById('start-single-unit');
    const oldAllUnitsBtn = document.getElementById('start-all-units');
    if(oldSingleUnitBtn) oldSingleUnitBtn.classList.add('hidden');
    if(oldAllUnitsBtn) oldAllUnitsBtn.classList.add('hidden');
}

function selectReviewType(reviewType) {
    if (!handleNameCheck()) return;

    currentReviewType = reviewType;
    if (reviewType.hasUnits) {
        renderChapterButtons(reviewType.chapters);
        unitSelectionModal.classList.remove('hidden');
    } else {
        startQuiz(reviewType.id, null); // No unitId for non-unit based reviews
    }
}

function renderChapterButtons(chapters) {
    chapterButtonsDiv.innerHTML = '';
    chapters.forEach(chapter => {
        const button = document.createElement('button');
        button.className = 'w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm';
        button.textContent = chapter.name;
        button.onclick = () => {
            unitSelectionModal.classList.add('hidden');
            startQuiz(currentReviewType.id, chapter.id);
        };
        chapterButtonsDiv.appendChild(button);
    });
}

// --- User Interaction & Flow ---
function handleNameCheck() {
    const nameInput = document.getElementById('recruit-name');
    recruitName = nameInput.value;
    if (recruitName.trim() === '') {
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
     resultsContainerDiv.innerHTML = '';
     resultsContainerDiv.classList.add('hidden');
     welcomeScreen.classList.remove('hidden');
     mainHeader.classList.remove('hidden');
     currentReviewType = null; // Reset review type
     currentUnitId = null; // Reset unit ID
     renderReviewTypeSelection(); // Re-render review type buttons
}

// --- Quiz Logic ---
function startQuiz(reviewTypeId, unitId) { // unitId can be null
    mainHeader.classList.remove('hidden');
    currentUnitId = unitId; // Store the unitId

    const reviewTypeDetails = reviewTypes.find(rt => rt.id === reviewTypeId);
    if (!reviewTypeDetails) return;

    let questionPool = [];
    let quizName = reviewTypeDetails.name;
    const questionLimit = reviewTypeDetails.questionLimit;

    if (reviewTypeDetails.hasUnits) {
        if (unitId === 'all') { // Comprehensive for General Orders
            currentChapter = { name: `Comprehensive ${reviewTypeDetails.name}`, id: "all" };
            questionPool = Object.values(allReviewData[reviewTypeId]).flat();
        } else {
            currentChapter = reviewTypeDetails.chapters.find(c => c.id === unitId);
            if (!currentChapter) return;
            quizName = `${reviewTypeDetails.name} - ${currentChapter.name}`;
            let unitQuestions = allReviewData[reviewTypeId][unitId];
            if (!unitQuestions || unitQuestions.length === 0) {
                unitQuestions = [{ question: "This unit has no questions yet. Please check back later.", answer: "OK", options: ["OK"], reference: "N/A" }];
            }
            questionPool = [...unitQuestions];
        }
    } else { // For TCOLE, Texas Constitutions, Texas Statutes
        currentChapter = { name: reviewTypeDetails.name, id: reviewTypeId }; // No specific sub-unit
        questionPool = allReviewData[reviewTypeId] ? [...allReviewData[reviewTypeId]] : [];
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
    quizTitle.textContent = currentChapter.name;
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
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
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
        // Recommendation logic might need to be adjusted based on review type
        // For General Orders, chapter is fine. For others, it might be different.
        let topicKey = ans.reference;
        if (currentReviewType && currentReviewType.id === 'generalOrders') {
            topicKey = ans.reference.split(' ')[0].replace('GO', 'Chapter');
        }
        // For TCOLE or other types, the reference itself might be the topic
        // Or you might need a more sophisticated way to group recommendations

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
                <div class="md:col-span-1 recruit-info bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 class="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">Recruit Information</h3>
                    <div class="space-y-3">
                        <div><strong class="block text-sm font-medium text-gray-500">Name:</strong> <span class="text-lg text-gray-800">${recruitName}</span></div>
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
                        <p class="text-gray-600 text-sm">Recruit Signature:</p>
                        <div class="mt-12 border-b-2 border-gray-500"></div>
                    </div>
                    <div class="signature-line">
                        <p class="text-gray-600 text-sm">Supervisor Signature:</p>
                        <div class="mt-12 border-b-2 border-gray-500"></div>
                    </div>
                 </div>
                 <p class="text-center text-sm text-gray-600 mt-10"><em>Official Training Report - Denton Police Department</em></p>
            </section>

            <footer class="report-footer mt-10 pt-8 border-t border-gray-300 no-print">
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
                <div class="mt-6 text-center text-sm text-gray-500">
                    <p>&copy; ${new Date().getFullYear()} Denton Police Department. All Rights Reserved.</p>
                    <p>Developed by <a href="https://theaugdev.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline">TheAugDev.com</a></p>
                </div>
            </footer>
        </div>
    `;
}

function showResults() {
    quizContainerDiv.classList.add('hidden');
    mainHeader.classList.add('hidden'); // Hide main header on results page
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
