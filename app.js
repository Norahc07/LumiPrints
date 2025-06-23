// --- Data Storage ---
let services = [];
let sales = [];
let deductions = [];
let allDeductions = [];
let pendingSales = [];

// --- DOM Elements ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const dashboardFilter = document.getElementById('dashboardFilter');
const dashboardIncome = document.getElementById('dashboardIncome');
const dashboardCustomers = document.getElementById('dashboardCustomers');
const dashboardServices = document.getElementById('dashboardServices');
const dashboardDeductions = document.getElementById('dashboardDeductions');
const dashboardPrintingTable = document.getElementById('dashboardPrintingTable');
const dashboardLayoutTable = document.getElementById('dashboardLayoutTable');
const salesForm = document.getElementById('salesForm');
const saleDate = document.getElementById('saleDate');
const saleCustomer = document.getElementById('saleCustomer');
<<<<<<< HEAD
const saleCategory = document.getElementById('saleCategory');
const saleService = document.getElementById('saleService');
const saleQuantity = document.getElementById('saleQuantity');
const saleUnitPrice = document.getElementById('saleUnitPrice');
const addServiceToCustomerBtn = document.getElementById('addServiceToCustomer');
const pendingSalesTable = document.getElementById('pendingSalesTable');
const pendingSalesTotal = document.getElementById('pendingSalesTotal');
const submitSalesForCustomerBtn = document.getElementById('submitSalesForCustomer');
=======
const saleService = document.getElementById('saleService');
const saleQuantity = document.getElementById('saleQuantity');
const saleUnitPrice = document.getElementById('saleUnitPrice');
const salesTable = document.getElementById('salesTable');
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
const serviceForm = document.getElementById('serviceForm');
const serviceName = document.getElementById('serviceName');
const serviceCategory = document.getElementById('serviceCategory');
const serviceUnit = document.getElementById('serviceUnit');
const servicePrice = document.getElementById('servicePrice');
<<<<<<< HEAD
const printingServicesTable = document.getElementById('printingServicesTable');
const layoutServicesTable = document.getElementById('layoutServicesTable');
=======
const servicesTable = document.getElementById('servicesTable');
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
const deductionForm = document.getElementById('deductionForm');
const deductionDate = document.getElementById('deductionDate');
const deductionDesc = document.getElementById('deductionDesc');
const deductionAmount = document.getElementById('deductionAmount');
const deductionsTable = document.getElementById('deductionsTable');
<<<<<<< HEAD
const deductionIncomeBalance = document.getElementById('deductionIncomeBalance');
const salesTable = document.getElementById('salesTable');
const resetDataBtn = document.getElementById('resetDataBtn');
const servicePaperSize = document.getElementById('servicePaperSize');
=======
const saleCategory = document.getElementById('saleCategory');
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5

// --- Tab Navigation ---
tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.add('hidden'));
        this.classList.add('active');
        document.getElementById('tab-' + this.dataset.tab).classList.remove('hidden');
        if (this.dataset.tab === 'dashboard') renderDashboard();
<<<<<<< HEAD
        if (this.dataset.tab === 'deductions') updateDeductionBalance();
=======
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
    });
});

// --- Local Storage ---
function saveAll() {
    localStorage.setItem('services', JSON.stringify(services));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('deductions', JSON.stringify(deductions));
    localStorage.setItem('allDeductions', JSON.stringify(allDeductions));
}
function loadAll() {
    services = JSON.parse(localStorage.getItem('services') || '[]');
    sales = JSON.parse(localStorage.getItem('sales') || '[]');
    deductions = JSON.parse(localStorage.getItem('deductions') || '[]');
    allDeductions = JSON.parse(localStorage.getItem('allDeductions') || '[]');
}

// --- Dashboard ---
function renderDashboard() {
    const filter = dashboardFilter.value;
    const now = new Date();
    let start, end;
    if (filter === 'week') {
        const day = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - day);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
    } else if (filter === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (filter === 'year') {
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
    } else {
        start = new Date(0);
        end = new Date(3000, 0, 1);
    }
    // Filter sales and deductions
    const filteredSales = sales.filter(s => {
        const d = new Date(s.date);
<<<<<<< HEAD
        return d >= start && d <= end && s.paid;
=======
        return d >= start && d <= end;
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
    });
    const filteredDeductions = deductions.filter(d => {
        const dd = new Date(d.date);
        return dd >= start && dd <= end;
    });
<<<<<<< HEAD
    // Total income (only paid sales)
    const totalIncome = filteredSales.reduce((sum, s) => sum + s.total, 0) - filteredDeductions.reduce((sum, d) => sum + d.amount, 0);
    dashboardIncome.textContent = 'PHP ' + totalIncome.toFixed(2);
    // Total customers (unique, only paid sales)
=======
    // Total income
    const totalIncome = getIncomeBalance();
    dashboardIncome.textContent = 'PHP ' + totalIncome.toFixed(2);
    // Total customers (unique)
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
    const customers = new Set(filteredSales.map(s => s.customer));
    dashboardCustomers.textContent = customers.size;
    // Total services
    dashboardServices.textContent = services.length;
    // Total deductions
    dashboardDeductions.textContent = 'PHP ' + filteredDeductions.reduce((sum, d) => sum + d.amount, 0).toFixed(2);
    // Printing and Layout tables
    dashboardPrintingTable.innerHTML = '';
    dashboardLayoutTable.innerHTML = '';
<<<<<<< HEAD
    services.filter(s => s.category === 'Printing').forEach((s) => {
        dashboardPrintingTable.innerHTML += `<tr>
            <td class="px-4 py-2">${s.name}</td>
            <td class="px-4 py-2">${s.unit}</td>
            <td class="px-4 py-2">${s.paperSize || ''}</td>
=======
    services.filter(s => s.category === 'Printing').forEach(s => {
        dashboardPrintingTable.innerHTML += `<tr>
            <td class="px-4 py-2">${s.name}</td>
            <td class="px-4 py-2">${s.unit}</td>
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
            <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
        </tr>`;
    });
    services.filter(s => s.category === 'Layout').forEach(s => {
        dashboardLayoutTable.innerHTML += `<tr>
            <td class="px-4 py-2">${s.name}</td>
            <td class="px-4 py-2">${s.unit}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
        </tr>`;
    });
}
dashboardFilter.addEventListener('change', renderDashboard);

// --- Services CRUD ---
function renderServices() {
<<<<<<< HEAD
    printingServicesTable.innerHTML = '';
    layoutServicesTable.innerHTML = '';
=======
    // Split into printing and layout
    const printingTable = document.getElementById('printingServicesTable');
    const layoutTable = document.getElementById('layoutServicesTable');
    printingTable.innerHTML = '';
    layoutTable.innerHTML = '';
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
    services.forEach((s, i) => {
        const row = `
            <tr>
                <td class="px-4 py-2">${s.name}</td>
                <td class="px-4 py-2">${s.unit}</td>
<<<<<<< HEAD
                <td class="px-4 py-2">${s.paperSize || ''}</td>
                <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
                <td class="px-4 py-2">
                    <div class='service-actions'>
                        <button onclick="openEditServiceModal(${i})" class="text-blue-600 material-icons align-middle" title="Edit">edit</button>
                        <button onclick="deleteService(${i})" class="text-red-600 material-icons align-middle" title="Delete">delete</button>
                    </div>
                </td>
            </tr>
        `;
        if (s.category === 'Printing') printingServicesTable.innerHTML += row;
        else layoutServicesTable.innerHTML += row;
    });
    // Update sales service dropdown if category is selected
    updateSaleServiceDropdown(saleCategory.value, saleService);
}
serviceForm.onsubmit = function(e) {
    e.preventDefault();
    services.push({
        name: serviceName.value.trim(),
        category: serviceCategory.value,
        unit: serviceUnit.value.trim(),
        price: parseFloat(servicePrice.value),
        paperSize: serviceCategory.value === 'Printing' ? servicePaperSize.value : ''
    });
    saveAll();
    renderServices();
    renderDashboard();
    serviceForm.reset();
    servicePaperSize.style.display = 'none';
    updateSaleServiceDropdown(saleCategory.value, saleService);
};
=======
                <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
                <td class="px-4 py-2">
                    <button onclick="openEditServiceModal(${i})" class="text-blue-600 hover:underline material-icons align-middle" title="Edit">edit</button>
                    <button onclick="deleteService(${i})" class="text-red-600 hover:underline material-icons align-middle ml-2" title="Delete">delete</button>
                </td>
            </tr>
        `;
        if (s.category === 'Printing') printingTable.innerHTML += row;
        else layoutTable.innerHTML += row;
    });
    // Update sales service dropdown
    saleService.innerHTML = '<option value=\"\">Services</option>' +
        services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
}

// Modal logic
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
window.openEditServiceModal = function(i) {
    const s = services[i];
    document.getElementById('editServiceIndex').value = i;
    document.getElementById('editServiceName').value = s.name;
    document.getElementById('editServiceCategory').value = s.category;
    document.getElementById('editServiceUnit').value = s.unit;
    document.getElementById('editServicePrice').value = s.price;
    document.getElementById('editServiceModal').classList.remove('hidden');
};
document.getElementById('closeEditServiceModal').onclick = function() {
    document.getElementById('editServiceModal').classList.add('hidden');
};
document.getElementById('editServiceForm').onsubmit = function(e) {
    e.preventDefault();
    const i = +document.getElementById('editServiceIndex').value;
    services[i] = {
        name: document.getElementById('editServiceName').value.trim(),
        category: document.getElementById('editServiceCategory').value,
        unit: document.getElementById('editServiceUnit').value,
        price: parseFloat(document.getElementById('editServicePrice').value)
    };
    saveAll();
    renderServices();
    renderDashboard();
    document.getElementById('editServiceModal').classList.add('hidden');
<<<<<<< HEAD
    updateSaleServiceDropdown(saleCategory.value, saleService);
};
window.deleteService = function(i) {
    if (confirm('Delete this service?')) {
        services.splice(i, 1);
        saveAll();
        renderServices();
        renderDashboard();
        updateSaleServiceDropdown(saleCategory.value, saleService);
    }
};

// --- Sales Log: Add Multiple Services per Customer ---
=======
};

// --- Sales CRUD ---
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
function updateSaleServiceDropdown(category, dropdown, selectedService = "") {
    if (!category) {
        dropdown.innerHTML = '<option value="" selected disabled>Services</option>';
        dropdown.disabled = true;
    } else {
        const options = services
            .filter(s => s.category === category)
            .map(s => `<option value="${s.name}">${s.name}</option>`)
            .join('');
<<<<<<< HEAD
        dropdown.innerHTML = `<option value="" selected disabled>Select Service</option>${options}`;
=======
        dropdown.innerHTML = `<option value="" selected disabled>Services</option>${options}`;
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
        dropdown.disabled = false;
        if (selectedService) dropdown.value = selectedService;
    }
}
<<<<<<< HEAD
serviceCategory.addEventListener('change', function() {
    if (serviceCategory.value === 'Printing') {
        servicePaperSize.style.display = '';
        servicePaperSize.required = true;
    } else {
        servicePaperSize.style.display = 'none';
        servicePaperSize.required = false;
        servicePaperSize.value = '';
    }
=======

// Main form: update service dropdown on category change
saleCategory.addEventListener('change', function() {
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
    updateSaleServiceDropdown(saleCategory.value, saleService);
    saleService.value = '';
    saleUnitPrice.value = '';
});
saleService.addEventListener('change', function() {
    const s = services.find(s => s.name === saleService.value);
    if (s) saleUnitPrice.value = s.price;
});

<<<<<<< HEAD
// Pending sales logic
function updatePendingSalesTable() {
    pendingSalesTable.innerHTML = '';
    let total = 0;
    pendingSales.forEach((s, i) => {
        const rowTotal = s.quantity * s.unitPrice;
        total += rowTotal;
        pendingSalesTable.innerHTML += `<tr>
            <td class="px-4 py-2">${s.category}</td>
            <td class="px-4 py-2">${s.service}</td>
            <td class="px-4 py-2">${s.quantity}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.unitPrice).toFixed(2)}</td>
            <td class="px-4 py-2">PHP ${rowTotal.toFixed(2)}</td>
            <td class="px-4 py-2">
                <button onclick="removePendingSale(${i})" class="text-red-600 hover:underline material-icons align-middle" title="Remove">delete</button>
            </td>
        </tr>`;
    });
    pendingSalesTotal.textContent = 'PHP ' + total.toFixed(2);
}
window.removePendingSale = function(i) {
    pendingSales.splice(i, 1);
    updatePendingSalesTable();
};
addServiceToCustomerBtn.onclick = function() {
    if (!saleDate.value || !saleCustomer.value || !saleCategory.value || !saleService.value || !saleQuantity.value || !saleUnitPrice.value) {
        alert('Please fill in all fields.');
        return;
    }
    pendingSales.push({
        date: saleDate.value,
        customer: saleCustomer.value.trim(),
        category: saleCategory.value,
        service: saleService.value,
        quantity: parseInt(saleQuantity.value),
        unitPrice: parseFloat(saleUnitPrice.value),
        total: parseInt(saleQuantity.value) * parseFloat(saleUnitPrice.value),
        paid: false // Default to not paid
    });
    updatePendingSalesTable();
    // Reset only the service/qty/price fields
    saleCategory.value = '';
    updateSaleServiceDropdown('', saleService);
    saleQuantity.value = 1;
    saleUnitPrice.value = '';
};
submitSalesForCustomerBtn.onclick = function() {
    if (pendingSales.length === 0) {
        alert('No services added for this customer.');
        return;
    }
    sales = sales.concat(pendingSales);
    saveAll();
    renderSales();
    renderDashboard();
    pendingSales = [];
    updatePendingSalesTable();
    // Reset the customer/date fields
    saleDate.value = new Date().toISOString().split('T')[0];
    saleCustomer.value = '';
};

// --- Sales Table ---
=======
// On page load, ensure Service dropdown is disabled
updateSaleServiceDropdown("", saleService);

// Render sales
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
function renderSales() {
    salesTable.innerHTML = '';
    sales.forEach((s, i) => {
        salesTable.innerHTML += `<tr>
            <td class="px-4 py-2">${s.date}</td>
            <td class="px-4 py-2">${s.customer}</td>
            <td class="px-4 py-2">${s.service}</td>
            <td class="px-4 py-2">${s.quantity}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.unitPrice).toFixed(2)}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.total).toFixed(2)}</td>
            <td class="px-4 py-2">
<<<<<<< HEAD
                <label class="sales-toggle">
                    <input type="checkbox" onchange="toggleSalePaid(${i})" ${s.paid ? 'checked' : ''}>
                    <span class="sales-slider">
                        <span class="checkmark material-icons">check</span>
                        <span class="xmark material-icons">close</span>
                    </span>
                </label>
                <span class="ml-2 text-sm font-medium ${s.paid ? 'text-green-700' : 'text-gray-500'}">
                    ${s.paid ? 'Paid' : 'Not Paid'}
                </span>
            </td>
            <td class="px-4 py-2">
                <button onclick="deleteSale(${i})" class="text-red-600 hover:underline material-icons align-middle" title="Delete">delete</button>
=======
                <button onclick="openEditSalesModal(${i})" class="text-blue-600 hover:underline material-icons align-middle" title="Edit">edit</button>
                <button onclick="deleteSale(${i})" class="text-red-600 hover:underline material-icons align-middle ml-2" title="Delete">delete</button>
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
            </td>
        </tr>`;
    });
}

<<<<<<< HEAD
// --- Deductions ---
function getIncomeBalance() {
    const totalSales = sales.filter(s => s.paid).reduce((sum, s) => sum + s.total, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    return totalSales - totalDeductions;
}
function updateDeductionBalance() {
    const balance = getIncomeBalance();
    deductionIncomeBalance.textContent = 'PHP ' + balance.toFixed(2);
}
=======
// Add sale
salesForm.onsubmit = function(e) {
    e.preventDefault();
    sales.push({
        date: saleDate.value,
        customer: saleCustomer.value.trim(),
        category: saleCategory.value,
        service: saleService.value,
        quantity: parseInt(saleQuantity.value),
        unitPrice: parseFloat(saleUnitPrice.value),
        total: parseInt(saleQuantity.value) * parseFloat(saleUnitPrice.value)
    });
    saveAll();
    renderSales();
    renderDashboard();
    salesForm.reset();
    saleQuantity.value = 1;
    updateSaleServiceDropdown(saleCategory.value, saleService);
};

// Edit modal logic
window.openEditSalesModal = function(i) {
    const s = sales[i];
    document.getElementById('editSalesIndex').value = i;
    document.getElementById('editSaleDate').value = s.date;
    document.getElementById('editSaleCustomer').value = s.customer;
    editSaleCategory.value = s.category;
    updateSaleServiceDropdown(s.category, editSaleService, s.service);
    document.getElementById('editSaleQuantity').value = s.quantity;
    document.getElementById('editSaleUnitPrice').value = s.unitPrice;
    document.getElementById('editSalesModal').classList.remove('hidden');
};
document.getElementById('closeEditSalesModal').onclick = function() {
    document.getElementById('editSalesModal').classList.add('hidden');
};
document.getElementById('editSaleCategory').addEventListener('change', function() {
    updateSaleServiceDropdown(this.value, document.getElementById('editSaleService'));
    document.getElementById('editSaleService').value = '';
    document.getElementById('editSaleUnitPrice').value = '';
});
document.getElementById('editSaleService').addEventListener('change', function() {
    const s = services.find(s => s.name === this.value);
    if (s) document.getElementById('editSaleUnitPrice').value = s.price;
});
document.getElementById('editSalesForm').onsubmit = function(e) {
    e.preventDefault();
    const i = +document.getElementById('editSalesIndex').value;
    sales[i] = {
        date: document.getElementById('editSaleDate').value,
        customer: document.getElementById('editSaleCustomer').value.trim(),
        category: document.getElementById('editSaleCategory').value,
        service: document.getElementById('editSaleService').value,
        quantity: parseInt(document.getElementById('editSaleQuantity').value),
        unitPrice: parseFloat(document.getElementById('editSaleUnitPrice').value),
        total: parseInt(document.getElementById('editSaleQuantity').value) * parseFloat(document.getElementById('editSaleUnitPrice').value)
    };
    saveAll();
    renderSales();
    renderDashboard();
    document.getElementById('editSalesModal').classList.add('hidden');
};
window.deleteSale = function(i) {
    if (confirm('Delete this sale?')) {
        sales.splice(i, 1);
        saveAll();
        renderSales();
        renderDashboard();
    }
};

// --- Deductions CRUD ---
function getIncomeBalance() {
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    return totalSales - totalDeductions;
}

function updateDeductionBalance() {
    const balance = getIncomeBalance();
    document.getElementById('deductionIncomeBalance').textContent = 'PHP ' + balance.toFixed(2);
}

function renderDeductions() {
    deductionsTable.innerHTML = '';
    deductions.forEach((d) => {
        deductionsTable.innerHTML += `<tr>
            <td class="px-4 py-2">${d.date}</td>
            <td class="px-4 py-2">${d.desc}</td>
            <td class="px-4 py-2">PHP ${parseFloat(d.amount).toFixed(2)}</td>
        </tr>`;
    });
    updateDeductionBalance();
}

>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
deductionForm.onsubmit = function(e) {
    e.preventDefault();
    const amount = parseFloat(deductionAmount.value);
    const balance = getIncomeBalance();
    if (amount > balance) {
        alert('Insufficient income balance! You cannot deduct more than your current income.');
        return;
    }
    deductions.push({
        date: deductionDate.value,
        desc: deductionDesc.value.trim(),
        amount: amount
    });
    allDeductions.push({
        date: deductionDate.value,
        desc: deductionDesc.value.trim(),
        amount: amount
    });
    saveAll();
    renderDeductions();
    renderDashboard();
    updateDeductionBalance();
    deductionForm.reset();
};
<<<<<<< HEAD
function renderDeductions() {
    deductionsTable.innerHTML = '';
    deductions.forEach((d) => {
        deductionsTable.innerHTML += `<tr>
            <td class="px-4 py-2">${d.date}</td>
            <td class="px-4 py-2">${d.desc}</td>
            <td class="px-4 py-2">PHP ${parseFloat(d.amount).toFixed(2)}</td>
        </tr>`;
    });
    updateDeductionBalance();
}

// --- Reset All Data ---
if (resetDataBtn) {
    resetDataBtn.onclick = function() {
        if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    };
}
=======
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5

// --- Initialization ---
function init() {
    loadAll();
    renderServices();
    renderSales();
    renderDeductions();
    renderDashboard();
<<<<<<< HEAD
    updatePendingSalesTable();
    updateDeductionBalance();
=======
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
    // Set today's date for forms
    const today = new Date().toISOString().split('T')[0];
    saleDate.value = today;
    deductionDate.value = today;
<<<<<<< HEAD
    saleCategory.value = '';
    updateSaleServiceDropdown('', saleService);
}
window.onload = init;

window.toggleSalePaid = function(i) {
    sales[i].paid = !sales[i].paid;
    saveAll();
    renderSales();
    renderDashboard();
};

window.deleteSale = function(i) {
    if (confirm('Delete this sale?')) {
        sales.splice(i, 1);
        saveAll();
        renderSales();
        renderDashboard();
        updateDeductionBalance();
    }
};

saleCategory.addEventListener('change', function() {
    updateSaleServiceDropdown(saleCategory.value, saleService);
    saleService.value = '';
    saleUnitPrice.value = '';
}); 
=======
}
window.onload = init;

function updatePendingSalesTable() {
    const table = document.getElementById('pendingSalesTable');
    const totalCell = document.getElementById('pendingSalesTotal');
    table.innerHTML = '';
    let total = 0;
    pendingSales.forEach((s, i) => {
        const rowTotal = s.quantity * s.unitPrice;
        total += rowTotal;
        table.innerHTML += `<tr>
            <td class="px-4 py-2">${s.category}</td>
            <td class="px-4 py-2">${s.service}</td>
            <td class="px-4 py-2">${s.quantity}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.unitPrice).toFixed(2)}</td>
            <td class="px-4 py-2">PHP ${rowTotal.toFixed(2)}</td>
            <td class="px-4 py-2">
                <button onclick="removePendingSale(${i})" class="text-red-600 hover:underline material-icons align-middle" title="Remove">delete</button>
            </td>
        </tr>`;
    });
    totalCell.textContent = 'PHP ' + total.toFixed(2);
}
window.removePendingSale = function(i) {
    pendingSales.splice(i, 1);
    updatePendingSalesTable();
};

// Add service to pending list
document.getElementById('addServiceToCustomer').onclick = function() {
    if (!saleDate.value || !saleCustomer.value || !saleCategory.value || !saleService.value || !saleQuantity.value || !saleUnitPrice.value) {
        alert('Please fill in all fields.');
        return;
    }
    pendingSales.push({
        date: saleDate.value,
        customer: saleCustomer.value.trim(),
        category: saleCategory.value,
        service: saleService.value,
        quantity: parseInt(saleQuantity.value),
        unitPrice: parseFloat(saleUnitPrice.value),
        total: parseInt(saleQuantity.value) * parseFloat(saleUnitPrice.value)
    });
    updatePendingSalesTable();
    // Reset only the service/qty/price fields
    saleCategory.value = '';
    updateSaleServiceDropdown('', saleService);
    saleQuantity.value = 1;
    saleUnitPrice.value = '';
};

// Submit all pending sales for this customer/date
document.getElementById('submitSalesForCustomer').onclick = function() {
    if (pendingSales.length === 0) {
        alert('No services added for this customer.');
        return;
    }
    sales = sales.concat(pendingSales);
    saveAll();
    renderSales();
    renderDashboard();
    pendingSales = [];
    updatePendingSalesTable();
    // Reset the customer/date fields
    saleDate.value = new Date().toISOString().split('T')[0];
    saleCustomer.value = '';
};

document.getElementById('resetDataBtn').onclick = function() {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}; 
>>>>>>> 79547824253e82cb70d7841c207c4afbaaeb35a5
