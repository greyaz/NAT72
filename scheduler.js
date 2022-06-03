class Scheduler {
    static VALIDITY_HOURS = 72;

    #pavilionOpenTime;
    #lastNATTime;
    #predictedResultDelay;
    #now;

    constructor(pavilionOpenTime, lastNATTime, predictedResultDelay){
        this.#pavilionOpenTime      = pavilionOpenTime;
        this.#lastNATTime           = lastNATTime;
        this.#predictedResultDelay  = predictedResultDelay;
    }

    getNextNATTime(){
        let nextTime;
        let lastTime = new Date(this.#lastNATTime);

        this.#now = new Date();
        let minLastTime = new Date(this.#now);
        minLastTime.setHours(
            minLastTime.getHours() - Scheduler.VALIDITY_HOURS + Number(this.#predictedResultDelay)
        );

        if (lastTime < minLastTime){
            nextTime = this.#calcNextNATTime(minLastTime);
        }
        else {
            nextTime = this.#calcNextNATTime(lastTime);
        }
        
        return nextTime;
    }

    #calcNextNATTime(lastTime){
        let nextTime;
        let targetTime = lastTime;
        let timeWindows = [];
        // set target time
        targetTime.setHours(
            targetTime.getHours() + Scheduler.VALIDITY_HOURS - Number(this.#predictedResultDelay)
        );
        // init time windows
        this.#pavilionOpenTime.forEach(element => {
            let time = new Date(  
                targetTime.getFullYear(),                 
                targetTime.getMonth(),                       
                targetTime.getDate(),                     
                Number(element.split(":")[0]),                      
                Number(element.split(":")[1])
            );
            timeWindows.push(time);
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
        if (nextTime <= this.#now){
            if (this.#now >= timeWindows[3]){
                let _time = new Date(timeWindows[0]);
                _time.setDate(_time.getDate() + 1);
                nextTime = _time;
            }
            else if (this.#now >= timeWindows[1] && this.#now < timeWindows[2]){
                nextTime = timeWindows[2];
            }
            else if (this.#now < timeWindows[0]){
                nextTime = timeWindows[0];
            }
            else {
                nextTime = this.#now;
            }
        }
        // return result
        return nextTime;
    }
}
