class Main {
    static SELECTORS_POT    = ["#pavilionOpenTime .am input", "#pavilionOpenTime .pm input"];
    static SELECTOR_LNATT   = "#lastNATTime input";
    static SELECTOR_PRD     = "#predictedResultDelay input";
    static SELECTOR_RGOT    = "#regularGoOutTime input";
    static SELECTOR_NNATT   = "#nextNATTime input";
    static SELECTOR_CALC    = "#nextNATTime button";

    #scheduler;

    constructor(){
        // Init UI
        if (localStorage.getItem("lastNATTime")){
            this.#setDateTime(Main.SELECTOR_LNATT, localStorage.getItem("lastNATTime"));
        }
        else {
            this.#setDateTime(Main.SELECTOR_LNATT, this.#getISOLocalDate(new Date()));
        }
        // this.#getPredictedResultDelay(Main.SELECTOR_PRD) = localStorage.getItem("predictedResultDelay");
        // this.#getRegularGoOutTime(Main.SELECTOR_RGOT) = localStorage.getItem("regularGoOutTime");
        this.#initCalcBtn(Main.SELECTOR_CALC);
    }

    #initCalcBtn(selector){
        document.querySelector(selector).addEventListener("click", (event) => {
            // Save Data
            this.#saveData();

            // Init Scheduler
            /*this.#scheduler = new Scheduler(
                this.#getPavilionOpenTime(Main.SELECTORS_POT),
                this.#getLastNATTime(Main.SELECTOR_LNATT),
                this.#getPredictedResultDelay(Main.SELECTOR_PRD),
                this.#getRegularGoOutTime(Main.SELECTOR_RGOT)
            );*/
            this.#scheduler = new Scheduler(
                localStorage.getItem("pavilionOpenTime").split(","),
                localStorage.getItem("lastNATTime"),
                localStorage.getItem("predictedResultDelay"),
                localStorage.getItem("regularGoOutTime")
            );

            if (this.#scheduler){
                let date = new Date(this.#scheduler.calcNextNATTime());
                this.#setDateTime(Main.SELECTOR_NNATT, this.#getISOLocalDate(date));
            }
        });
    }

    #getPavilionOpenTime(selectors){
        let openTime = [];
        selectors.forEach(element => {
            document.querySelectorAll(element).forEach(element => {
                openTime.push(element.value);
            });
        });

        return openTime;
    }

    #getLastNATTime(selector){
        return document.querySelector(selector).value;
    }

    #getPredictedResultDelay(selector){
        return document.querySelector(selector).value;
    }

    #getRegularGoOutTime(selector){
        return document.querySelector(selector).value;
    }

    #getISOLocalDate(date){
        return  `${date.getFullYear()}-`+
                `${date.getMonth() + 1}`.padStart(2, "0")+`-`+
                `${date.getDate()}`.padStart(2, "0")+`T`+
                `${date.getHours()}`.padStart(2, "0")+`:`+
                `${date.getMinutes()}`.padStart(2, "0");
    }

    #setDateTime(selector, value){
        document.querySelector(selector).value = value;
    }

    #saveData(){
        localStorage.setItem("pavilionOpenTime", this.#getPavilionOpenTime(Main.SELECTORS_POT));
        localStorage.setItem("lastNATTime", this.#getLastNATTime(Main.SELECTOR_LNATT));
        localStorage.setItem("predictedResultDelay", this.#getPredictedResultDelay(Main.SELECTOR_PRD));
        localStorage.setItem("regularGoOutTime", this.#getRegularGoOutTime(Main.SELECTOR_RGOT));
    }
}

new Main();