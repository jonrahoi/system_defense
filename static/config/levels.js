export const levelDefs = {
    "1": {
        "timeLimit": 100,
        "goal": 50,
        "coinReward": 100,
        "initClients": [
            {
                "name": "IPHONE",
                "quantity": 1
            }
        ],
        "initProcessors": [
            {
                "name": "GATEWAY", 
                "quantity": 1
            }
        ],
        // "availableClients": [
        // ],
        "availableProcessors": [
            {
                "name": "SERVER", 
                "quantity": 2
            },
            {
                "name": "DATABASE", 
                "quantity": 1
            }
        ]
    },
    "2": {
        "timeLimit": 100,
        "goal": 75,
        "coinReward": 150,
        "initClients": [
            {
                "name": "IPHONE",
                "quantity": 1
            }
        ],
        "initProcessors": [
            {
                "name": "GATEWAY", 
                "quantity": 1
            },
            {
                "name": "LOAD_BALANCER", 
                "quantity": 1
            }
        ],
        // "availableClients": [
        // ],
        "availableProcessors": [
            {
                "name": "SERVER", 
                "quantity": 2
            },
            {
                "name": "DATABASE", 
                "quantity": 2
            },
            {
                "name": "CACHE", 
                "quantity": 1
            }
        ]
    },
    "3": {
        "timeLimit": 120,
        "goal": 100,
        "coinReward": 200,
        "initClients": [
            {
                "name": "DESKTOP",
                "quantity": 1
            }
        ],
        "initProcessors": [
            { 
                "name": "MODEM",
                "quantity": 1
            },
            { 
                "name": "ROUTER",
                "quantity": 1
            }
        ],
        // "availableClients": [
        // ],
        "availableProcessors": [
            {
                "name": "LOAD_BALANCER", 
                "quantity": 1
            },
            {
                "name": "GATEWAY", 
                "quantity": 1
            },
            {
                "name": "SERVER", 
                "quantity": 2
            },
            {
                "name": "DATABASE", 
                "quantity": 2
            },
            {
                "name": "CACHE", 
                "quantity": 1
            }
        ]
    }
};

export default levelDefs;