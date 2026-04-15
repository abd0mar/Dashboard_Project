// ========================
// Fetching sidebar, navbar
// ========================

async function loadNav(){
  try{
    let response = await fetch(`global.html`);
    let htmlText = await response.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlText, "text/html");
    let selectNav = doc.querySelector("nav")
    let selectSideBar = doc.querySelector(".sidebar")

    document.querySelector(".page .sections-container").prepend(selectNav);
    document.querySelector(".page").prepend(selectSideBar)

    let windowUrl = window.location.pathname.split("/")
    let pageName = windowUrl[windowUrl.length - 1].split(".")[0].toLowerCase()
    
    let links = document.querySelectorAll(".pagesLinks li")

    // User Name
    let span = document.querySelector("#username")
    let userNamels = JSON.parse(localStorage.getItem("info"));
    if(userNamels){
      span.textContent = userNamels.fullName;
    }

    links.forEach(e => {
      e.classList.remove("active")
      if(pageName.endsWith(e.dataset.link)){
        e.classList.add("active")
      }
    })
    if(pageName === ""){
        let indexFile = document.querySelector(`.pagesLinks li[data-link="index"]`)
        indexFile.classList.add("active")
      }

    document.querySelector(".page").classList.add("ready")
    new NotificationManager()
    new Style()
    new infoSetting()

  } catch(error){
    console.error("Fetch is unloaded")
  }
}
loadNav()

// ========================
//Sidebar
// ========================
class Sidebar{
  constructor(){
    this.icon = document.querySelector(".sidebar-icon")
  }
  init(){
    this.icon.addEventListener("click", () =>{
      this.sidebar();
      this.iconPos();
    })
  }
  
  sidebar(){
    let media = window.matchMedia("(max-width: 640px)")
    let sidebar = document.querySelector(".sidebar")
    if(media.matches){
      if(!sidebar.classList.contains("show")){
        sidebar.classList.add("show")
      }else{
        sidebar.classList.remove("show")
      }
    }
  }
}
new Sidebar().init()


// ========================
//Notification Btn
// ========================
  class NotificationManager{
    constructor(){
    this.icon = document.querySelector("#notifications-icon")
    this.menu = document.querySelector("#notifications-menu")
    this.body = document.querySelector("#notifications-body")
    this.init()
  }
  //Methods
  init(){
    this.toggleMenu()
    this.unreadChk();
    this.removeMsg();
    this.msgChk();
  }
  toggleMenu(){
    this.icon.addEventListener("click", () => {
      this.menu.classList.toggle("active");
    })
    document.addEventListener("click", (e) => {
      if(!e.target.closest(`#${this.menu.id}`) && !e.target.closest(`#${this.icon.id}`) ){
        this.menu.classList.remove("active");
      }
    })
  }
  unreadChk(){
    let messages  = this.menu.querySelectorAll(".msg")
    messages .forEach(msg => {
      msg.addEventListener("click", () => {
        if(msg.classList.contains("unread")){
          msg.classList.remove("unread");
        }
      })
    })
  }
  removeMsg(){
    let trash = document.querySelectorAll(".trash")
    trash.forEach(e => {
      e.addEventListener("click", (ele) => {
        ele.stopPropagation()
        ele.target.closest(".msg").remove();
        this.msgChk();
      })
    })
  }
  msgChk(){
    let messages  = this.menu.querySelectorAll(".msg")
    if(messages .length === 0){
      let mySpan = document.createElement("span");
      mySpan.className = "empty-menu";
      mySpan.textContent = "There are no messages right now";
      this.body.appendChild(mySpan);
    }
  }
}



// ========================
//Theme
// ========================
class Style{
  constructor(){
    this.iconDiv = document.querySelector(".darkmode-btn")
    this.icon = document.querySelector(".darkmode-btn > i")
    this.init()
  }
  //Methods
  init(){
    let chkLocalStorage = localStorage.getItem("style") || "light";
    this.updateIcon(chkLocalStorage)
    
    this.iconDiv.addEventListener("click", () => {
      this.styleToggle()
    })
  }
  styleToggle(){
      if(document.documentElement.dataset.theme === "light"){
        document.documentElement.dataset.theme = "dark";
      }else{
        document.documentElement.dataset.theme= "light";
      }
      localStorage.setItem("style", document.documentElement.dataset.theme)

      this.updateIcon(document.documentElement.dataset.theme)
  }
  updateIcon(state){
    if(state === "dark"){
      this.icon.classList.remove("fa-moon")
      this.icon.classList.add("fa-sun")
    }else{
      this.icon.classList.remove("fa-sun")
      this.icon.classList.add("fa-moon")
    }
  }
}


// ========================
// tasks checkbox
// ========================
let checkbox = document.querySelectorAll(".tasks .task-checkbox")
if(checkbox){
  checkbox.forEach((e) => {
    function taskCheckbox(){
      e.parentElement.classList.toggle("done")
    }
    e.addEventListener("change", () => taskCheckbox())
  })
}




// ========================
//ُProfile Setting
// ========================
class infoSetting{
  constructor(){
    this.saveBtn = document.querySelector("#save-info-btn")
    this.inputs = document.querySelectorAll(".info .info-input")
    this.userNameSpan = document.querySelector("#username")

    this.patterns = {
      "fullName": /^([a-zA-Z]\w{2,10})\s([a-zA-Z]\w{2,10})$/,
      "email": /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/,
    }

    this.info = {}

    this.init()
  }
  init(){
    if(this.saveBtn && this.inputs && this.userNameSpan){
      this.saveBtn.addEventListener("click", () => this.validationChk())
      this.updatingValues()
    }
  }
  updatingValues(){
    // Profile Info
    let userNameInput = document.querySelector(`.info .info-input[data-type="fullName"]`)
    let emailInput = document.querySelector(`.info .info-input[data-type="email"]`)
    let infoLs = JSON.parse(localStorage.getItem("info"));
    if(infoLs){
      userNameInput.value = infoLs.fullName;
      emailInput.value = infoLs.email;
    }
  }
  validationChk(){
    this.inputs.forEach(input => {
      let pattern = this.patterns[input.dataset.type];
      if(!pattern) return;
      input.classList.remove("invalid");
      if(pattern.test(input.value)){
        this.info[input.dataset.type] = input.value
      }else{
        this.info[input.dataset.type] = "invalid"
        input.classList.add("invalid");
      }
    })
      if(Object.values(this.info).length > 0 && !Object.values(this.info).includes("invalid")){
        // let userName = this.info.fullName.split(" ").map((word) => (word[0].toUpperCase() + word.slice(1 , word.length))).join(" ")
        this.info.fullName = this.info.fullName.split(" ").map((word) => (word[0].toUpperCase() + word.slice(1 , word.length))).join(" ")
        // localStorage.setItem("userName", userName);
        this.userNameSpan.textContent = this.info.fullName;

        localStorage.setItem("info", JSON.stringify(this.info))
      }
  }
}


// ========================
//Widgets Control
// ========================
class WidgetsControl{
  constructor(){
    this.options = document.querySelectorAll(".widgets-control .opt input");
    this.widgets = document.querySelectorAll(".widget");
    this.init()
  }
  init(){
    this.updatingWidgets();
    this.updatingCheckboxes();
    this.uploadInputs();
  }
  getWidgets(){
    return JSON.parse(localStorage.getItem("widgets"));
  } 

  uploadInputs(){
    let values = {}
    this.options.forEach(opt => {
      values[opt.dataset.widget] = opt.checked
    })
    this.options.forEach(opt => {
      opt.addEventListener("change", () => {
        values[opt.dataset.widget] = opt.checked
        localStorage.setItem("widgets", JSON.stringify(values))
      })
    })
  }

  updatingCheckboxes(){
    let ls = this.getWidgets()
    if(!ls) return
    this.options.forEach(e => {
        e.checked = ls[e.dataset.widget]
    })
  }

  updatingWidgets(){
    let ls = this.getWidgets()
    if(!ls) return
    this.widgets.forEach(wid => {
      if(ls[wid.dataset.widget] !== true){
        wid.style.display = "none";
      }
    })
  }
}
new WidgetsControl();





// ========================
//Projects search
// ========================

class searchParent{
  constructor(searchInput, filter, container, url){
    this.search = document.querySelector(searchInput);
    this.filter = document.querySelector(filter);
    this.container = document.querySelector(container);
    this.url = url;
    this.ele = [];
  }
    async init(){
      await this.fetchData(this.url);

      if(this.search  && this.filter && this.container){
      //Search
      this.renderDefault();
      this.search.addEventListener("input", () => {
        this.container.innerHTML =""
        if(this.search.value === ""){
          this.renderDefault();
        }else{
          let filteredObjects = this.projects.filter(project => project.title.toLowerCase().includes((this.search.value).toLowerCase()))
          filteredObjects.forEach(e => {
            this.render(e);
          })
        }
      })

      //Filter
      this.filter.addEventListener("change", () => {
        this.container.innerHTML =""
        if(this.filter.value.toLowerCase() === "all"){
          this.renderDefault();
        }else{
          let filteredObjects = this.projects.filter(project => project.status.toLowerCase().includes((this.filter.value).toLowerCase()))
          filteredObjects.forEach(e => {
            this.render(e);
          })
        }
      })
    }

    if(this.tableBody){
      // Table
      this.ele.forEach(e => {
        this.tableRendering(e);
      })
    } 

  }
  async fetchData(url){
    try{
      let result = await fetch(url);
      let jsText = await result.json();
      this.ele.push(...jsText);
    }catch(error) {
      console.log(Error(error));
    }
  }

  renderDefault(){
    this.ele.forEach(e => {
      this.render(e);
    })
  }
  
}

class ProjectsSearch extends searchParent{
  constructor(searchInput, filter, container){
    super(searchInput, filter, container, "json/projects.json")
    //Section Elements

    this.ele = [];

    // this.projects = [
    //   { title: "Finance App",date: "15 Mar 2026",client: "Bouba",price: "$5,000",status: "Pending",progress: "80",description: "A mobile banking app with real-time analytics, budget tracking, and secure transaction history"},
    //   { title: "Support Portal",date: "20 Apr 2026",client: "Tech Co",price: "$3,500",status: "In Progress",progress: "75",description: "A customer support ticketing system with live chat, priority queues, and agent dashboards."},
    //   { title: "Dashboard UI",date: "05 Feb 2026",client: "Moamen",price: "$1,200",status: "Completed",progress: "90",description: "A clean admin dashboard with data visualizations, user management, and reporting tools."},
    //   { title: "Old Website",date: "10 Jan 2026",client: "Private",price: "	$800",status: "Rejected",progress: "95",description: "A legacy website redesign project — archived due to client-side scope changes."},
    //   { title: "Mobile App UI",date: "18 May 2026",client: "FitLife",price: "$2,900",status: "In Progress",progress: "100",description: "A fitness tracking app UI with workout plans, progress charts, and social challenges."},
    //   { title: "Security Audit",date: "25 Jun 2026",client: "NetSecure",price: "$4,100",status: "Pending",progress: "85",description: "A full security audit and penetration testing report for a financial SaaS platform."},
    //   { title: "E-Commerce Migration",date: "12 Jul 2026",client: "ShopSphere",price: "$5,500",status: "In Progress",progress: "60",description: "Migrating a legacy monolithic store to a modern headless architecture using Next.js."},
    //   { title: "Mobile App Redesign",date: "05 Aug 2026",client: "FitTrack",price: "$3,200",status: "Completed",progress: "100",description: "Complete UI/UX overhaul of the fitness tracking app to improve user retention."},
    //   { title: "Cloud Infrastructure Setup",date: "18 Sep 2026",client: "DataStream AI",price: "$7,800",status: "Pending",progress: "15",description: "Designing and deploying a scalable AWS infrastructure with automated CI/CD pipelines."},
    //   { title: "Custom CRM Dashboard",date: "14 Nov 2026",client: "Elite Real Estate",price: "$6,000",status: "In Progress",progress: "45",description: "Developing a bespoke management dashboard for lead tracking and agent performance."}
    // ];

    this.statusMap = {
      "completed":  { bg: "var(--bg-green)",  color: "var(--green-color)",  bar: "linear-gradient(90deg, #71717A, #71717A80)" },
      "pending":    { bg: "var(--bg-orange)", color: "var(--orange-color)", bar: "linear-gradient(90deg, #FBBF24, #FBBF2480)" },
      "in progress":{ bg: "var(--bg-blue)",   color: "var(--accent-color)", bar: "linear-gradient(90deg, #6366F1, #6366f180)" },
      "rejected":   { bg: "var(--bg-red)",    color: "var(--red-color)",    bar: "linear-gradient(90deg, #EF4444, #EF444480)" },
    };


    //Table Elements
    this.tableBody = document.querySelector("#table > tbody")

    this.init()
  }

  render(object){
    let colors = this.statusMap[object.status.toLowerCase()];
    let project = document.createElement("div");
    project.className = "project p-20 v-stack gap-15";
    project.innerHTML =`
      <div class="status">
        <span style="background:${colors.bg}; color:${colors.color}">${[object.status]}</span>
      </div>
      <div class="title">
        <h2 class="text-heading mb-5">${object.title}</h2>
        <span class="text-body">${object.description}</span>
      </div>
      <div class="info d-grid txt-c p-10">
        <div>
          <span class="text-body">CLIENT</span>
          <h3 class="text-heading">${object.client}</h3>
        </div>
        <div>
          <span class="text-body">PRICE</span>
          <h3 class="text-heading" style="color: var(--green-color)">${object.price}</h3>
        </div>
      </div>
      <div class="progress">
        <div class="d-flex space-between">
          <span class="text-body mb-5">Progress</span>
          <span class="progress-percentage" style="color: ${colors.color}">${object.progress}%</span>
        </div>
        <div class="progress-bar p-relative">
          <div class="p-absolute" style="width: ${object.progress}%; background: ${colors.bar}"></div>
        </div>
      </div>
      <div class="date d-flex gap-5 align-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-body lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
        <span class="text-body"> ${object.date}</span>
      </div>
      <div>
      </div>
    `;
    this.container.append(project)
  }

  tableRendering(projects){
    let colors = this.statusMap[projects.status.toLowerCase()];
    let myTr = document.createElement("tr");
    myTr.innerHTML = `
      <td>${projects.title}</td>
      <td>${projects.date}</td>
      <td>${projects.client}</td>
      <td>${projects.price}</td>
      <td class="images">
        <img src="assets/images/team-01.png" alt="Team member">
        <img src="assets/images/team-02.png" alt="Team member">
      </td>
      <td>
        <span style="background: ${colors.bg}; color: ${colors.color}">
          ${projects.status}
        </span>
      </td>
    `;
    this.tableBody.append(myTr);
  }
}
new ProjectsSearch("#projects-search-input", "#projects-filter", "#projects-container")

class TeamSearch extends searchParent{
  constructor(searchInput, filter, container){
    super(searchInput, filter, container, "json/team.json")


    this.ele = []
    // this.ele = [
    //   { title: "Abdoulrhman Omar", position: "Project Manager", email: "abdo.o@company.com" ,projects: "10" ,status: "Ofline", id: "1"},
    //   { title: "Moamen Ashrf", position: "Fullstack Developer", email: "moamen.a@company.com" ,projects: "9" ,status: "Online", id: "2"},
    //   { title: "Ahmed Mohamed", position: "Backend Developer", email: "ahmed.m@company.com" ,projects: "10" ,status: "Away", id: "3"},
    //   { title: "Osama Mohamed", position: "Fronend Developer", email: "abdo.o@company.com" ,projects: "7" ,status: "Ofline", id: "4"},
    //   { title: "Abdullah Saed", position: "UI/UX Designer", email: "abdo.o@company.com" ,projects: "11" ,status: "Online", id: "5"},
    //   { title: "Hussen Ashraf", position: "Marketing Specialist", email: "abdo.o@company.com" ,projects: "10" ,status: "Online", id: "6"},
    // ]

    this.statusMap = {
      "away": { bg: "var(--bg-orange)",  color: "var(--orange-color)"},
      "online": { bg: "var(--bg-green)", color: "var(--green-color)"},
      "ofline": { bg: "var(--bg-red)",   color: "var(--red-color)"},
    };

    this.init()
  }

  render(object){
    let colors = this.statusMap[object.status.toLowerCase()];
    let project = document.createElement("div");
    project.className = "member p-20";
    project.innerHTML =`
      <div class="head gap-15 d-flex align-center mb-20">
        <div class="pic">
          <img src="assets/images/profile-team-${object.id}.jpg" alt="">
        </div>
        <div class="name">
          <h2 class="text-heading mb-5">${object.title}</h2>
          <span class="text-body">${object.position}</span>
        </div>
      </div>
      <div class="info text-body mb-15 pb-15">
        <div class="mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
          <span>${object.email}</span> 
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-icon lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
          <span>${object.projects} Projects</span>
        </div>
      </div>
      <div class="member-status" style="background-color: ${colors.bg};">
        <div style="background-color: ${colors.color};"></div>
        <span style="color: ${colors.color};">${object.status}</span>
      </div>
    `;
    this.container.append(project)
  }
}

new TeamSearch("#team-search-input", "#team-filter", "#team-container")