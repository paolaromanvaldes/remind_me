// Sample Reminder Class
class Reminder {
    constructor(description, date = null, hour = null, minute = null, isUrgent = false) {
        if (date) {
            const [year, month, day] = date.split('-');
            // Default hour and minute to 00:00 if not provided
            this.date = new Date(year, month - 1, day, hour || 0, minute || 0);
        } else {
            this.date = null;  // No date provided
        }
        this.description = description;
        this.isUrgent = isUrgent;
    }
}

// Array to store reminders
let reminders = [];

// Function to add a reminder
function addReminder(description, date = null, hour = null, minute = null, isUrgent = false) {
    const newReminder = new Reminder(description, date, hour, minute, isUrgent);
    reminders.push(newReminder);
    sortReminders();
    displayReminders();
}

// Function to sort reminders: Urgent ones first, then by date (if provided)
function sortReminders() {
    reminders.sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        if (!a.date && b.date) return 1;
        if (a.date && !b.date) return -1;
        return a.date - b.date;
    });
}

// Function to display reminders
function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';  // Clear the list

    reminders.forEach((reminder) => {
        let displayText = `${reminder.description}`;
        if (reminder.date) {
            const options = reminder.date.getHours() === 0 && reminder.date.getMinutes() === 0
                ? { year: 'numeric', month: 'long', day: 'numeric' }
                : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            displayText += ` - ${reminder.date.toLocaleString(undefined, options)}`;
        }
        displayText += reminder.isUrgent ? ' (Urgent)' : '';
        const listItem = document.createElement('li');
        listItem.textContent = displayText;
        reminderList.appendChild(listItem);
    });
}

// Function to check for expired reminders
function checkExpiredReminders() {
    const now = new Date();
    reminders = reminders.filter(reminder => !reminder.date || reminder.date > now);
    displayReminders();
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value || null;
    const hour = document.getElementById('hour').value || null;
    const minute = document.getElementById('minute').value || null;
    const isUrgent = document.getElementById('isUrgent').checked;

    if (description) {
        addReminder(description, date, hour, minute, isUrgent);
    }
}

// Function to download reminders as an image
function downloadAsImage() {
    const reminderList = document.getElementById('reminderList');
    html2canvas(reminderList).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'reminders.png';
        link.click();
    });
}

// Function to download reminders as a spreadsheet
function downloadAsSpreadsheet() {
    const worksheet = XLSX.utils.json_to_sheet(reminders.map(reminder => ({
        Description: reminder.description,
        Date: reminder.date ? reminder.date.toLocaleString() : 'No Date',
        Urgency: reminder.isUrgent ? 'Urgent' : 'Normal'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reminders');
    XLSX.writeFile(workbook, 'reminders.xlsx');
}

// Event listener for the form submission
document.getElementById('reminderForm').addEventListener('submit', handleFormSubmit);

// Event listeners for download buttons
document.getElementById('downloadImage').addEventListener('click', downloadAsImage);
document.getElementById('downloadSpreadsheet').addEventListener('click', downloadAsSpreadsheet);

// Regularly check for expired reminders every minute
setInterval(checkExpiredReminders, 60000); // Check every 60 seconds
