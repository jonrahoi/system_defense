const levelDefs = {
    1: {
        timeLimit: 100, // Initial time limit
        budget: 100, // Initial budget
        clients: [ // Initial placed clients
            {
                name: "IPHONE",
                quantity: 1
            }
        ],
        processors: [ // Initial placed processors
            {
                name: "SWITCH", 
                quantity: 1
            }
        ],
        endpoints: [ // Initial placed endpoints
            {
                name: "HTML",
                quantity: 1
            }
        ],
        availableComponents: [ // Stage 1 newly available additional processors
            {
                name: "SERVER", 
                quantity: 1
            },
            {
                name: "DATABASE", 
                quantity: 1
            }
        ],
        stages: {
            1: {
                networkType: "WIFI", // Stage 1 network type
                goals: [ // Stage 1 goals
                    {
                        mission: "HTML", // goal is to have requets reach the HTML endpoint
                        quantity: 10 // number of requets needed to meet the goal
                    }   
                ],
                description: "I'm level 1, Stage 1. Make 20 requests to the HTML page"
            },
            2: {
                coinReward: 50, // Coin reward for reaching Stage 2
                timeBonus: 25, // Time bonus for reaching Stage 2
                networkType: "WIFI", // Stage 2 network type
                goals: [ // Stage 2 goals
                    {
                        mission: "HTML", // goal is to have requets reach the HTML endpoint
                        quantity: 30 // number of requets needed to meet the goal
                    }   
                ],
                addedClients: [ // Stage 2 newly added clients
                    {
                        name: "IPHONE",
                        quantity: 1
                    }
                ],
                addedProcessors: [], // Stage 2 newly added processors
                addedEndpoints: [], // Stage 2 newly added endpoints
                additionalComponents: [ // Stage 2 newly available additional processors
                    {
                        name: "SERVER", 
                        quantity: 1
                    }
                ],
                description: "I'm level 1, Stage 2. Make 30 requests to the HTML page"
            }
        }
    },
    2: {
        timeLimit: 120,
        budget: 150,
        clients: [
            {
                name: "LAPTOP",
                quantity: 1
            }
        ],
        processors: [
            {
                name: "GATEWAY", 
                quantity: 1
            }
        ],
        endpoints: [
            {
                name: "IMAGE",
                quantity: 1
            }
        ],
        availableComponents: [
            {
                name: "SERVER", 
                quantity: 1
            },
            {
                name: "DATABASE", 
                quantity: 1
            }
        ],
        stages: {
            1: {
                networkType: "WIFI",
                goals: [
                    {
                        mission: "IMAGE", // goal is to have requets reach the HTML endpoint
                        quantity: 20 // number of requets needed to meet the goal
                    }   
                ],
                description: "I'm level 2, Stage 1. Make 20 requests to the hosted image"
            },
            2: {
                coinReward: 60,
                timeBonus: 45,
                networkType: "WIFI",
                goals: [
                    {
                        mission: "IMAGE", // goal is to have requets reach the image endpoint
                        quantity: 30 // number of requets needed to meet the goal
                    }   
                ],
                addedClients: [
                    {
                        name: "IPHONE",
                        quantity: 1
                    }
                ],
                addedProcessors: [],
                addedEndpoints: [],
                additionalComponents: [
                    {
                        name: "SERVER", 
                        quantity: 1
                    }
                ],
                description: "I'm level 2, Stage 2. Make 30 requests to the hosted image"
            }
        }
    },
    3: {
        timeLimit: 120,
        budget: 200,
        clients: [
            {
                name: "IPHONE",
                quantity: 1
            }
        ],
        processors: [
            {
                name: "SWITCH", 
                quantity: 1
            }
        ],
        endpoints: [
            {
                name: "VIDEO",
                quantity: 1
            }
        ],
        availableComponents: [
            {
                name: "SERVER", 
                quantity: 2
            },
            {
                name: "CACHE", 
                quantity: 1
            },
            {
                name: "LOAD_BALANCER", 
                quantity: 1
            }
        ],
        stages: {
            1: {
                networkType: "WIFI",
                goals: [
                    {
                        mission: "VIDEO", // goal is to have requets reach the hosted video
                        quantity: 20 // number of requets needed to meet the goal
                    }   
                ],
                description: "I'm level 3, Stage 1. Make 20 requests to the hosted video"
            },
            2: {
                coinReward: 60,
                timeBonus: 45,
                networkType: "WIFI",
                goals: [
                    {
                        mission: "VIDEO", // goal is to have requets reach the hosted video
                        quantity: 30 // number of requets needed to meet the goal
                    }   
                ],
                addedClients: [],
                addedProcessors: [],
                addedEndpoints: [],
                additionalComponents: [
                    {
                        name: "ROUTER", 
                        quantity: 1
                    },
                    {
                        name: "MODEM", 
                        quantity: 1
                    }
                ],
                description: "I'm level 3, Stage 2. Make 30 requests to the hosted video"
            },
            3: {
                coinReward: 60,
                timeBonus: 50,
                networkType: "WIFI",
                goals: [
                    {
                        mission: "VIDEO", // goal is to have requets reach the hosted video
                        quantity: 50 // number of requets needed to meet the goal
                    }   
                ],
                addedClients: [],
                addedProcessors: [],
                addedEndpoints: [],
                additionalComponents: [
                    {
                        name: "SERVER", 
                        quantity: 2
                    },
                    { 
                        name: "CACHE",
                        quantity: 1
                    },
                ],
                description: "I'm level 3, Stage 3. Make 50 requests to the hosted video"
            }
        }
    }
};

export default levelDefs;

