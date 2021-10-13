import {Database, WebServer} from './Component'
import {Network} from './Network'
let network = new Network()

let ws1 = new WebServer("client", "sth", "sth", 0, 0)
let db1 = new Database("server", "sth", "sth", 0, 0)
network.networkAddComponent(ws1)
network.networkAddComponent(db1)
network.networkAddConnection(ws1, db1)

ws1.addInput(12)
ws1.addOutput(12)
ws1.removeInput(12)
ws1.removeOutput(12)

ws1.getX()
ws1.getY()
ws1.setX(111)
ws1.setY(111)


network.disconnect(ws1.id, db1.id)

network.networkRemovedComponent(ws1)
network.networkRemovedComponent(db1)

network.clearConnections()
network.clearComponents()