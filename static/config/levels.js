var levelDefs = {
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
                "name": "LAPTOP",
                "quantity": 1
            }
        ],
        "initProcessors": [
            {
                "name": "SWITCH", 
                "quantity": 1
            },
        ],
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
                "name": "IPHONE",
                "quantity": 1
            },
            {
                "name": "ALEXA", 
                "quantity": 1
            }
        ],
        "initProcessors": [
            { 
                "name": "LOAD_BALANCER",
                "quantity": 1
            },
            { 
                "name": "SWITCH",
                "quantity": 1
            }
        ],
        "availableProcessors": [
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
                "name": "HUB", 
                "quantity": 1
            }
        ]
    },
    "4": {
        "timeLimit": 120,
        "goal": 110,
        "coinReward": 250,
        "initClients": [
            {
                "name": "DESKTOP",
                "quantity": 1
            },
        ],
        "initProcessors": [
            { 
                "name": "MODEM",
                "quantity": 2
            },
            { 
                "name": "ROUTER",
                "quantity": 1
            }
        ],
        "availableProcessors": [
            {
                "name": "LOAD_BALANCER", 
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
                "name": "MODEM", 
                "quantity": 1
            },
            {
                "name": "CACHE",
                "quantity": 1
            }
        ]
    },
    "5": {
        "timeLimit": 120,
        "goal": 120,
        "coinReward": 350,
        "initClients": [
            {
                "name": "DESKTOP",
                "quantity": 1
            },
            {
                "name": "LAPTOP",
                "quantity": 1
            }
        ],
        "initProcessors": [
            { 
                "name": "SERVER",
                "quantity": 1
            },
            { 
                "name": "DATABASE",
                "quantity": 1
            },
            {
                "name": "LOAD_BALANCER", 
                "quantity": 1
            },
        ],
        "availableProcessors": [
            {
                "name": "GATEWAY", 
                "quantity": 1
            },
            {
                "name": "MODEM", 
                "quantity": 1
            },
            {
                "name": "ROUTER", 
                "quantity": 1
            },
            {
                "name": "DATABASE", 
                "quantity": 2
            }
        ]
    },
    "6": {
        "timeLimit": 120,
        "goal": 150,
        "coinReward": 500,
        "initClients": [
            {
                "name": "CLOUD_COMPUTE",
                "quantity": 1
            },
        ],
        "initProcessors": [
            { 
                "name": "SERVER",
                "quantity": 3
            },
            { 
                "name": "DATABASE",
                "quantity": 1
            }
        ],
        "availableProcessors": [
            {
                "name": "LOAD_BALANCER", 
                "quantity": 2
            },
            {
                "name": "GATEWAY", 
                "quantity": 2
            },
            {
                "name": "MODEM", 
                "quantity": 2
            },
            {
                "name": "ROUTER", 
                "quantity": 1
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