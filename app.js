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
const pendingSection = document.getElementById('pendingSection');
const pendingActions = document.getElementById('pendingActions');
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

// --- Modern Alert System ---
function showModernAlert(type, title, message, icon) {
    const modal = document.getElementById('modernAlertModal');
    const alertIcon = document.getElementById('alertIcon');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const iconContainer = document.querySelector('.modern-alert-icon');
    
    // Set icon and type
    alertIcon.textContent = icon;
    iconContainer.className = `modern-alert-icon ${type}`;
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    
    // Show modal with optimized performance
    requestAnimationFrame(() => {
        modal.classList.remove('hidden');
    });
    
    // Auto-hide after 2.5 seconds for success messages (faster)
    if (type === 'success') {
        setTimeout(() => {
            hideModernAlert();
        }, 2500);
    }
}

function hideModernAlert() {
    const modal = document.getElementById('modernAlertModal');
    requestAnimationFrame(() => {
        modal.classList.add('hidden');
    });
}

// Alert button event listener
document.getElementById('alertOkButton').addEventListener('click', hideModernAlert);

// --- Modern Confirmation Modal System ---
let confirmCallback = null;

function showModernConfirm(type, title, message, icon, callback) {
    const modal = document.getElementById('modernConfirmModal');
    const confirmIcon = document.getElementById('confirmIcon');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const iconContainer = document.querySelector('#modernConfirmModal .modern-alert-icon');
    
    // Set icon and type
    confirmIcon.textContent = icon;
    iconContainer.className = `modern-alert-icon ${type}`;
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    
    // Store callback
    confirmCallback = callback;
    
    // Show modal with optimized performance
    requestAnimationFrame(() => {
        modal.classList.remove('hidden');
    });
}

function hideModernConfirm() {
    const modal = document.getElementById('modernConfirmModal');
    requestAnimationFrame(() => {
        modal.classList.add('hidden');
    });
    confirmCallback = null;
}

// Confirmation button event listeners
document.getElementById('confirmCancelButton').addEventListener('click', hideModernConfirm);
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (confirmCallback) {
        confirmCallback();
    }
    hideModernConfirm();
});

// --- Navigation Active State ---
function setActiveNav(tab) {
  document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => btn.classList.remove('active'));
  const navBtn = document.getElementById('nav-' + tab);
  if (navBtn) navBtn.classList.add('active');
  // FAB logic removed (no longer needed)
}
// Desktop header nav: switch tabs and sync active state
tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const tab = this.dataset.tab;
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
    // Show selected tab
    const showTab = document.getElementById('tab-' + tab);
    if (showTab) showTab.classList.remove('hidden');
    // Active styles for header buttons
    tabBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    // Sync bottom nav
    setActiveNav(tab);
    // Optional re-renders
    if (tab === 'dashboard') renderDashboard();
    if (tab === 'deductions') updateDeductionBalance();
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
  // Reflect active to desktop header buttons
  tabBtns.forEach(b => {
    if (b.dataset.tab === activeTab) b.classList.add('active');
    else b.classList.remove('active');
  });
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
    
    // Sort services alphabetically by name
    const sortedServices = [...services].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedServices.forEach((s, i) => {
        // Find the original index in the services array for proper editing
        const originalIndex = services.findIndex(service => service.id === s.id);
        
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
                            <button onclick="openEditServiceModal(${originalIndex})" class="text-blue-600 material-icons align-middle" title="Edit">edit</button>
                            <button onclick="deleteService(${originalIndex})" class="text-red-600 material-icons align-middle" title="Delete">delete</button>
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
                            <button onclick="openEditServiceModal(${originalIndex})" class="text-blue-600 material-icons align-middle" title="Edit">edit</button>
                            <button onclick="deleteService(${originalIndex})" class="text-red-600 material-icons align-middle" title="Delete">delete</button>
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
    try {
        console.log('Loading services from Firestore...');
        // Always fetch services sorted alphabetically by name
        const querySnapshot = await window.db.collection("services").orderBy("name").get();
        console.log('Services query result:', querySnapshot.docs.length, 'documents');
        services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Services loaded:', services);
        
        // Force re-render
        renderServices();
        renderDashboard();
        
        // Log table contents for debugging
        console.log('Printing services table HTML:', printingServicesTable.innerHTML);
        console.log('Layout services table HTML:', layoutServicesTable.innerHTML);
    } catch (error) {
        console.error('Error loading services:', error);
        if (error.code === 'permission-denied') {
            alert('Firebase permission error: Please check your Firestore security rules. The app needs read/write access to the services collection.');
        } else {
            alert('Error loading services: ' + error.message);
        }
    }
}
``
async function loadSales() {
    try {
        console.log('Loading sales from Firestore...');
        const querySnapshot = await window.db.collection("sales").orderBy("date", "desc").get();
        console.log('Sales query result:', querySnapshot.docs.length, 'documents');
        sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Sales loaded:', sales);
        renderSales();
        renderDashboard();
    } catch (error) {
        console.error('Error loading sales:', error);
        if (error.code === 'permission-denied') {
            alert('Firebase permission error: Please check your Firestore security rules. The app needs read/write access to the sales collection.');
        } else {
            alert('Error loading sales: ' + error.message);
        }
    }
}

async function loadDeductions() {
    try {
        console.log('Loading deductions from Firestore...');
        const querySnapshot = await window.db.collection("deductions").orderBy("date", "desc").get();
        console.log('Deductions query result:', querySnapshot.docs.length, 'documents');
        deductions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Deductions loaded:', deductions);
        renderDeductions();
        renderDashboard();
        updateDeductionBalance();
    } catch (error) {
        console.error('Error loading deductions:', error);
        if (error.code === 'permission-denied') {
            alert('Firebase permission error: Please check your Firestore security rules. The app needs read/write access to the deductions collection.');
        } else {
            alert('Error loading deductions: ' + error.message);
        }
    }
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
    showModernAlert('success', 'Service Added!', 'New service has been added successfully.', 'add_circle');
};
window.openEditServiceModal = function(i) {
    const s = services[i];
    document.getElementById('editServiceIndex').value = i;
    document.getElementById('editServiceName').value = s.name;
    document.getElementById('editServiceCategory').value = s.category;
    document.getElementById('editServiceUnit').value = s.unit;
    document.getElementById('editServicePrice').value = s.price;
    
    // Handle paperSize field visibility and value
    const editServicePaperSizeContainer = document.getElementById('editServicePaperSizeContainer');
    const editServicePaperSize = document.getElementById('editServicePaperSize');
    if (s.category === 'Printing') {
        editServicePaperSizeContainer.style.display = '';
        editServicePaperSize.required = true;
        editServicePaperSize.value = s.paperSize || '';
    } else {
        editServicePaperSizeContainer.style.display = 'none';
        editServicePaperSize.required = false;
        editServicePaperSize.value = '';
    }
    
    document.getElementById('editServiceModal').classList.remove('hidden');
};
document.getElementById('closeEditServiceModal').onclick = function() {
    document.getElementById('editServiceModal').classList.add('hidden');
};
document.getElementById('editServiceForm').onsubmit = async function(e) {
    e.preventDefault();
    const i = +document.getElementById('editServiceIndex').value;
    const s = services[i];
    
    // Get the paperSize value if category is Printing
    const editServicePaperSize = document.getElementById('editServicePaperSize');
    const paperSize = (document.getElementById('editServiceCategory').value === 'Printing') ? 
        (editServicePaperSize.value || '') : '';
    
    const updatedService = {
        name: document.getElementById('editServiceName').value.trim(),
        category: document.getElementById('editServiceCategory').value,
        unit: document.getElementById('editServiceUnit').value,
        price: parseFloat(document.getElementById('editServicePrice').value),
        paperSize: paperSize
    };
    
    try {
        await window.db.collection("services").doc(s.id).update(updatedService);
        await loadServices();
        document.getElementById('editServiceModal').classList.add('hidden');
        updateSaleServiceDropdown(saleCategory.value, saleService);
    } catch (error) {
        console.error('Error updating service:', error);
        alert('Error updating service: ' + error.message);
    }
};
window.deleteService = async function(i) {
    const s = services[i];
    showModernConfirm('error', 'Delete Service', `Are you sure you want to delete "${s.name}" service?`, 'delete', async function() {
        await window.db.collection("services").doc(s.id).delete();
        await loadServices();
        updateSaleServiceDropdown(saleCategory.value, saleService);
        showModernAlert('success', 'Service Deleted', 'Service has been removed successfully.', 'delete');
    });
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
        servicePaperSize.style.display = 'block';
        servicePaperSize.removeAttribute('aria-hidden');
        servicePaperSize.required = true;
    } else {
        servicePaperSize.style.display = 'none';
        servicePaperSize.setAttribute('aria-hidden','true');
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
        // Check if we should show grouped view: multiple services OR has additional expense
        const shouldShowGrouped = (s.isGrouped && s.services && s.services.length > 1) || 
                                 (s.isGrouped && s.services && s.services.length === 1 && s.additionalExpense > 0);
        
        if (shouldShowGrouped) {
            // Render grouped sales with sub-rows
            let groupedHtml = '';
            
            // Main row with customer info and total
            groupedHtml += `<tr class="text-xs sm:text-sm bg-blue-50 border-l-4 border-blue-400">
                <td class="px-4 py-2 font-semibold">${s.date}</td>
                <td class="px-4 py-2 font-semibold">${s.customer}</td>
                <td class="px-4 py-2 font-semibold">${s.services.length} service(s)</td>
                <td class="px-4 py-2"></td>
                <td class="px-4 py-2"></td>
                <td class="px-4 py-2 font-bold text-lg">PHP ${parseFloat(s.total).toFixed(2)}</td>
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
            
            // Sub-rows for each service
            s.services.forEach((service, serviceIndex) => {
                groupedHtml += `<tr class="text-xs sm:text-sm bg-gray-50">
                    <td class="px-4 py-2"></td>
                    <td class="px-4 py-2 pl-6 text-gray-600">• ${service.category}</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">${service.service}</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">${service.quantity}</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">PHP ${parseFloat(service.unitPrice).toFixed(2)}</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">PHP ${parseFloat(service.total).toFixed(2)}</td>
                    <td class="px-4 py-2"></td>
                    <td class="px-4 py-2"></td>
                </tr>`;
            });
            
            // Additional expense row if exists
            if (s.additionalExpense > 0) {
                groupedHtml += `<tr class="text-xs sm:text-sm bg-yellow-50">
                    <td class="px-4 py-2"></td>
                    <td class="px-4 py-2 pl-6 text-gray-600">• Additional</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">Additional Expense</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">1</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">PHP ${parseFloat(s.additionalExpense).toFixed(2)}</td>
                    <td class="px-4 py-2 pl-6 text-gray-600">PHP ${parseFloat(s.additionalExpense).toFixed(2)}</td>
                    <td class="px-4 py-2"></td>
                    <td class="px-4 py-2"></td>
                </tr>`;
            }
            
            salesTable.innerHTML += groupedHtml;
        } else {
            // Render regular single sales (either old format or single service from grouped)
            let serviceData = s;
            
            // If it's a grouped sale with single service, extract the service data
            if (s.isGrouped && s.services && s.services.length === 1) {
                serviceData = {
                    date: s.date,
                    customer: s.customer,
                    service: s.services[0].service,
                    quantity: s.services[0].quantity,
                    unitPrice: s.services[0].unitPrice,
                    total: s.services[0].total,
                    paid: s.paid
                };
            }
            
            salesTable.innerHTML += `<tr class="text-xs sm:text-sm">
                <td class="px-4 py-2">${serviceData.date}</td>
                <td class="px-4 py-2">${serviceData.customer}</td>
                <td class="px-4 py-2">${serviceData.service}</td>
                <td class="px-4 py-2">${serviceData.quantity}</td>
                <td class="px-4 py-2">PHP ${parseFloat(serviceData.unitPrice).toFixed(2)}</td>
                <td class="px-4 py-2">PHP ${parseFloat(serviceData.total).toFixed(2)}</td>
                <td class="px-4 py-2">
                    <label class="sales-toggle">
                        <input type="checkbox" onchange="toggleSalePaid(${i})" ${serviceData.paid ? 'checked' : ''}>
                        <span class="sales-slider">
                            <span class="checkmark material-icons">check</span>
                            <span class="xmark material-icons">close</span>
                        </span>
                    </label>
                    <span class="ml-2 text-sm font-medium ${serviceData.paid ? 'text-green-700' : 'text-gray-500'}">
                        ${serviceData.paid ? 'Paid' : 'Not Paid'}
                    </span>
                </td>
                <td class="px-4 py-2">
                    <button onclick="deleteSale(${i})" class="text-red-600 hover:underline material-icons align-middle" title="Delete">delete</button>
                </td>
            </tr>`;
        }
    });
}
window.deleteSale = async function(i) {
    const s = sales[i];
    showModernConfirm('error', 'Delete Sale', `Are you sure you want to delete this sale for ${s.customer}?`, 'delete', async function() {
        await window.db.collection("sales").doc(s.id).delete();
        await loadSales();
        renderDashboard();
        updateDeductionBalance();
        showModernAlert('success', 'Sale Deleted', 'Sale has been removed successfully.', 'delete');
    });
};
window.toggleSalePaid = async function(i) {
    const s = sales[i];
    await window.db.collection("sales").doc(s.id).update({ paid: !s.paid });
    await loadSales();
};

// --- Reset Sales Form Function ---
function resetSalesForm() {
    saleDate.value = '';
    saleCustomer.value = '';
    saleCategory.value = '';
    saleService.value = '';
    saleQuantity.value = '1';
    saleUnitPrice.value = '';
    // Reset service dropdown
    updateSaleServiceDropdown('', saleService);
}

// --- Sales Log Submit Button (Add to Pending) ---
submitSalesForCustomerBtn.onclick = async function() {
    if (!saleDate.value || !saleCustomer.value || !saleCategory.value || !saleService.value || !saleQuantity.value || !saleUnitPrice.value) {
        showModernAlert('warning', 'Missing Information', 'Please fill in all fields.', 'warning');
        return;
    }
    
    const sale = {
        date: saleDate.value,
        customer: saleCustomer.value.trim(),
        category: saleCategory.value,
        service: saleService.value,
        quantity: parseInt(saleQuantity.value),
        unitPrice: parseFloat(saleUnitPrice.value),
        total: parseInt(saleQuantity.value) * parseFloat(saleUnitPrice.value),
        id: Date.now() // Unique ID for pending sales
    };
    
    pendingSales.push(sale);
    // show pending section
    if (pendingSection) pendingSection.classList.remove('hidden');
    if (pendingActions) pendingActions.classList.remove('hidden');
    updatePendingSalesTable();
    
    // Clear form
    resetSalesForm();
};

// --- Pending Sales Table Functions ---
function updatePendingSalesTable() {
    const tbody = document.getElementById('pendingSalesTable');
    const subtotalEl = document.getElementById('pendingSalesSubtotal');
    const additionalEl = document.getElementById('pendingSalesAdditional');
    const totalEl = document.getElementById('pendingSalesTotal');
    const additionalExpense = parseFloat(document.getElementById('additionalExpense').value) || 0;
    
    tbody.innerHTML = '';
    
    let subtotal = 0;
    pendingSales.forEach(sale => {
        subtotal += sale.total;
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="px-4 py-2">${sale.category}</td>
            <td class="px-4 py-2">${sale.service}</td>
            <td class="px-4 py-2">${sale.quantity}</td>
            <td class="px-4 py-2">PHP ${sale.unitPrice.toFixed(2)}</td>
            <td class="px-4 py-2">PHP ${sale.total.toFixed(2)}</td>
            <td class="px-4 py-2">
                <button onclick="removePendingSale(${sale.id})" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
            </td>
        `;
    });
    
    subtotalEl.textContent = `PHP ${subtotal.toFixed(2)}`;
    additionalEl.textContent = `PHP ${additionalExpense.toFixed(2)}`;
    totalEl.textContent = `PHP ${(subtotal + additionalExpense).toFixed(2)}`;

    // hide if empty
    if (pendingSales.length === 0) {
        if (pendingSection) pendingSection.classList.add('hidden');
        if (pendingActions) pendingActions.classList.add('hidden');
    }
}

function removePendingSale(id) {
    pendingSales = pendingSales.filter(sale => sale.id !== id);
    updatePendingSalesTable();
}

// --- Complete Sale (Done Button) ---
document.getElementById('completeSale').onclick = async function() {
    if (pendingSales.length === 0) {
        showModernAlert('warning', 'No Items', 'No items to complete.', 'warning');
        return;
    }
    
    const additionalExpense = parseFloat(document.getElementById('additionalExpense').value) || 0;
    const subtotal = pendingSales.reduce((sum, sale) => sum + sale.total, 0);
    const total = subtotal + additionalExpense;
    
    // Create a single grouped sale entry
    const groupedSale = {
        date: pendingSales[0].date,
        customer: pendingSales[0].customer,
        services: pendingSales.map(sale => ({
            category: sale.category,
            service: sale.service,
            quantity: sale.quantity,
            unitPrice: sale.unitPrice,
            total: sale.total
        })),
        additionalExpense: additionalExpense,
        subtotal: subtotal,
        total: total,
        paid: false,
        isGrouped: true // Flag to identify grouped sales
    };
    
    await window.db.collection("sales").add(groupedSale);
    
    // Clear pending sales and reload
    pendingSales = [];
    document.getElementById('additionalExpense').value = '';
    updatePendingSalesTable();
    if (pendingSection) pendingSection.classList.add('hidden');
    if (pendingActions) pendingActions.classList.add('hidden');
    
    // Reset the sales form completely
    resetSalesForm();
    
    await loadSales();
    
    showModernAlert('success', 'Sale Completed!', 'Your sale has been successfully recorded.', 'check_circle');
};

// --- Cancel Sale ---
document.getElementById('cancelSale').onclick = function() {
    if (pendingSales.length === 0) {
        showModernAlert('info', 'No Pending Sales', 'No pending sales to cancel.', 'info');
        return;
    }
    
    showModernConfirm('warning', 'Cancel Sale', 'Are you sure you want to cancel this sale? All pending items will be removed.', 'warning', function() {
        pendingSales = [];
        document.getElementById('additionalExpense').value = '';
        updatePendingSalesTable();
        if (pendingSection) pendingSection.classList.add('hidden');
        if (pendingActions) pendingActions.classList.add('hidden');
        
        // Reset the sales form
        resetSalesForm();
        
        showModernAlert('success', 'Sale Cancelled', 'Pending sale has been cancelled successfully.', 'check_circle');
    });
};

// --- Additional Expense Input Handler ---
document.getElementById('additionalExpense').addEventListener('input', function() {
    updatePendingSalesTable();
});

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
        showModernAlert('error', 'Insufficient Balance', 'You cannot deduct more than your current income.', 'error');
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
    showModernAlert('success', 'Deduction Added!', 'New deduction has been recorded successfully.', 'remove_circle');
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

// --- Refresh Data Button ---
const refreshDataBtn = document.getElementById('refreshDataBtn');
if (refreshDataBtn) {
    refreshDataBtn.onclick = async function() {
        try {
            console.log('Manual refresh triggered...');
            await loadServices();
            await loadSales();
            await loadDeductions();
            alert('Data refreshed successfully!');
        } catch (error) {
            console.error('Error refreshing data:', error);
            alert('Error refreshing data: ' + error.message);
        }
    };
}

// --- Add Sample Deductions Button ---
const addSampleDeductionsBtn = document.getElementById('addSampleDeductionsBtn');
if (addSampleDeductionsBtn) {
    addSampleDeductionsBtn.onclick = async function() {
        if (confirm('Add sample deduction data to Firestore?')) {
            try {
                await addSampleDeductions();
                alert('Sample deductions added successfully!');
            } catch (error) {
                console.error('Error adding sample deductions:', error);
                alert('Error adding sample deductions: ' + error.message);
            }
        }
    };
}

// --- Add Sample Deductions (for testing) ---
async function addSampleDeductions() {
    try {
        const sampleDeductions = [
            { date: "2025-06-29", desc: "NANAY", amount: 52 },
            { date: "2025-07-02", desc: "bond paper a4", amount: 198 },
            { date: "2025-07-02", desc: "photo paper", amount: 118 }
        ];
        
        for (const deduction of sampleDeductions) {
            await window.db.collection("deductions").add(deduction);
        }
        console.log('Sample deductions added successfully');
        await loadDeductions();
    } catch (error) {
        console.error('Error adding sample deductions:', error);
    }
}

// --- Initialization ---
async function init() {
    try {
        console.log('Initializing app...');
        console.log('Firebase db object:', window.db);
        
        // Check if Firebase is properly initialized
        if (!window.db) {
            throw new Error('Firebase is not initialized. Please check your internet connection and refresh the page.');
        }
        
        // Test Firebase connection
        console.log('Testing Firebase connection...');
        try {
            await window.db.collection("test").limit(1).get();
            console.log('Firebase connection successful');
        } catch (error) {
            console.error('Firebase connection test failed:', error);
            // Continue anyway - the real test will be when we try to load data
        }
        
        // Load all data
        await loadServices();
        await loadSales();
        await loadDeductions();
        
        // Initialize UI
        updatePendingSalesTable();
        updateDeductionBalance();
        const today = new Date().toISOString().split('T')[0];
        saleDate.value = today;
        deductionDate.value = today;
        saleCategory.value = '';
        updateSaleServiceDropdown('', saleService);
        
        console.log('App initialization complete');
        
        // Uncomment the line below to add sample deductions (only run once)
        // await addSampleDeductions();
    } catch (error) {
        console.error('Error during initialization:', error);
        alert('Error initializing app: ' + error.message + '\nPlease check your internet connection and refresh the page.');
    }
}

// Add event listener for edit service category changes
document.addEventListener('DOMContentLoaded', function() {
    const editServiceCategory = document.getElementById('editServiceCategory');
    if (editServiceCategory) {
        editServiceCategory.addEventListener('change', function() {
            const editServicePaperSizeContainer = document.getElementById('editServicePaperSizeContainer');
            const editServicePaperSize = document.getElementById('editServicePaperSize');
            if (this.value === 'Printing') {
                editServicePaperSizeContainer.style.display = '';
                editServicePaperSize.required = true;
            } else {
                editServicePaperSizeContainer.style.display = 'none';
                editServicePaperSize.required = false;
                editServicePaperSize.value = '';
            }
        });
    }
    
    // Initialize immediately for faster startup
    init();
    
    // Theme toggle removed: enforce single polished light theme
});

