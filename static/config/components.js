export const componentDefs = {
    /*************************** CLIENTS *******************************/
    clients: {
        IPHONE: {
            tags: ['CLIENT'],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level client is free (given at level start)
                    maxInputs: 1, // can have 1 incoming connection
                    maxOutputs: 1, // can have 1 outgoing connection
                    transmitRate: 2, // can transmit 2 requests/sec
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
            description: "I'm an iPhone \n\
                            Cost: $0(L1) $50(L2)\n\
                            The starting point of the customer's request\n\
                            Please complete the transfer of 20 requests to the HTML at this level"
        },
        ALEXA: {
            tags: ['CLIENT'],
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
            description: "I'm Alexa \n\
                            Cost: $0(L1) $30(L2)\n\
                            The starting point of the customer's request\n\
                            Please complete the transfer of 20 requests to the hosted image at this level"
        },
        LAPTOP: {
            tags: ['CLIENT'],
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
            description: "I'm a laptop \n\
                            Cost: $0(L1) $70(L2)\n\
                            The starting point of the customer's request\n\
                            Please complete the transfer of 20 requests to the hosted image at this level"
        },
        DESKTOP: {
            tags: ['CLIENT'],
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
            description: "I'm a desktop \n\
                            Cost: $0(L1) $100(L2)\n\
                            The starting point of the customer's request\n\
                            Please complete the transfer of 20 requests to the hosted image at this level"
        },
        CLOUD_COMPUTE: {
            tags: ['CLIENT'],
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
            description: "I'm a cloud-computing software \n\
                            Cost: $0(L1) $120(L2)\n\
                            The starting point of the customer's request\n\
                            Please complete the transfer of 20 requests to the hosted image at this level"
        }
    },
    
    /**************************** PROCESSORS *******************************/
    processors: {
        GATEWAY: {
            tags: ["EDGE", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 3 // can process 3 requests per 'latency interval'
                },
                2: {
                    cost: 50, // cost to upgrade
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 4 // can process 4 requests per 'latency interval'
                },
            },
            img: "assets/images/components/gateway.png",
            description: "I'm a Gateway \n\
                            Cost: $0(L1) $50(L2)\n\
                            A Gateway is a hardware device that acts as a 'gate' between two networks. \n\
                            It may be a router, firewall, server, or another device that enables traffic to flow in and out of the network."
        },
        HUB: {
            tags: ["EDGE", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 2, // can have 2 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 3 // can process 3 requests per 'latency interval'
                },
                2: {
                    cost: 50, // cost to upgrade
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 4 // can process 4 requests per 'latency interval'
                },
            },
            img: "assets/images/components/hub.png",
            description: "I'm a hub \n\
                            Cost: $0(L1) $50(L2)\n\
                            A network hub is a device that allows multiple computers to communicate with each other over a network. \n\
                            It has several Ethernet ports that are used to connect two or more network devices together. \n\
                            Each computer or device connected to the hub can communicate with any other device connected to one of the hub's Ethernet ports."
        },
        SWITCH: {
            tags: ["EDGE", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 2, // can have 2 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 4 // can process 4 requests per 'latency interval'
                },
                2: {
                    cost: 50, // cost to upgrade
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1 second to process a single request
                    throughput: 5 // can process 5 requests per 'latency interval'
                },
            },
            img: "assets/images/components/switch.png",
            description: "I'm a switch \n\
                            Cost: $0(L1) $50(L2)\n\
                            A switch is used to network multiple computers together.\n\
                            Switches are more advanced than hubs and less capable than routers. \n\
                            Unlike hubs, switches can limit the traffic to and from each port so that each device connected to the switch has a sufficient amount of bandwidth. \n\
                            For this reason, you can think of a switch as a 'smart hub.'\n\
                            However, switches don't provide the firewall and logging capabilities that routers do."
        },
        MODEM: {
            tags: ["EDGE", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 5 // can process 5 requests per 'latency interval'
                },
                2: {
                    cost: 100, // cost to upgrade
                    usageCost: 5, // 5 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 1, // takes 1 second to process a single request
                    throughput: 7 // can process 7 requests per 'latency interval'
                },
            },
            img: "assets/images/components/modem.png",
            description: "I'm a modem\n\
                            Cost: $0(L1) $100(L2)\n\
                            A Modem is short for 'Modulator-Demodulator.'\n\
                            It is a hardware component that allows a computer or another device, such as a router or switch, to connect to the Internet."
        },
        ROUTER: {
            tags: ["EDGE", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 2, // takes 1.5 seconds to process a single request
                    throughput: 5 // can process 5 requests per 'latency interval'
                },
                2: {
                    cost: 80, // cost to upgrade
                    usageCost: 4, // 4 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 1, // takes 1 second to process a single request
                    throughput: 6 // can process 6 requests per 'latency interval'
                },
            },
            img: "assets/images/components/router.png",
            description: "I'm a router\n\
                            Cost: $0(L1) $80(L2)\n\
                            is a hardware device that routes data from a local area network (LAN) to another network connection. \n\
                            A router acts like a coin sorting machine, allowing only authorized machines to connect to other computer systems.\n\
                            Most routers also keep log files about the local network activity."
        },
        LOAD_BALANCER: {
            tags: ["PRE_PROCESSOR", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1 seconds to process a single request
                    throughput: 6 // can process 6 requests per 'latency interval'
                },
                2: {
                    cost: 70, // cost to upgrade
                    usageCost: 4, // 4 coins/sec
                    maxInputs: 4, // can have 4 incoming connections
                    maxOutputs: 4, // can have 4 outgoing connections
                    latency: 1, // takes 0.5 seconds to process a single request
                    throughput: 10 // can process 10 requests per 'latency interval'
                },
            },
            img: "assets/images/components/load_balancer.png",
            description: "I'm a load balancer\n\
                            Cost: $0(L1) $70(L2)\n\
                            A load balancer is a piece of hardware that acts like a reverse proxy to distribute network and application traffic across different servers. \n\
                            It is used to improve the concurrent user capacity and overall reliability of applications."
        },
        CACHE: {
            tags: ["PRE_PROCESSOR", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 2, // 2 coins/sec
                    maxInputs: 1, // can have 1 incoming connection
                    maxOutputs: 1, // can have 1 outgoing connection
                    latency: 1, // takes 1 second to process a single request
                    throughput: 8 // can process 8 requests per 'latency interval'
                },
                2: {
                    cost: 90, // cost to upgrade
                    usageCost: 4, // 4 coins/sec
                    maxInputs: 2, // can have 2 incoming connections
                    maxOutputs: 2, // can have 2 outgoing connections
                    latency: 1, // takes 0.5 seconds to process a single request
                    throughput: 15 // can process 15 requests per 'latency interval'
                },
            },
            img: "assets/images/components/cache.png",
            description: "I'm a cache\n\
                            Cost: $0(L1) $90(L2)\n\
                            A cache is a hardware or software component that stores data so that future requests for that data can be served faster\n\
                            The data stored in a cache might be the result of an earlier computation or a copy of data stored elsewhere"
        },
        SERVER: {
            tags: ["PROCESSOR", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connection
                    maxOutputs: 2, // can have 2 outgoing connection
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 5 // can process 5 requests per 'latency interval'
                },
                2: {
                    cost: 70, // cost to upgrade
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1.5 seconds to process a single request
                    throughput: 8 // can process 8 requests per 'latency interval'
                },
            },
            img: "assets/images/components/server.png",
            description: "I'm a web server \n\
                            Cost: $0(L1) $70(L2)\n\
                            A server is a piece of computer hardware or software that provides functionality for other programs or devices, called 'clients'.\n\
                            A client process may run on the same device or may connect over a network to a server on a different device"
        },
        DATABASE: {
            tags: ["PROCESSOR", "MIDDLE"],
            transmission: 'dijkstra',
            upgrades: {
                1: {
                    cost: 0, // base level component is free (charged for usage)
                    usageCost: 1, // 1 coin/sec
                    maxInputs: 2, // can have 2 incoming connection
                    maxOutputs: 2, // can have 2 outgoing connection
                    latency: 2, // takes 2 seconds to process a single request
                    throughput: 5 // can process 5 requests per 'latency interval'
                },
                2: {
                    cost: 80, // cost to upgrade
                    usageCost: 3, // 3 coins/sec
                    maxInputs: 3, // can have 3 incoming connections
                    maxOutputs: 3, // can have 3 outgoing connections
                    latency: 1, // takes 1.5 seconds to process a single request
                    throughput: 8 // can process 8 requests per 'latency interval'
                },
            },
            img: "assets/images/components/database.png",
            description: "I'm a database \n\
                            Cost: $0(L1) $80(L2)\n\
                            An online database is a database accessible from a local network or the Internet\n\
                            As opposed to one that is stored locally on an individual computer or its attached storage.\n\
                            Online databases are hosted on websites, made available as software as a service products accessible via a web browser."
        }
    },

    /***************************** ENDPOINTS *******************************/    
    endpoints: {
        HTML: {
            tags: ['ENDPOINT'],
            transmission: 'return',
            maxInputs: 1, // can have 1 incoming connection
            maxOutputs: 1, // can have 1 outgoing connection
            img: "assets/images/endpoints/html.png",
            description: "I'm an HTML page(ENDPOINT)\n\
                            The Hyper Text Markup Language.\n\
                            HTML is the standard markup language for documents designed to be displayed in a web browser."
        },
        IMAGE: {
            tags: ['ENDPOINT'],
            transmission: 'return',
            maxInputs: 1, // can have 1 incoming connection
            maxOutputs: 1, // can have 1 outgoing connection
            img: "assets/images/endpoints/image.png",
            description: "I'm an image Hoster(ENDPOINT)\n\
                            Hosts on a network include clients and servers--that send or receive data, services or applications.\n\
                            Hosts typically do not include intermediary network devices like switches and routers, which are instead often categorized as nodes."
        },
        VIDEO: {
            tags: ['ENDPOINT'],
            transmission: 'return',
            maxInputs: 1, // can have 1 incoming connection
            maxOutputs: 1, // can have 1 outgoing connection
            img: "assets/images/endpoints/video.png",
            description: "I'm a video hoster(ENDPOINT)\n\
                            An online video platform, provided by a video hosting service, enables users to upload, convert, store and play back video content on the Internet.\n\
                            Often via a structured, large-scale system that may generate revenue"
        }
    }
};

export default componentDefs;