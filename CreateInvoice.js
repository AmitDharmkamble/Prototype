document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    loadSidebar();
    initializeEventHandlers();
    loadServices();
    loadTaxes();
}

function loadSidebar() {
    fetchHTML("./Sidebar.html", "#sidebar-container", executeScriptsInContainer);
}

function fetchHTML(url, containerSelector, callback) {
    const container = document.querySelector(containerSelector);
    fetch(url)
        .then(response => response.ok ? response.text() : Promise.reject("Network response was not ok"))
        .then(html => {
            container.innerHTML = html;
            callback(container);
        })
        .catch(error => console.error("There was a problem with the fetch operation:", error));
}

function executeScriptsInContainer(container) {
    container.querySelectorAll("script").forEach(script => {
        const newScript = document.createElement("script");
        newScript.text = script.innerHTML;
        document.body.appendChild(newScript);
    });
}

function initializeEventHandlers() {
    initializeTableEvents();
    initializeCustomerChangeEvent();
    initializeTaxChangeEvent();
}

function initializeTaxChangeEvent() {
    $('.tax-select').on('change', calculateTotals);
}

function initializeTableEvents() {
    $('table').on('input', 'input[type=number]', calculateTotals);
    $('.btn-add-row').click(addNewRow);
    $('table').on('click', '.remove-row', removeRow);
    $('table .item').each(function () {
        handleRowEvents($(this));
    });
}

function calculateTotals() {
    let total = 0, taxAmount = 0, subtotal = 0;

    $('.item').each(function () {
        const taxPercentage = parseFloat($(this).find('select.tax-select').val()) || 0;
        const quantity = parseFloat($(this).find('input:eq(3)').val()) || 0;
        const price = parseFloat($(this).find('input:eq(2)').val()) || 0;

        subtotal = quantity * price;
        taxAmount += subtotal * (taxPercentage / 100);

        $(this).find('td:eq(4)').text(`₹${subtotal.toFixed(2)}`);
        total += subtotal + taxAmount;
    });

    updateTotalsDisplay(total, taxAmount, subtotal);
}

function updateTotalsDisplay(total, taxAmount, subtotal) {
    $('#total').text(`Total: ₹${total.toFixed(2)}`);
    $('#taxTotal').text(`Tax Total: ₹${taxAmount.toFixed(2)}`);
    $('#basicTotal').text(`Basic Total: ₹${subtotal.toFixed(2)}`);
}

function addNewRow() {
    const newRow = $('.item:first').clone();
    newRow.find('input').val('');
    newRow.find('td:eq(4)').text('');
    newRow.appendTo('table').find(".service-select").SumoSelect('destroy');
    handleRowEvents(newRow);
}

function removeRow() {
    $(this).closest('tr').remove();
    calculateTotals();
}

function handleRowEvents(row) {
    row.find('.tenure-select').off('change').on('change', handleTenureChange);
    row.find('.start-date').off('change').on('change', handleStartDateChange);
}

function handleTenureChange() {
    const tenure = $(this).val();
    const row = $(this).closest('tr');
    const startDateInput = row.find('.start-date');
    const endDateInput = row.find('.end-date');

    if (tenure && tenure !== 'one-time' && tenure !== 'Select Tenure') {
        startDateInput.removeClass('hidden');
        endDateInput.removeClass('hidden');
    } else {
        startDateInput.addClass('hidden');
        endDateInput.addClass('hidden').val('');
    }

    updateEndDate(startDateInput.val(), endDateInput, tenure);
}

function handleStartDateChange() {
    const startDate = new Date(this.value);
    const tenure = $(this).closest('tr').find('.tenure-select').val();
    const endDateInput = $(this).closest('tr').find('.end-date');
    
    updateEndDate(startDate, endDateInput, tenure);
}

function updateEndDate(startDate, endDateInput, tenure) {
    if (isNaN(startDate.getTime())) {
        endDateInput.val('');
        return;
    }

    let endDate = new Date(startDate);
    switch (tenure) {
        case 'monthly': endDate.setMonth(endDate.getMonth() + 1); break;
        case 'quarterly': endDate.setMonth(endDate.getMonth() + 3); break;
        case '6-monthly': endDate.setMonth(endDate.getMonth() + 6); break;
        case 'annually': endDate.setFullYear(endDate.getFullYear() + 1); break;
    }

    endDateInput.val(formatDate(endDate));
}

function initializeCustomerChangeEvent() {
    $('#customer').on('change', function () {
        $('#customerCard').toggle(!!this.value);
    });
}

function formatDate(date) {
    return date.toISOString().slice(0, 10).split('-').reverse().join('-');
}

function loadServices() {
    fetchJSON('./Data/services.json', appendServicesToSelect);
}

function fetchJSON(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(callback)
        .catch(error => console.error('Error fetching data:', error));
}

function appendServicesToSelect(services) {
    const selectElement = $('.service-select').empty();
    
    services.forEach(service => {
        $('<option></option>')
            .val(service.service_id)
            .text(service.service_name)
            .appendTo(selectElement);
    });

    initializeSumoSelect(selectElement, 'Select services');
}

function initializeSumoSelect(selectElement, placeholder) {
    selectElement.SumoSelect({
        placeholder,
        csvDispCount: 3,
        search: true,
        okCancelInMulti: true
    });
}

function showManHours(selectElement) {
    const row = selectElement.closest('tr');
    const manHoursField = row.querySelector('.man-hours');
    
    if (manHoursField) {
        manHoursField.classList.toggle('hidden', selectElement.value != 9);
    }
}

function loadTaxes() {
    fetchJSON('./Data/Taxes.json', appendTaxesToSelect);
}

function appendTaxesToSelect(taxes) {
    const taxSelect = $('.tax-select').empty();
    $('<option disabled selected>Select tax</option>').appendTo(taxSelect);
    
    taxes.forEach(tax => {
        $('<option></option>')
            .val(tax.tax_percentage)
            .text(`${tax.tax_name}@${tax.tax_percentage}%`)
            .appendTo(taxSelect);
    });

    initializeSumoSelect(taxSelect, 'Select tax');
}

$('.words span').each((index, span) => {
    span.style.animationDelay = `${0.5 * (index + 1)}s`;
});

initializeSumoSelect($('#customer'), 'Select customer');
initializeSumoSelect($('.tenure-select'), 'Select Tenure');
initializeSumoSelect($('#poNumber'), 'Select PO Number');
initializeSumoSelect($('#soldBy'), 'Select Sold By');
