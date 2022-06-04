class Scheduler {
    static VALIDITY_HOURS = 72;

    #pavilionOpenTime;
    #lastNATTime;
    #predictedResultDelay;

    constructor(pavilionOpenTime, lastNATTime, predictedResultDelay){
        this.#pavilionOpenTime      = pavilionOpenTime;
        this.#lastNATTime           = lastNATTime;
        this.#predictedResultDelay  = predictedResultDelay;
    }

    calcNextNATTime(){
        let nextTime;
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
            nextTime = timeWindows[3];
        }
        else if(targetTime >= timeWindows[1] && targetTime < timeWindows[2]){
            nextTime = timeWindows[1];
        }
        else if(targetTime < timeWindows[0]){
            let _time = new Date(timeWindows[3]);
            _time.setDate(_time.getDate() - 1);
            nextTime = _time;
        }
        else {
            nextTime = targetTime;
        }
        // adjust time if expired
        if (nextTime <= now){
            if (now >= timeWindows[3]){
                let _time = new Date(timeWindows[0]);
                _time.setDate(_time.getDate() + 1);
                nextTime = _time;
            }
            else if (now >= timeWindows[1] && now < timeWindows[2]){
                nextTime = timeWindows[2];
            }
            else if (now < timeWindows[0]){
                nextTime = timeWindows[0];
            }
            else {
                nextTime = now;
            }
        }
        // return result
        return nextTime;
    }

    getLeftTime(){
        let lastTime = new Date(this.#lastNATTime);
        let now = new Date();
        let time = (now - lastTime) / 1000 / 60 / 60;
        return Math.round((Scheduler.VALIDITY_HOURS - time) * 10) / 10;
    }
}
