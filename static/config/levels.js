export const levelDefs = {
    "1": {
        "stringRepr": [], // feature of Kaboom... unsure if useful
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
        "availableClients": [
        ],
        "availableProcessors": [
            {
                "name": "WEB SERVER", 
                "quantity": 2
            },
            {
                "name": "DATABASE", 
                "quantity": 1
            }
        ]
    },
    "2": {
        "stringRepr": [],
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
        "availableClients": [
        ],
        "availableProcessors": [
            {
                "name": "WEB SERVER", 
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