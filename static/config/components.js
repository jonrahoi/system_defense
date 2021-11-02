export const componentDefs = {
  "clients": {
    "IPHONE": {
      "type": "HARDWARE",
      "cost": 50,
      "maxInputs": 1,
      "maxOutputs": 1,
      "requestCapacity": 2,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/iphone.png",
      "description": "I'm an iPhone"
    },
    "DESKTOP": {
      "type": "HARDWARE",
      "cost": 200,
      "maxInputs": 2,
      "maxOutputs": 3,
      "requestCapacity": 4,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/desktop.png",
      "description": "I'm a desktop"
    }
  },
  "processors": {
    "GATEWAY": {
      "type": "HARDWARE",
      "cost": 100,
      "maxInputs": 1,
      "maxOutputs": 3,
      "requestCapacity": 4,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/gateway.png",
      "description": "I'm a gateway"
    },
    // "BRIDGE": {
    //   "type": "HARDWARE",
    //   "cost": 150,
    //   "maxInputs": 1,
    //   "maxOutputs": 2,
    //   "requestCapacity": 4,
    //   "throughput": 10,
    //   "icon": "<some/path/to/icon>",
    //   "image": ".<some/path/to/image>",
    //   "description": "I'm a bridge"
    // },
    "HUB": {
      "type": "HARDWARE",
      "cost": 150,
      "maxInputs": 2,
      "maxOutputs": 2,
      "requestCapacity": 3,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/hub.png",
      "description": "I'm a hub"
    },
    "MODEM": {
      "type": "HARDWARE",
      "cost": 175,
      "maxInputs": 1,
      "maxOutputs": 4,
      "requestCapacity": 4,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/modem.png",
      "description": "I'm a modem"
    },
    "ROUTER": {
      "type": "HARDWARE",
      "cost": 200,
      "maxInputs": 1,
      "maxOutputs": 3,
      "requestCapacity": 4,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/router.png",
      "description": "I'm a router"
    },
    "LOAD_BALANCER": {
      "type": "HARDWARE",
      "cost": 125,
      "maxInputs": 1,
      "maxOutputs": 4,
      "requestCapacity": 4,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/load_balancer.png",
      "description": "I'm a load balancer"
    },
    "CACHE": {
      "type": "SOFTWARE",
      "cost": 175,
      "maxInputs": 1,
      "maxOutputs": 1,
      "requestCapacity": 6,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/cache.png",
      "description": "I'm a cache"
    },
    // "BUS": {
    //   "type": "SOFTWARE",
    //   "cost": 150,
    //   "maxInputs": 3,
    //   "maxOutputs": 1,
    //   "requestCapacity": 4,
    //   "throughput": 10,
    //   "icon": "<some/path/to/icon>",
    //   "image": "<some/path/to/image>",
    //   "description": "I'm a bus"
    // },
    "WEB_SERVER": {
      "type": "SERVICE",
      "cost": 100,
      "maxInputs": 3,
      "maxOutputs": 3,
      "requestCapacity": 2,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/server.png",
      "description": "I'm a web server"
    },
    "DATABASE": {
      "type": "SERVICE",
      "cost": 175,
      "maxInputs": 2,
      "maxOutputs": 2,
      "requestCapacity": 8,
      "throughput": 10,
      "icon": "<some/path/to/icon>",
      "image": "assets/images/components/database.png",
      "description": "I'm a database"
    }
  }
};

export default componentDefs;

