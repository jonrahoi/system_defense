var componentDefs = {
  "clients": {
    "IPHONE": {
      "type": "HARDWARE",
      "cost": 50,
      "maxInputs": 2,
      "maxOutputs": 2,
      "requestCapacity": 2,
      "description": "I'm an iPhone"
    },
    "LAPTOP": {
      "type": "HARDWARE",
      "cost": 70,
      "maxInputs": 3,
      "maxOutputs": 3,
      "requestCapacity": 3,
      "description": "I'm a laptop"
    },
    "DESKTOP": {
      "type": "HARDWARE",
      "cost": 100,
      "maxInputs": 4,
      "maxOutputs": 4,
      "requestCapacity": 4,
      "description": "I'm a desktop"
    },
    "CLOUD_COMPUTE": {
      "type": "SOFTWARE",
      "cost": 200,
      "maxInputs": 10,
      "maxOutputs": 10,
      "requestCapacity": 8,
      "description": "I'm a cloud-computing software"
    }

  },
  "processors": {
    "GATEWAY": {
      "type": "HARDWARE",
      "cost": 30,
      "maxInputs": 1,
      "maxOutputs": 3,
      "requestCapacity": 4,
      "throughput": 10,
      "description": "I'm a gateway"
    },
    "HUB": {
      "type": "HARDWARE",
      "cost": 20,
      "maxInputs": 2,
      "maxOutputs": 2,
      "requestCapacity": 3,
      "throughput": 10,
      "description": "I'm a hub"
    },
    "MODEM": {
      "type": "HARDWARE",
      "cost": 50,
      "maxInputs": 1,
      "maxOutputs": 4,
      "requestCapacity": 4,
      "throughput": 10,
      "description": "I'm a modem"
    },
    "ROUTER": {
      "type": "HARDWARE",
      "cost": 60,
      "maxInputs": 1,
      "maxOutputs": 3,
      "requestCapacity": 4,
      "throughput": 10,
      "description": "I'm a router"
    },
    "LOAD_BALANCER": {
      "type": "HARDWARE",
      "cost": 30,
      "maxInputs": 1,
      "maxOutputs": 4,
      "requestCapacity": 4,
      "throughput": 10,
      "description": "I'm a load balancer"
    },
    "CACHE": {
      "type": "SOFTWARE",
      "cost": 50,
      "maxInputs": 1,
      "maxOutputs": 1,
      "requestCapacity": 6,
      "throughput": 10,
      "description": "I'm a cache"
    },
    "SERVER": {
      "type": "SERVICE",
      "cost": 40,
      "maxInputs": 3,
      "maxOutputs": 3,
      "requestCapacity": 2,
      "throughput": 10,
      "description": "I'm a web server"
    },
    "DATABASE": {
      "type": "SERVICE",
      "cost": 30,
      "maxInputs": 2,
      "maxOutputs": 2,
      "requestCapacity": 8,
      "throughput": 10,
      "description": "I'm a database"
    }
  }
};

export default componentDefs;

