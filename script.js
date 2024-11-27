const addButton = document.getElementById('add-button');
const viewAllButton = document.getElementById('view-all-button');
const popup = document.getElementById('popup');
const solutionPopup = document.getElementById('solution-popup');
const viewPopup = document.getElementById('view-popup');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');
const saveSolutionButton = document.getElementById('save-solution-button');
const closeSolutionButton = document.getElementById('close-solution-button');
const closeViewButton = document.getElementById('close-view-button');
const solutionImageInput = document.getElementById('solution-image');
const deleteSolutionButton = document.getElementById('delete-solution-button');
const imagePreview = document.getElementById('image-preview');
const noImageText = document.getElementById('no-image-text');
const homeworkContent = document.getElementById('homework-content');
const solutionText = document.getElementById('solution-text');
const homeworkTextInput = document.getElementById('homework-text');
const subjectSelect = document.getElementById('subject');
const dueDateInput = document.getElementById('due-date');
const homeworkList = document.getElementById('homework-list');

let homeworkData = [];
let currentIndex = -1;

addButton.addEventListener('click', () => {
    popup.classList.remove('hidden');
});

cancelButton.addEventListener('click', () => {
    popup.classList.add('hidden');
});

viewAllButton.addEventListener('click', () => {
    updateHomeworkList();
    viewPopup.classList.remove('hidden');
});

closeViewButton.addEventListener('click', () => {
    viewPopup.classList.add('hidden');
});

solutionImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            noImageText.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

saveButton.addEventListener('click', () => {
    const text = homeworkTextInput.value.trim();
    const subject = subjectSelect.value;
    const dueDate = dueDateInput.value;

    if (!text || !dueDate) {
        alert('Bitte alle Felder ausfüllen!');
        return;
    }

    homeworkData.push({ text, subject, dueDate, solution: null });
    currentIndex = homeworkData.length - 1;
    updateHomeworkDisplay();
    popup.classList.add('hidden');
});

saveSolutionButton.addEventListener('click', () => {
    const solutionTextValue = solutionText.value.trim();
    const solutionImageValue = imagePreview.src || null;

    if (currentIndex >= 0) {
        homeworkData[currentIndex].solution = {
            text: solutionTextValue,
            image: solutionImageValue,
        };

        solutionPopup.classList.add('hidden');
        alert('Lösung gespeichert!');
    }
});

deleteSolutionButton.addEventListener('click', () => {
    if (currentIndex >= 0) {
        homeworkData[currentIndex].solution = null;
        alert('Lösung gelöscht!');
        solutionPopup.classList.add('hidden');
    }
});

closeSolutionButton.addEventListener('click', () => {
    solutionPopup.classList.add('hidden');
});

function updateHomeworkDisplay() {
    if (homeworkData.length === 0) {
        homeworkContent.innerHTML = "Bisher noch nichts hinzugefügt";
        return;
    }

    const homework = homeworkData[currentIndex];
    const solution = homework.solution;

    homeworkContent.innerHTML = `
        <p>${homework.text}</p>
        <small>Fach: ${homework.subject}</small>
        <small>Fällig am: ${homework.dueDate}</small>
        <button class="solution-button">Lösung ansehen oder hinzufügen</button>
    `;

    document.querySelector('.solution-button').addEventListener('click', () => {
        solutionText.value = solution ? solution.text : '';
        if (solution && solution.image) {
            imagePreview.src = solution.image;
            imagePreview.classList.remove('hidden');
            noImageText.style.display = 'none';
        } else {
            imagePreview.src = '';
            imagePreview.classList.add('hidden');
            noImageText.style.display = 'block';
        }

        solutionPopup.classList.remove('hidden');
    });
}

function updateHomeworkList() {
    homeworkList.innerHTML = homeworkData.map((hw, index) => `
        <li>
            <p><strong>${hw.text}</strong></p>
            <p>Fach: ${hw.subject}</p>
            <p>Fällig: ${hw.dueDate}</p>
            <button class="edit-button" onclick="editHomework(${index})">Bearbeiten</button>
            <button class="delete-button" onclick="deleteHomework(${index})">Löschen</button>
        </li>
    `).join('');
}

function editHomework(index) {
    const hw = homeworkData[index];
    homeworkTextInput.value = hw.text;
    subjectSelect.value = hw.subject;
    dueDateInput.value = hw.dueDate;
    popup.classList.remove('hidden');
    homeworkData.splice(index, 1);
}

function deleteHomework(index) {
    homeworkData.splice(index, 1);
    updateHomeworkList();
    updateHomeworkDisplay();
}

updateHomeworkDisplay();
