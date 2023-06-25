let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

let activeTab = "all";

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads, activeTab);
}

const tabContainer = document.querySelector(".tab-container");
const tabButtonsContainer = tabContainer.querySelector(".tab");
const tabContentContainer = tabContainer.querySelector(".tab-content");
const addTabButton = document.getElementById("tab-btn");

let myTabs = []; // Define the myTabs array

// Function to save the tabs to local storage
function saveTabs() {
    localStorage.setItem("myTabs", JSON.stringify(myTabs));
}

let tabsFromLocalStorage = JSON.parse(localStorage.getItem("myTabs"));
if (tabsFromLocalStorage) {
    myTabs = tabsFromLocalStorage;
} else {
    myTabs = ["all"]; // Set "all" as the default tab
    saveTabs(); // Save the default tabs
}

renderTab(myTabs);

const tabButtons = tabButtonsContainer.querySelectorAll(".tab-btn");
tabButtons.forEach((button) => {
    button.addEventListener("click", function() {
        const tab = this.getAttribute("data-tab");
        showTab(tab);
    });
});

function deleteTab(tab) {
    const tabButton = tabButtonsContainer.querySelector(
        `.tab-btn[data-tab="${tab}"]`
    );
    const tabPane = tabContentContainer.querySelector(
        `.tab-pane[data-tab="${tab}"]`
    );

    if (tabButton && tabPane) {
        tabButtonsContainer.removeChild(tabButton);
        tabContentContainer.removeChild(tabPane);
    }

    if (activeTab === tab) {
        showTab("all");
    }
    renderTab(myTabs);
}

function showTab(tab) {
    activeTab = tab;

    const tabPanes = tabContentContainer.querySelectorAll(".tab-pane");
    const tabButtons = tabButtonsContainer.querySelectorAll(".tab-btn");

    tabPanes.forEach((pane) => {
        if (pane.getAttribute("data-tab") === tab || tab === "all") {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    });

    tabButtons.forEach((button) => {
        if (button.getAttribute("data-tab") === tab || tab === "all") {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    render(myLeads, activeTab); // Re-render the saved elements based on the active tab
}

function render(leads, tab) {
    let filteredLeads = leads;
    if (tab !== "all") {
        filteredLeads = leads.filter((lead) => {
            const leadTab = lead.tab.toLowerCase().replace(/\s/g, "-");
            return leadTab === tab;
        });
    }

    const ulEl = document.getElementById("ul-el"); // Select the <ul> element

    let listItems = "";
    for (let i = 0; i < filteredLeads.length; i++) {
        const lead = filteredLeads[i];
        listItems += `
      <li>
        <a target='_blank' href='${lead.url}'>
          ${lead.url}
        </a>
        <button class="delete-item-btn" onclick="deleteLead(${i}, '${tab}')">&times;</button>
      </li>
    `;
    }
    ulEl.innerHTML = listItems;
}

function renderTab(tabs) {
    const ulEl = document.getElementById("tab-ul"); // Select the <ul> element

    let listItems = "";
    for (let i = 0; i < tabs.length; i++) {
        const tabName = tabs[i];
        let filteredLeads = myLeads;
        if (tabName !== "all") {
            filteredLeads = myLeads.filter((lead) => {
                const leadTab = lead.tab.toLowerCase().replace(/\s/g, "-");
                return leadTab === tabName;
            });
        }
        listItems += `
      <li>
        <button class="tab-btn ${tabName === activeTab ? 'active' : ''}" data-tab="${tabName.toLowerCase().replace(/\s/g, "-")}">${tabName} ${filteredLeads.length}</button>
        <button class="delete-item-btn" onclick="deleteTabs(${i}, '${tabName}')">&times;</button>
      </li>
    `;
    }
    ulEl.innerHTML = listItems;
}

function deleteLead(index, tab) {
    myLeads.splice(index, 1);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads, tab);
}

function deleteTabs(index, tab) {
    myTabs.splice(index, 1);
    saveTabs(); // Save the updated tabs
    renderTab(myTabs, tab);
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear();
    myLeads = [];
    render(myLeads, activeTab);
});

function saveLeads() {
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
}

inputBtn.addEventListener("click", function() {
    const url = inputEl.value.trim();
    if (url) {
        const lead = {
            url,
            tab: activeTab
        };
        myLeads.push(lead);
        saveLeads(); // Save the updated leads
        render(myLeads, activeTab);
    }
    inputEl.value = "";
});

function addTab() {
    const tabName = inputEl.value.trim();
    if (tabName && !myTabs.includes(tabName)) {
        myTabs.push(tabName);
        saveTabs(); // Save the updated tabs
        renderTab(myTabs); // Render the updated tabs
    }
    inputEl.value = "";
}

addTabButton.addEventListener("click", addTab);