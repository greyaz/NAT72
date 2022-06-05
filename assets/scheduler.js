class Scheduler {
    static VALIDITY_HOURS = 72;
    static ADVACE_REMINDER_HOURS = 1;

    #pavilionOpenTime;
    #lastNATTime;
    #predictedResultDelay;
    #nextNATTime;

    constructor(pavilionOpenTime, lastNATTime, predictedResultDelay){
        this.#pavilionOpenTime      = pavilionOpenTime;
        this.#lastNATTime           = lastNATTime;
        this.#predictedResultDelay  = predictedResultDelay;
    }

    getNextNATTime(){
        let now = new Date();
        let targetTime = new Date(this.#lastNATTime);
        let timeWindows = [];
        // set target time
        targetTime.setHours(
            targetTime.getHours() + Scheduler.VALIDITY_HOURS - Number(this.#predictedResultDelay)
        );
        // init time windows
        let windowTime = targetTime > now ? targetTime : now;
        this.#pavilionOpenTime.forEach(element => {
            windowTime = new Date(  
                windowTime.getFullYear(),                 
                windowTime.getMonth(),                       
                windowTime.getDate(),                     
                Number(element.split(":")[0]),                      
                Number(element.split(":")[1])
            );
            timeWindows.push(windowTime);
        });
        // calculate next time
        if (targetTime >= timeWindows[3]){
            this.#nextNATTime = timeWindows[3];
        }
        else if(targetTime >= timeWindows[1] && targetTime < timeWindows[2]){
            this.#nextNATTime = timeWindows[1];
        }
        else if(targetTime < timeWindows[0]){
            let _time = new Date(timeWindows[3]);
            _time.setDate(_time.getDate() - 1);
            this.#nextNATTime = _time;
        }
        else {
            this.#nextNATTime = targetTime;
        }
        // adjust time if expired
        if (this.#nextNATTime <= now){
            if (now >= timeWindows[3]){
                let _time = new Date(timeWindows[0]);
                _time.setDate(_time.getDate() + 1);
                this.#nextNATTime = _time;
            }
            else if (now >= timeWindows[1] && now < timeWindows[2]){
                this.#nextNATTime = timeWindows[2];
            }
            else if (now < timeWindows[0]){
                this.#nextNATTime = timeWindows[0];
            }
            else {
                this.#nextNATTime = now;
            }
        }
        // return result
        return new Date(this.#nextNATTime);
    }

    getLeftHours(){
        let lastTime = new Date(this.#lastNATTime);
        let now = new Date();
        let time = (now - lastTime) / 1000 / 60 / 60;
        return Math.round((Scheduler.VALIDITY_HOURS - time) * 10) / 10;
    }

    getReminderTime(){
        if (this.#nextNATTime){
            let date = new Date(this.#nextNATTime);
            date.setHours(date.getHours() - Scheduler.ADVACE_REMINDER_HOURS);
            return date;
        }
        return null;
    }
}
