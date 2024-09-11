document.addEventListener("DOMContentLoaded", () => {
    loadSidebar();
    initializeEventHandlers();
    loadServices();
    loadTaxes();
});

function loadSidebar() {
    const sidebarContainer = document.getElementById("sidebar-container");
    fetch("./Sidebar.html")
        .then(handleFetchResponse)
        .then(html => {
            sidebarContainer.innerHTML = html;
            executeScriptsInContainer(sidebarContainer);
        })
        .catch(handleFetchError);
}

function handleFetchResponse(response) {
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.text();
}

function executeScriptsInContainer(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach(script => {
        const newScript = document.createElement("script");
        newScript.text = script.innerHTML;
        document.body.appendChild(newScript);
    });
}

function handleFetchError(error) {
    console.error("There was a problem with the fetch operation:", error);
}

function initializeEventHandlers() {
    // Initialize calculation and dynamic row events
    initializeTableEvents();
    initializeCustomerChangeEvent();
    initializeTaxChangeEvent();
}

function initializeTaxChangeEvent() {
    document.querySelectorAll('.tax-select').forEach(function (select) {
        select.addEventListener('change', function () {
            calculateTotals();
        });
    });
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
    let total = 0;
    let taxAmount = 0;
    let subtotal = 0;
    
    $('.item').each(function () {
        const taxValue = $(this).find('select.tax-select').val();
        const taxPercentage = parseFloat(taxValue) || 0;
        const quantity = $(this).find('input:eq(1)').val();
        const price = $(this).find('input:eq(0)').val();
        
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
    newRow.appendTo('table');
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
    const tenureSelect = $(this);
    const startDateInput = tenureSelect.closest('tr').find('.start-date');
    const endDateInput = tenureSelect.closest('tr').find('.end-date');
    const tenure = tenureSelect.val();
    
    if (tenure && tenure !== 'one-time' && tenure !== 'Select Tenure') {
        startDateInput.removeClass('hidden');
        endDateInput.removeClass('hidden');
    } else {
        startDateInput.addClass('hidden');
        endDateInput.addClass('hidden').val('');
        return;
    }
    
    updateEndDate(startDateInput, endDateInput, tenure);
}

function handleStartDateChange() {
    const startDate = new Date(this.value);
    const tenureSelect = $(this).closest('tr').find('.tenure-select');
    const endDateInput = $(this).closest('tr').find('.end-date');
    const tenure = tenureSelect.val();
    
    updateEndDate(startDate, endDateInput, tenure);
}

function updateEndDate(startDateInput, endDateInput, tenure) {
    const startDate = new Date(startDateInput);
    if (isNaN(startDate.getTime())) {
        endDateInput.val('');
        return;
    }
    
    let endDate = new Date(startDate);
    switch (tenure) {
        case 'monthly':
            endDate.setMonth(endDate.getMonth() + 1);
            break;
        case 'quarterly':
            endDate.setMonth(endDate.getMonth() + 3);
            break;
        case '6-monthly':
            endDate.setMonth(endDate.getMonth() + 6);
            break;
        case 'annually':
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
    }
    
    endDateInput.val(formatDate(endDate));
}

function initializeCustomerChangeEvent() {
    document.getElementById('customer').addEventListener('change', function () {
        const card = document.getElementById('customerCard');
        card.style.display = this.value ? 'block' : 'none';
    });
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function loadServices() {
    fetch('./Data/services.json')
        .then(response => response.json())
        .then(appendServicesToSelect)
        .catch(error => console.error('Error fetching services:', error));
}

function appendServicesToSelect(data) {
    const selectElement = document.querySelector('.service-select');
    data.forEach(service => {
        const option = document.createElement('option');
        option.value = service.service_id;
        option.text = service.service_name;
        selectElement.appendChild(option);
    });
}

function showManHours(selectElement) {
    const selectedService = selectElement.value;
    const row = selectElement.closest('tr');
    const manHoursField = row.querySelector('.man-hours');
    
    if (manHoursField) {
        manHoursField.classList.toggle('hidden', selectedService != 9);
    }
}

function loadTaxes() {
    fetch('./Data/Taxes.json')
        .then(response => response.json())
        .then(appendTaxesToSelect)
        .catch(error => console.error('Error loading taxes:', error));
}

function appendTaxesToSelect(taxes) {
    const taxSelect = document.querySelector('.tax-select');
    taxSelect.innerHTML = '<option disabled selected>Select tax</option>';
    
    taxes.forEach(tax => {
        const option = document.createElement('option');
        option.value = tax.tax_percentage;
        option.textContent = `${tax.tax_name}@${tax.tax_percentage}%`;
        taxSelect.appendChild(option);
    });
}
