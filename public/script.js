// Auto-set today's date if empty
const dateInput = document.querySelector('input[type="date"]');
if (dateInput && !dateInput.value) {
  dateInput.value = new Date().toISOString().split('T')[0];
}
