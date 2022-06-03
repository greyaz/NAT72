class Scheduler {
    static VALIDITY_HOURS = 72;
    // static WAITING_MINUTES = 30;

    #pavilionOpenTime;
    #lastNATTime;
    #predictedResultDelay;
    #regularGoOutTime;

    constructor(pavilionOpenTime, lastNATTime, predictedResultDelay, regularGoOutTime){
        this.#pavilionOpenTime      = pavilionOpenTime;
        this.#lastNATTime           = lastNATTime;
        this.#predictedResultDelay  = predictedResultDelay;
        this.#regularGoOutTime      = regularGoOutTime;
    }

    calcNextNATTime(){
        let nextTime;
        let timeWindows = [];

        let targetTime = new Date(this.#lastNATTime);
        let goOutTime = new Date(targetTime);

        goOutTime.setHours(Number(this.#regularGoOutTime.split(":")[0]));
        goOutTime.setMinutes(Number(this.#regularGoOutTime.split(":")[1]));

        let gapTime = goOutTime - targetTime;

        targetTime.setHours(
            targetTime.getHours() + Scheduler.VALIDITY_HOURS - this.#predictedResultDelay
        );

        if (gapTime < 0){
            targetTime.setTime(targetTime.getTime() + gapTime);
        }

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

        return nextTime;
        //return nextTime.setMinutes(nextTime.getMinutes() - Scheduler.WAITING_MINUTES);
    }

    

}
