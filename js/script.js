// Main application logic for the Denton PD Review App

// --- App State ---
let currentChapter = null;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = [];
let recruitName = '';

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
const emailModal = document.getElementById('email-modal');

// --- Data ---
const chaptersData = [
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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', init);

function init() {
    document.getElementById('start-single-unit').addEventListener('click', showUnitSelection);
    document.getElementById('start-all-units').addEventListener('click', startAllUnitsQuiz);
    document.getElementById('close-modal').addEventListener('click', () => unitSelectionModal.classList.add('hidden'));
    document.getElementById('main-menu-quiz').addEventListener('click', showWelcomeScreen);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    document.getElementById('send-email-btn').addEventListener('click', sendEmail);
    document.getElementById('cancel-email-btn').addEventListener('click', () => emailModal.classList.add('hidden'));
    renderChapterButtons();
    // Hide containers that shouldn't be visible on load
    quizContainerDiv.classList.add('hidden');
    resultsContainerDiv.classList.add('hidden');
}

// --- UI Rendering ---
function renderChapterButtons() {
    chapterButtonsDiv.innerHTML = '';
    chaptersData.forEach(chapter => {
        const button = document.createElement('button');
        button.className = 'w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm';
        button.textContent = chapter.name;
        button.onclick = () => {
            unitSelectionModal.classList.add('hidden');
            startQuiz(chapter.id);
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

function showUnitSelection() {
    if (handleNameCheck()) {
        unitSelectionModal.classList.remove('hidden');
    }
}

function showWelcomeScreen() {
     quizContainerDiv.classList.add('hidden');
     resultsContainerDiv.innerHTML = '';
     resultsContainerDiv.classList.add('hidden');
     welcomeScreen.classList.remove('hidden');
     mainHeader.classList.remove('hidden');
}

function startAllUnitsQuiz() {
    if (handleNameCheck()) {
        startQuiz('all');
    }
}

// --- Quiz Logic ---
function startQuiz(unitId) {
    mainHeader.classList.remove('hidden');

    if (unitId === 'all') {
        currentChapter = { name: "Comprehensive Review (All Units)", id: "all" };
        questions = Object.values(allQuestions).flat().sort(() => Math.random() - 0.5);
    } else {
        currentChapter = chaptersData.find(c => c.id === unitId);
        if (!currentChapter) return;
        
        let questionSet = allQuestions[unitId];
        // Ensure placeholder is not used, provide a default if empty
        if (!questionSet || questionSet.length === 0) {
            questionSet = [{ question: "This unit has no questions yet. Please check back later.", answer: "OK", options: ["OK"], reference: "N/A" }];
        }

        if (unitId === 'unitSample') {
            questions = [...questionSet];
        } else {
            questions = [...questionSet].sort(() => Math.random() - 0.5).slice(0, 100);
        }
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
        return '<p>Excellent work! No specific areas for review based on this perfect score. Continue to stay familiar with all General Orders.</p>';
    }
    
    const topics = {};
    incorrectAnswers.forEach(ans => {
        if (ans.reference === 'N/A') return;
        const chapter = ans.reference.split(' ')[0].replace('GO', 'Chapter');
        if(topics[chapter]){
            topics[chapter]++;
        } else {
            topics[chapter] = 1;
        }
    });

    if (Object.keys(topics).length === 0) {
         return '<p>Good effort. Please review the sample material again.</p>';
    }

    let recommendations = '<p class="mb-4">Based on your results, it is recommended to focus your review on the following areas:</p><ul class="list-disc list-inside space-y-2">';
    for(const topic in topics) {
        recommendations += `<li><strong>${topic}:</strong> You missed ${topics[topic]} question(s) in this area. A thorough review of this chapter in the General Orders is advised.</li>`;
    }
    recommendations += '</ul>';
    return recommendations;
}

function generateReportHTML() {
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100) : 0;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const recommendations = getRecommendations();

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return `
        <div class="bg-white p-8 rounded-lg shadow-2xl">
            <div id="report-header" class="text-center border-b-2 border-gray-200 pb-6 mb-6">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAC8VBMVEX///8BAQEAAAABAADV1dUA//8AgIAAAIAAgAD//wD5+fnr6+x+fn729vbw8PBoaGhvb283Nzevr68/Pz/Z2dnOzs7i4uLg4ODc3Nzw8PD09PTs7OxSUlIICAgMDAxMTEwzMzOIiIigoKA5OTkREREgICB7e3vc3NzExMTf39+goKCRkZFmZmb5+fkAABoAACoAADkAAD0AAEUAAGYAAGsAAG4AAHAAAHEAAHIAAHMAAHQAAHUAAGoAAFYAAEMAAEAACgD27eEAAAD48ucAACz69O4AADIABRMAAAD28vIAAAIAAwQAARgAASEAAigAASsAAS4ABSsADzAAADwAE0EAFUIAFWUAF2gAGGoAGmwAG3AAHHIAHHIACgD37+YAADL49OgAACf79/AAADUAARUAABwAASIAAikAASwABSsAEC8AETMADzUAADsAD0QAEEIAE0QAFEYAEkcAFkgAFIgAFYwAFZEAFpIAFpcAFpkAFpoAFpsAFpwAF5wAF50AF54AF58AF6AAHHIACgD59eoAACb7+PIAADYAAhUAABwAASQAASgAASsAAS8AEC8AEjEAETMADzMADzcADjsAD0AAD0EAEUIAE0QAFEYAF0gAF4sAFZEAFpUAFpgAFpoAFpsAFpwAF5sAF5wAF50AF54AF58AF6AAGHIACgD59ecAACX7+PMAADYAARQAABwAASQAASgAASwAEjEAETMADzQADjcADjsAD0EAEkQAFEYAFkgAFokAFYwAFZEAFpIAFpcAFpgAFpoAFpsAFpwAF5sAF5wAF50AF54AF58AF6AAGXIACgD59+oAACX7+fEAADcAARQAAB0AASQAAScAASgAASwADysAEjAAETEAEDMADzMADzQADjcADjsADkEAEUIAEkMAFEUAFEcAFkgAFokAFYwAFZEAFpIAFpcAFpgAFpoAFpsAFpwAF5sAF5wAF50AF54AF58AF6AAGXMACgD6+PIAADUAARcAAB4AASUAASgADSkAESsADi4AEzAAEDEAETEAEDMADzMADzQADjcADjsADkEAEUIAEkMAFEUAFEcAFkgAFokAFYwAFZEAFpIAFpcAFpgAFpoAFpsAFpwAF5sAF5wAF50AF54AF58AF6AAGXMABgD69/UAADUAARUAAB0AASQAAScADSkAEisADi4AEzAADzAAEDEAETEAEDMADzMADzQADjcADjsADkEAEUIAEkMAFEUAFEcAFkgAFokAFYwAFZEAFpIAFpcAFpgAFpoAFpsAFpwAF5sAF5wAF50AF54AF58AF6AAGXMAAwD79vQAADUAARUAAB0AASQAAScADSkAEisADi4AEzAADzAAEDEAETEAEDMADzMADzQADjcADjsADkEAEUIAEkMAFEUAFEcAFkgAFokAFYwAFZEAFpIAFpcAFpgAFpoAFpsAFpwAF5sAF5wAF50AF54AF58AF6AAGnM=" alt="Denton PD Logo" class="mx-auto mb-3 rounded-full h-20 w-20">
                <h2 class="text-3xl font-bold text-gray-800">Performance Review</h2>
                <p class="text-md text-gray-500">Denton Police Department General Orders</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="text-center p-6">
                    <h3 class="text-xl font-semibold mb-4 text-gray-700">Overall Performance</h3>
                     <svg class="w-48 h-48 mx-auto" viewBox="0 0 140 140">
                        <circle class="text-gray-200" stroke-width="12" stroke="currentColor" fill="transparent" r="${radius}" cx="70" cy="70" />
                        <circle class="progress-ring__circle text-blue-600" stroke-width="12" stroke-dasharray="${circumference} ${circumference}" style="stroke-dashoffset:${offset}" stroke-linecap="round" stroke="currentColor" fill="transparent" r="${radius}" cx="70" cy="70" />
                        <text x="50%" y="50%" text-anchor="middle" stroke="#1E40AF" stroke-width="0.5px" dy=".3em" class="text-4xl font-bold fill-current text-blue-800">${percentage.toFixed(0)}%</text>
                    </svg>
                </div>
                <div class="space-y-4">
                     <div><strong class="block text-sm font-medium text-gray-500">Recruit Name:</strong> <span class="text-lg font-semibold text-gray-800">${recruitName}</span></div>
                     <div><strong class="block text-sm font-medium text-gray-500">Assessment Date:</strong> <span class="text-lg font-semibold text-gray-800">${date}</span></div>
                     <div><strong class="block text-sm font-medium text-gray-500">Unit(s) Tested:</strong> <span class="text-lg font-semibold text-gray-800">${currentChapter.name}</span></div>
                     <div class="flex pt-2 gap-4">
                        <div class="text-center bg-green-100 text-green-800 p-3 rounded-lg flex-1">
                            <p class="text-3xl font-bold">${score}</p>
                            <p class="text-sm">Correct</p>
                        </div>
                        <div class="text-center bg-red-100 text-red-800 p-3 rounded-lg flex-1">
                            <p class="text-3xl font-bold">${totalQuestions - score}</p>
                            <p class="text-sm">Incorrect</p>
                        </div>
                     </div>
                </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-200">
                <h3 class="text-xl font-semibold mb-3">Recommendations for Review</h3>
                <div class="text-gray-700 bg-gray-50 p-4 rounded-lg">${recommendations}</div>
            </div>
            
            <div class="mt-10 pt-10 border-t-2 border-dashed border-gray-300 print-only">
                 <div class="grid grid-cols-2 gap-8">
                    <div>
                        <p class="text-gray-700">Recruit Signature:</p>
                        <div class="mt-8 border-b border-gray-400"></div>
                    </div>
                    <div>
                        <p class="text-gray-700">Supervisor Signature:</p>
                        <div class="mt-8 border-b border-gray-400"></div>
                    </div>
                 </div>
                 <p class="text-center text-xs text-gray-500 mt-6">Official Training Report</p>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-200 no-print">
                <div class="flex justify-center gap-4">
                    <button id="print-report-btn" class="flex items-center gap-2 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Print Report
                    </button>
                    <button id="email-report-btn" class="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        Email to Supervisor
                    </button>
                     <button id="main-menu-results" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-base">Main Menu</button>
                </div>
            </div>
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

    document.getElementById('email-report-btn').addEventListener('click', () => emailModal.classList.remove('hidden'));
    document.getElementById('main-menu-results').addEventListener('click', showWelcomeScreen);
    document.getElementById('print-report-btn').addEventListener('click', () => window.print());
}

function sendEmail() {
    const supervisorEmail = document.getElementById('supervisor-email').value;
    if(!supervisorEmail) {
         const emailInput = document.getElementById('supervisor-email');
         emailInput.classList.add('border-red-500', 'ring-red-500');
         emailInput.placeholder = 'Supervisor email is required!';
         setTimeout(()=> {
             emailInput.classList.remove('border-red-500', 'ring-red-500');
             emailInput.placeholder = 'supervisor@dentonpd.com';
         }, 2500);
        return;
    }
    const subject = `Performance Review for ${recruitName}`;
    
    // Generate a simplified HTML for the email body
    const emailBody = `
        <html><body>
        <h2 style="font-family: sans-serif; color: #333;">Denton PD General Orders - Performance Review</h2>
        <hr>
        <p><strong>Recruit:</strong> ${recruitName}</p>
        <p><strong>Assessment:</strong> ${currentChapter.name}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <h3>Score: ${score} / ${questions.length} (${((score / questions.length) * 100).toFixed(1)}%)</h3>
        <hr>
        <h3>Recommendations for Review:</h3>
        ${getRecommendations()}
        <hr>
        <p><em>This is an automated report from the DPD Interactive Review System.</em></p>
        </body></html>
    `;
    
    const mailtoLink = `mailto:${supervisorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    emailModal.classList.add('hidden');
}
    </script>
</body>
</html>
