export const componentDefs = {
    /*************************** CLIENTS *******************************/
    clients: {
        IPHONE: {
            tags: ["CLIENT"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level client is free (given at level start)
                    maxInputs: 1, // can have 1 incoming connection
                    maxOutputs: 1, // can have 1 outgoing connection
                    transmitRate: 1, // can transmit 2 requests/sec
                    receiveRate: 2, // can receive 2 requests/sec 
                },
                2: {
                    cost: 50, // cost to upgrade
                    maxInputs: 2, // can have 3 incoming connections
                    maxOutputs: 2, // can have 3 outgoing connections
                    transmitRate: 2, // can transmit 2 requests/sec
                    receiveRate: 3, // can receive 3 requests/sec 
                }
            },
            img: "assets/images/components/iphone.png",
            description: "I'm an iPhone"
        },
        ALEXA: {
            tags: ["CLIENT"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level client is free (given at level start)
                    maxInputs: 1, // can have 1 incoming connection
                    maxOutputs: 1, // can have 1 outgoing connection
                    transmitRate: 1, // can transmit 1 request/sec
                    receiveRate: 1, // can receive 1 request/sec 
                },
                2: {
                    cost: 30, // cost to upgrade
                    maxInputs: 1, // can have 1 incoming connection
                    maxOutputs: 2, // can have 2 outgoing connections
                    transmitRate: 2, // can transmit 2 requests/sec
                    receiveRate: 2, // can receive 2 requests/sec 
                },
            },
            img: "assets/images/components/alexa.png",
            description: "I'm Alexa!"
        },
        LAPTOP: {
            tags: ["CLIENT"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level client is free (given at level start)
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 2, // can have 2 outgoing connections
                    transmitRate: 3, // can transmit 3 requests/sec
                    receiveRate: 3, // can receive 3 requests/sec 
                },
                2: {
                    cost: 70, // cost to upgrade
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    transmitRate: 4, // can transmit 4 requests/sec
                    receiveRate: 4, // can receive 4 requests/sec 
                }
            },
            img: "assets/images/components/laptop.png",
            description: "I'm a laptop"
        },
        DESKTOP: {
            tags: ["CLIENT"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level client is free (given at level start)
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    transmitRate: 5, // can transmit 5 requests/sec
                    receiveRate: 4, // can receive 4 requests/sec 
                },
                2: {
                    cost: 100, // cost to upgrade
                    maxInputs: 4, // can have 4 incoming connections
                    maxOutputs: 5, // can have 5 outgoing connections
                    transmitRate: 6, // can transmit 6 requests/sec
                    receiveRate: 6, // can receive 6 requests/sec 
                },
            },
            img: "assets/images/components/desktop.png",
            description: "I'm a desktop"
        },
        CLOUD_COMPUTE: {
            tags: ["CLIENT"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level client is free (given at level start)
                    maxInputs: 4, // can have 4 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    transmitRate: 10, // can transmit 10 requests/sec
                    receiveRate: 10, // can receive 10 requests/sec 
                },
                2: {
                    cost: 120, // cost to upgrade
                    maxInputs: 5, // can have 5 incoming connections
                    maxOutputs: 6, // can have 6 outgoing connections
                    transmitRate: 13, // can transmit 13 requests/sec
                    receiveRate: 12, // can receive 12 requests/sec 
                },
            },
            img: "assets/images/components/cloud_compute.png",
            description: "I'm a cloud-computing software"
        }
    },
    
    /**************************** PROCESSORS *******************************/
    processors: {
        GATEWAY: {
            tags: ["EDGE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 3 // can process 3 requests per "latency interval"
                },
                2: {
                    cost: 50, // cost to upgrade
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 4 // can process 4 requests per "latency interval"
                },
            },
            img: "assets/images/components/gateway.png",
            description: "I'm a gateway"
        },
        HUB: {
            tags: ["EDGE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 2, // can have 2 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 3 // can process 3 requests per "latency interval"
                },
                2: {
                    cost: 50, // cost to upgrade
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 4 // can process 4 requests per "latency interval"
                },
            },
            img: "assets/images/components/hub.png",
            description: "I'm a hub"
        },
        SWITCH: {
            tags: ["EDGE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 2, // can have 2 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 4 // can process 4 requests per "latency interval"
                },
                2: {
                    cost: 50, // cost to upgrade
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1 second to process a single request
                    throughput: 5 // can process 5 requests per "latency interval"
                },
            },
            img: "assets/images/components/switch.png",
            description: "I'm a switch"
        },
        MODEM: {
            tags: ["EDGE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 5 // can process 5 requests per "latency interval"
                },
                2: {
                    cost: 100, // cost to upgrade
                    usageCost: 5, // 5 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 1, // takes 1 second to process a single request
                    throughput: 7 // can process 7 requests per "latency interval"
                },
            },
            img: "assets/images/components/modem.png",
            description: "I'm a modem"
        },
        ROUTER: {
            tags: ["EDGE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 2, // takes 1.5 seconds to process a single request
                    throughput: 5 // can process 5 requests per "latency interval"
                },
                2: {
                    cost: 80, // cost to upgrade
                    usageCost: 4, // 4 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 1, // takes 1 second to process a single request
                    throughput: 6 // can process 6 requests per "latency interval"
                },
            },
            img: "assets/images/components/router.png",
            description: "I'm a router"
        },
        LOAD_BALANCER: {
            tags: ["PRE_PROCESSOR"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1 seconds to process a single request
                    throughput: 6 // can process 6 requests per "latency interval"
                },
                2: {
                    cost: 70, // cost to upgrade
                    usageCost: 4, // 4 coins/sec
                    maxInputs: 4, // can have 4 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 1, // takes 0.5 seconds to process a single request
                    throughput: 10 // can process 10 requests per "latency interval"
                },
            },
            img: "assets/images/components/load_balancer.png",
            description: "I'm a load balancer"
        },
        CACHE: {
            tags: ["PRE_PROCESSOR"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 1, // can have 1 incoming connection
                    maxOutputs: 1, // can have 1 outgoing connection
                    latency: 1, // takes 1 second to process a single request
                    throughput: 8 // can process 8 requests per "latency interval"
                },
                2: {
                    cost: 90, // cost to upgrade
                    usageCost: 4, // 4 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 2, // can have 2 outgoing connections
                    latency: 1, // takes 0.5 seconds to process a single request
                    throughput: 15 // can process 15 requests per "latency interval"
                },
            },
            img: "assets/images/components/cache.png",
            description: "I'm a cache"
        },
        SERVER: {
            tags: ["PROCESSOR"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connection
                    maxOutputs: 2, // can have 2 outgoing connection
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 5 // can process 5 requests per "latency interval"
                },
                2: {
                    cost: 70, // cost to upgrade
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1.5 seconds to process a single request
                    throughput: 8 // can process 8 requests per "latency interval"
                },
            },
            img: "assets/images/components/server.png",
            description: "I'm a web server"
        },
        DATABASE: {
            tags: ["PROCESSOR"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connection
                    maxOutputs: 2, // can have 2 outgoing connection
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 5 // can process 5 requests per "latency interval"
                },
                2: {
                    cost: 80, // cost to upgrade
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1.5 seconds to process a single request
                    throughput: 8 // can process 8 requests per "latency interval"
                },
            },
            img: "assets/images/components/database.png",
            description: "I'm a database"
        }
    },

    /***************************** ENDPOINTS *******************************/    
    endpoints: {
        HTML: {
            tags: ["ENDPOINT"],
            transmission: 'return',
            maxInputs: 1, // can have 1 incoming connection
            maxOutputs: 1, // can have 1 outgoing connection
            img: "assets/images/endpoints/html.png",
            description: "I'm an HTML page"
        },
        IMAGE: {
            tags: ["ENDPOINT"],
            transmission: 'return',
            maxInputs: 1, // can have 1 incoming connection
            maxOutputs: 1, // can have 1 outgoing connection
            img: "assets/images/endpoints/image.png",
            description: "I'm an image"
        },
        VIDEO: {
            tags: ["ENDPOINT"],
            transmission: 'return',
            maxInputs: 1, // can have 1 incoming connection
            maxOutputs: 1, // can have 1 outgoing connection
            img: "assets/images/endpoints/video.png",
            description: "I'm a video"
        }
    }
};

export default componentDefs;

