class Main {
    static SELECTORS_POT    = ["#pavilionOpenTime .am input", "#pavilionOpenTime .pm input"];
    static SELECTOR_LNATT   = "#lastNATTime input";
    static SELECTOR_PRD     = "#predictedResultDelay input";
    static SELECTOR_NNATT   = "#nextDate";
    static SELECTOR_NNATD   = "#nextDay";
    static SELECTOR_CALC    = "#lastNATTime button";
    static SELECTOR_SSB    = "#shaismy";
    static SELECTORS_EDBM   = "#expiryDateBar meter";
    static SELECTORS_EDBT   = "#expiryDateBar span";
    static SELECTORS_ATC    = "#addToCal";
    static SELECTOR_SSB2    = "#ssbQRcode";

    #scheduler;
    #calConfig = {
        name:"核酸检测",
        options:["Apple", 'Google', 'Microsoft365', 'Outlook.com', 'MicrosoftTeams', 'Yahoo', "iCal|通用"],
        timeZone:"Asia/Shanghai",
        iCalFileName: "核酸提醒"
    };

    constructor(){
        // Init UI
        if (localStorage.getItem("pavilionOpenTime")){
            this.#pavilionOpenTime = localStorage.getItem("pavilionOpenTime").split(",");
        }
        if (localStorage.getItem("lastNATTime")){
            this.#lastNATTime = localStorage.getItem("lastNATTime");
        }
        else {
            this.#lastNATTime = this.#getISOLocalDate(new Date());
        }
        if (localStorage.getItem("predictedResultDelay")){
            this.#predictedResultDelay = localStorage.getItem("predictedResultDelay");
        }
        // Init Cal Btn
        let calBtn = document.querySelector(Main.SELECTORS_ATC);
        calBtn.addEventListener('click', () => atcb_action(this.#calConfig, calBtn))
        
        // Weixin handler
        if (/micromessenger/.test(navigator.userAgent.toLocaleLowerCase())){
            this.#showWXContent();
        }
        // Add listener
        document.querySelector(Main.SELECTOR_CALC).addEventListener("click", event => {
            this.#update();
        });
        // Update once
        this.#update();

    }

    #update(){
        // Save Data
        this.#saveData();
        // Init Scheduler
        this.#scheduler = new Scheduler(
            localStorage.getItem("pavilionOpenTime").split(","),
            localStorage.getItem("lastNATTime"),
            localStorage.getItem("predictedResultDelay"),
        );
        // Show date
        if (this.#scheduler){
            let date = this.#scheduler.getNextNATTime();
            let dateISOString= this.#getISOLocalDate(date);
            document.querySelector(Main.SELECTOR_NNATT).innerHTML = dateISOString.replace("T", " ");
            document.querySelector(Main.SELECTOR_NNATD).innerHTML = this.#getLocalDay(date);
            // Update expiry bar
            let leftTime = this.#scheduler.getLeftHours();
            document.querySelector(Main.SELECTORS_EDBT).innerHTML = leftTime;
            document.querySelector(Main.SELECTORS_EDBM).value = leftTime;
            // config calendar reminder content
            let reminderTime = this.#scheduler.getReminderTime();
            if (reminderTime){
                this.#calConfig.startDate = this.#getISOLocalDate(reminderTime);
            }
            else {
                this.#calConfig.startDate = dateISOString;
            }
            this.#calConfig.endDate = dateISOString;
        }
    }

    get #pavilionOpenTime(){
        let openTime = [];
        Main.SELECTORS_POT.forEach(element => {
            document.querySelectorAll(element).forEach(element => {
                openTime.push(element.value);
            });
        });
        return openTime;
    }

    set #pavilionOpenTime(timeArray){
        let index = 0;
        Main.SELECTORS_POT.forEach(element => {
            document.querySelectorAll(element).forEach(element => {
                element.value = timeArray[index];
                index++;
            });
        });
    }

    get #lastNATTime(){
        return document.querySelector(Main.SELECTOR_LNATT).value;
    }

    set #lastNATTime(value){
        document.querySelector(Main.SELECTOR_LNATT).value = value;
    }

    get #predictedResultDelay(){
        return document.querySelector(Main.SELECTOR_PRD).value;
    }

    set #predictedResultDelay(value){
        document.querySelector(Main.SELECTOR_PRD).value = value;
    }

    #getISOLocalDate(date){
        return  `${date.getFullYear()}-`+
                `${date.getMonth() + 1}`.padStart(2, "0")+`-`+
                `${date.getDate()}`.padStart(2, "0")+`T`+
                `${date.getHours()}`.padStart(2, "0")+`:`+
                `${date.getMinutes()}`.padStart(2, "0");
    }

    #getLocalDay(date){
        let dayList = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
        return dayList[date.getDay()];
    }

    #saveData(){
        localStorage.setItem("pavilionOpenTime", this.#pavilionOpenTime);
        localStorage.setItem("lastNATTime", this.#lastNATTime);
        localStorage.setItem("predictedResultDelay", this.#predictedResultDelay);
    }
    #showWXContent(){
        document.querySelector(Main.SELECTOR_SSB2).style.display = "block";
        document.querySelector(Main.SELECTOR_SSB).style.display = "none";
    }
}

new Main();