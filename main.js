class Main {
    static SELECTORS_POT    = ["#pavilionOpenTime .am input", "#pavilionOpenTime .pm input"];
    static SELECTOR_LNATT   = "#lastNATTime input";
    static SELECTOR_PRD     = "#predictedResultDelay input";
    static SELECTOR_NNATT   = "#nextNATTime input";
    static SELECTOR_NNATD   = "#nextNATTime label";
    static SELECTOR_CALC    = "#lastNATTime button";
    static SELECTOR_WXG     = "#wxGuide";
    static SELECTORS_SSB    = "#shaismy a";
    static SELECTORS_EDBM   = "#expiryDateBar meter";
    static SELECTORS_EDBT   = "#expiryDateBar span";

    #scheduler;

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
        // Weixin Guide
        if (/micromessenger/.test(navigator.userAgent.toLocaleLowerCase())){
            this.#addWXGuide();
        }
        // Add listener
        document.querySelector(Main.SELECTOR_CALC).addEventListener("click", event => {
            this.#calculate();
        });
        // Run once
        this.#calculate();

    }

    #calculate(){
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
            let date = new Date(this.#scheduler.calcNextNATTime());
            document.querySelector(Main.SELECTOR_NNATT).value = this.#getISOLocalDate(date);
            document.querySelector(Main.SELECTOR_NNATD).innerHTML = this.#getLocalDay(date);
            //Update expiry bar
            let leftTime = this.#scheduler.getLeftTime();
            document.querySelector(Main.SELECTORS_EDBT).innerHTML = leftTime;
            document.querySelector(Main.SELECTORS_EDBM).value = leftTime;
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

    #addWXGuide(){
        //Portals click
        document.querySelectorAll(Main.SELECTORS_SSB).forEach(element => {
            element.addEventListener("click", event => {
                event.preventDefault();
                document.querySelector(Main.SELECTOR_WXG).style.display = "block";
            });
        });
        //Hide guide
        document.querySelector(Main.SELECTOR_WXG).addEventListener("click", event => {
            event.currentTarget.style.display = "none";
        });
    }
}

new Main();