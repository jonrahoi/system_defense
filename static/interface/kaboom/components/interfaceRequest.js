import k from '../kaboom.js';



const COLOR_SIGNALS = {
    SPAWNED: (percent) => k.color(252, 229, 144),
    INTRANSIT: (percent) => {
        if (percent < 0.2) { return k.color(210, 222, 129); }
        if (percent < 0.4) { return k.color(166, 222, 129); }
        if (percent < 0.6) { return k.color(129, 219, 101); }
        if (percent < 0.8) { return k.color(65, 204, 70); }
        return k.color(0, 189, 31);
    },
    PROCESSING: (percent) => {
        if (percent < 0.2) { return k.color(210, 222, 129); }
        if (percent < 0.4) { return k.color(166, 222, 129); }
        if (percent < 0.6) { return k.color(129, 219, 101); }
        if (percent < 0.8) { return k.color(65, 204, 70); }
        return k.color(0, 189, 31);
    },
    BLOCKED: (percent) => {
        if (percent < 0.2) { return k.color(196, 209, 82); }
        if (percent < 0.4) { return k.color(209, 177, 82); }
        if (percent < 0.6) { return k.color(207, 119, 52); }
        if (percent < 0.8) { return k.color(207, 73, 52); }
        return k.color(191, 25, 25);
    },
    COMPLETED: (percent) => k.color(117, 189, 36),
    TIMEDOUT: (percent) => k.color(0, 0, 0),
    KILLED: (percent) => k.color(0, 0, 0)
};



export default function InterfaceRequest(initState) {

    let id = initState.uuid;
    let age = initState.age;
    let stateName = initState.stateName;
    let isResponse = false;
    let currProgress = 0.0;
    let currComponentID = initState.currComponentID;
    let nextComponentID = null;
    let currConnection = null;

    return {
        uuid: initState.uuid,

        getID() {
            return id;
        },
        getState() {
            return stateName;
        },
        isState(test) {
            return stateName == test;
        },
        setConnection(cnx) {
            currConnection = cnx;
        },
        unsetConnection() {
            currConnection = null;
        },
        stateChange(newState) {
            age = newState.age;
            stateName = newState.stateName;
            currProgress = newState.percent;
            isResponse = newState.hasOwnProperty('isResponse') ? newState.isResponse : isResponse;
            currComponentID = newState.hasOwnProperty('currComponentID') ? newState.currComponentID : currComponentID;
            nextComponentID = newState.hasOwnProperty('nextComponentID') ? newState.nextComponentID : nextComponentID;


            this.use(COLOR_SIGNALS[newState.stateName](newState.percent));
        },
        equals(other) {
            return id === other.uuid;
        },
        progress(percent) {
            let color = COLOR_SIGNALS[stateName](percent);
            this.use(color);
            if (currConnection) { 
                this.pos = currConnection.getPosByPercent(percent);
            }
            // if (stateName == 'INTRANSIT') {
            //     print(this.pos);
            //     this.pos = connectionFunc(percent);
            //     print(this.pos);
            // }
        }

    };
};




















































// export default function InterfaceRequest(initState) {

//     var id = initState.id;
//     var age = initState.age;
//     var name = initState.name;
//     var cnx = null;
//     var isResponse = false;
//     var progress = 0.0;

//     return {
//         id() {
//             return id;
//         },
//         name() {
//             return name;
//         },
//         src() {
//             return src;
//         },
//         dest() {
//             return dest;
//         },
//         connection() {
//             return cnx;
//         },
//         progress() {
//             return progress;
//         },
//         stateChange(newState) {
//             name = newState.name;
//             age = newState.age;
//             progress = newState.hasOwnProperty('percent') ? newState.percent : 0.0;
//             src = newState.hasOwnProperty('currID') ? newState.currID : null;
//             dest = newState.hasOwnProperty('nextID') ? newState.nextID : null;
//             cnx - newState.hasOwnProperty('connectID') ? newState.connectID : null;
//             isResponse = newState.hasOwnProperty('isResponse') ? newState.isResponse : false;
//             this.use(COLOR_SIGNALS[name](progress));
//         },
//         equals(other) {
//             return id === other.id();
//         },
//         move(percent) {
//             this.pos = cnx.getPosByPercent(percent);
//             this.use(COLOR_SIGNALS[name](percent));
//         }
//     }
// };

