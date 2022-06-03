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
        this.#setDateTime(Main.SELECTOR_LNATT, this.#getISOLocalDate(new Date()));
        this.#initCalcBtn(Main.SELECTOR_CALC);
    }

    #initCalcBtn(selector){
        document.querySelector(selector).addEventListener("click", (event) => {
            // Init Scheduler
            this.#scheduler = new Scheduler(
                this.#getPavilionOpenTime(Main.SELECTORS_POT),
                this.#getLastNATTime(Main.SELECTOR_LNATT),
                this.#getPredictedResultDelay(Main.SELECTOR_PRD),
                this.#getRegularGoOutTime(Main.SELECTOR_RGOT)
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
}

new Main();