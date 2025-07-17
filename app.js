// --- Data Storage (Firestore only, no localStorage) ---
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
const saleCategory = document.getElementById('saleCategory');
const saleService = document.getElementById('saleService');
const saleQuantity = document.getElementById('saleQuantity');
const saleUnitPrice = document.getElementById('saleUnitPrice');
const pendingSalesTable = document.getElementById('pendingSalesTable');
const pendingSalesTotal = document.getElementById('pendingSalesTotal');
const submitSalesForCustomerBtn = document.getElementById('submitSalesForCustomer');
const serviceForm = document.getElementById('serviceForm');
const serviceName = document.getElementById('serviceName');
const serviceCategory = document.getElementById('serviceCategory');
const serviceUnit = document.getElementById('serviceUnit');
const servicePrice = document.getElementById('servicePrice');
const printingServicesTable = document.getElementById('printingServicesTable');
const layoutServicesTable = document.getElementById('layoutServicesTable');
const deductionForm = document.getElementById('deductionForm');
const deductionDate = document.getElementById('deductionDate');
const deductionDesc = document.getElementById('deductionDesc');
const deductionAmount = document.getElementById('deductionAmount');
const deductionsTable = document.getElementById('deductionsTable');
const deductionIncomeBalance = document.getElementById('deductionIncomeBalance');
const salesTable = document.getElementById('salesTable');
const resetDataBtn = document.getElementById('resetDataBtn');
const servicePaperSize = document.getElementById('servicePaperSize');

// --- Navigation Active State ---
function setActiveNav(tab) {
  document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => btn.classList.remove('active'));
  const navBtn = document.getElementById('nav-' + tab);
  if (navBtn) navBtn.classList.add('active');
  // FAB logic removed (no longer needed)
}
// Patch all tab switches to call setActiveNav
tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    setActiveNav(this.dataset.tab);
  });
});
// --- Bottom Nav Button Logic ---
document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tab = this.dataset.tab;
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
    // Show the selected tab
    const showTab = document.getElementById('tab-' + tab);
    if (showTab) showTab.classList.remove('hidden');
    // Update active nav
    setActiveNav(tab);
    // Optionally trigger render logic
    if (tab === 'dashboard') renderDashboard();
    if (tab === 'deductions') updateDeductionBalance();
  });
});
// On load, set initial active nav
window.addEventListener('DOMContentLoaded', function() {
  let activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
  if (!activeTab) {
    // Fallback: check which tab is visible
    const visibleTab = Array.from(document.querySelectorAll('.tab-content')).find(tc => !tc.classList.contains('hidden'));
    activeTab = visibleTab ? visibleTab.id.replace('tab-', '') : 'dashboard';
  }
  setActiveNav(activeTab);
});

// --- Local Storage ---
function saveAll() {
    // This function is no longer needed as data is synced with Firestore
}
function loadAll() {
    // This function is no longer needed as data is synced with Firestore
}

// --- Dashboard ---
function renderDashboard() {
    console.log('renderDashboard called', {services, sales, deductions});
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
    // Only count paid sales
    const filteredSales = sales.filter(s => {
        const d = new Date(s.date);
        return d >= start && d <= end && s.paid;
    });
    const filteredDeductions = deductions.filter(d => {
        const dd = new Date(d.date);
        return dd >= start && dd <= end;
    });
    const totalIncome = filteredSales.reduce((sum, s) => sum + s.total, 0) - filteredDeductions.reduce((sum, d) => sum + d.amount, 0);
    dashboardIncome.textContent = 'PHP ' + totalIncome.toFixed(2);
    const customers = new Set(filteredSales.map(s => s.customer));
    dashboardCustomers.textContent = customers.size;
    dashboardServices.textContent = services.length;
    dashboardDeductions.textContent = 'PHP ' + filteredDeductions.reduce((sum, d) => sum + d.amount, 0).toFixed(2);
    dashboardPrintingTable.innerHTML = '';
    dashboardLayoutTable.innerHTML = '';
    services.filter(s => s.category === 'Printing').forEach(s => {
        dashboardPrintingTable.innerHTML += `<tr class="text-xs sm:text-sm">
            <td class="px-4 py-2">${s.name}</td>
            <td class="px-4 py-2">${s.unit}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
            <td class="px-4 py-2">${s.paperSize || ''}</td>
        </tr>`;
    });
    services.filter(s => s.category === 'Layout').forEach(s => {
        dashboardLayoutTable.innerHTML += `<tr class="text-xs sm:text-sm">
            <td class="px-4 py-2">${s.name}</td>
            <td class="px-4 py-2">${s.unit}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
        </tr>`;
    });
}
dashboardFilter.addEventListener('change', renderDashboard);

// --- Services CRUD ---
function renderServices() {
    console.log('renderServices called', services);
    printingServicesTable.innerHTML = '';
    layoutServicesTable.innerHTML = '';
    services.forEach((s, i) => {
        let row = '';
        if (s.category === 'Printing') {
            row = `
                <tr class="text-xs sm:text-sm">
                    <td class="px-4 py-2">${s.name}</td>
                    <td class="px-4 py-2">${s.unit}</td>
                    <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
                    <td class="px-4 py-2">${s.paperSize || ''}</td>
                    <td class="px-4 py-2">
                        <div class='service-actions'>
                            <button onclick="openEditServiceModal(${i})" class="text-blue-600 material-icons align-middle" title="Edit">edit</button>
                            <button onclick="deleteService(${i})" class="text-red-600 material-icons align-middle" title="Delete">delete</button>
                        </div>
                    </td>
                </tr>
            `;
            printingServicesTable.innerHTML += row;
        } else {
            row = `
                <tr class="text-xs sm:text-sm">
                    <td class="px-4 py-2">${s.name}</td>
                    <td class="px-4 py-2">${s.unit}</td>
                    <td class="px-4 py-2">PHP ${parseFloat(s.price).toFixed(2)}</td>
                    <td class="px-4 py-2">
                        <div class='service-actions'>
                            <button onclick="openEditServiceModal(${i})" class="text-blue-600 material-icons align-middle" title="Edit">edit</button>
                            <button onclick="deleteService(${i})" class="text-red-600 material-icons align-middle" title="Delete">delete</button>
                        </div>
                    </td>
                </tr>
            `;
            layoutServicesTable.innerHTML += row;
        }
    });
    updateSaleServiceDropdown(saleCategory.value, saleService);
}
// --- Firestore Sync Functions ---
async function loadServices() {
    const querySnapshot = await window.db.collection("services").get();
    services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderServices();
    renderDashboard();
}
async function loadSales() {
    const querySnapshot = await window.db.collection("sales").get();
    sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderSales();
    renderDashboard();
}
async function loadDeductions() {
    const querySnapshot = await window.db.collection("deductions").get();
    deductions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderDeductions();
    renderDashboard();
    updateDeductionBalance();
}

// --- Services CRUD ---
serviceForm.onsubmit = async function(e) {
    e.preventDefault();
    const newService = {
        name: serviceName.value.trim(),
        category: serviceCategory.value,
        unit: serviceUnit.value.trim(),
        price: parseFloat(servicePrice.value),
        paperSize: serviceCategory.value === 'Printing' ? servicePaperSize.value : ''
    };
    await window.db.collection("services").add(newService);
    await loadServices();
    serviceForm.reset();
    servicePaperSize.style.display = 'none';
    updateSaleServiceDropdown(saleCategory.value, saleService);
};
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
document.getElementById('editServiceForm').onsubmit = async function(e) {
    e.preventDefault();
    const i = +document.getElementById('editServiceIndex').value;
    const s = services[i];
    const updatedService = {
        name: document.getElementById('editServiceName').value.trim(),
        category: document.getElementById('editServiceCategory').value,
        unit: document.getElementById('editServiceUnit').value,
        price: parseFloat(document.getElementById('editServicePrice').value),
        paperSize: s.category === 'Printing' ? s.paperSize : ''
    };
    await window.db.collection("services").doc(s.id).set(updatedService);
    await loadServices();
    document.getElementById('editServiceModal').classList.add('hidden');
    updateSaleServiceDropdown(saleCategory.value, saleService);
};
window.deleteService = async function(i) {
    if (confirm('Delete this service?')) {
        const s = services[i];
        await window.db.collection("services").doc(s.id).delete();
        await loadServices();
        updateSaleServiceDropdown(saleCategory.value, saleService);
    }
};

// --- Sales Log: Add Multiple Services per Customer ---
function updateSaleServiceDropdown(category, dropdown, selectedService = "") {
    if (!category) {
        dropdown.innerHTML = '<option value="" selected disabled>Services</option>';
        dropdown.disabled = true;
    } else {
        const options = services
            .filter(s => s.category === category)
            .map(s => `<option value="${s.name}">${s.name}</option>`)
            .join('');
        dropdown.innerHTML = `<option value="" selected disabled>Select Service</option>${options}`;
        dropdown.disabled = false;
        if (selectedService) dropdown.value = selectedService;
    }
}
serviceCategory.addEventListener('change', function() {
    if (serviceCategory.value === 'Printing') {
        servicePaperSize.style.display = '';
        servicePaperSize.required = true;
    } else {
        servicePaperSize.style.display = 'none';
        servicePaperSize.required = false;
        servicePaperSize.value = '';
    }
    updateSaleServiceDropdown(saleCategory.value, saleService);
    saleService.value = '';
    saleUnitPrice.value = '';
});
saleCategory.addEventListener('change', function() {
    updateSaleServiceDropdown(saleCategory.value, saleService);
    saleService.value = '';
    saleUnitPrice.value = '';
});
saleService.addEventListener('change', function() {
    const s = services.find(s => s.name === saleService.value);
    if (s) saleUnitPrice.value = s.price;
});

// Pending sales logic
function updatePendingSalesTable() {
    pendingSalesTable.innerHTML = '';
    let total = 0;
    pendingSales.forEach((s, i) => {
        const rowTotal = s.quantity * s.unitPrice;
        total += rowTotal;
        pendingSalesTable.innerHTML += `<tr class="text-xs sm:text-sm">
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

// --- Sales Table ---
function renderSales() {
    console.log('renderSales called', sales);
    salesTable.innerHTML = '';
    sales.forEach((s, i) => {
        salesTable.innerHTML += `<tr class="text-xs sm:text-sm">
            <td class="px-4 py-2">${s.date}</td>
            <td class="px-4 py-2">${s.customer}</td>
            <td class="px-4 py-2">${s.service}</td>
            <td class="px-4 py-2">${s.quantity}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.unitPrice).toFixed(2)}</td>
            <td class="px-4 py-2">PHP ${parseFloat(s.total).toFixed(2)}</td>
            <td class="px-4 py-2">
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
            </td>
        </tr>`;
    });
}
window.deleteSale = async function(i) {
    if (confirm('Delete this sale?')) {
        const s = sales[i];
        await window.db.collection("sales").doc(s.id).delete();
        await loadSales();
        renderDashboard();
        updateDeductionBalance();
    }
};
window.toggleSalePaid = async function(i) {
    const s = sales[i];
    await window.db.collection("sales").doc(s.id).update({ paid: !s.paid });
    await loadSales();
};

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
deductionForm.onsubmit = async function(e) {
    e.preventDefault();
    const amount = parseFloat(deductionAmount.value);
    const balance = getIncomeBalance();
    if (amount > balance) {
        alert('Insufficient income balance! You cannot deduct more than your current income.');
        return;
    }
    const deduction = {
        date: deductionDate.value,
        desc: deductionDesc.value.trim(),
        amount: amount
    };
    await window.db.collection("deductions").add(deduction);
    await loadDeductions();
    deductionForm.reset();
};
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
    resetDataBtn.onclick = async function() {
        if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            // This will delete all data from Firestore
            const servicesSnapshot = await window.db.collection("services").get();
            for (const doc of servicesSnapshot.docs) {
                await window.db.collection("services").doc(doc.id).delete();
            }
            const salesSnapshot = await window.db.collection("sales").get();
            for (const doc of salesSnapshot.docs) {
                await window.db.collection("sales").doc(doc.id).delete();
            }
            const deductionsSnapshot = await window.db.collection("deductions").get();
            for (const doc of deductionsSnapshot.docs) {
                await window.db.collection("deductions").doc(doc.id).delete();
            }
            location.reload();
        }
    };
}

// --- Initialization ---
async function init() {
    await loadServices();
    await loadSales();
    await loadDeductions();
    updatePendingSalesTable();
    updateDeductionBalance();
    const today = new Date().toISOString().split('T')[0];
    saleDate.value = today;
    deductionDate.value = today;
    saleCategory.value = '';
    updateSaleServiceDropdown('', saleService);
}
window.onload = init;

