from flask import Flask, jsonify, request
from Crypto.PublicKey import RSA
from blockchain import blockchain
from generate_drivers import generate_drivers

universal_miner = RSA.generate(1024)

blockchain_records = blockchain(difficulty=2)
blockchain_records.create_genesis_block()

drivers, driver_keys = generate_drivers(15)

def addDriver(driverObjs, driver_private_keys):
    blockchain_records.add_block(driverObjs, 
                                 driver_private_keys, 
                                 universal_miner.publickey().export_key().decode(),
                                 universal_miner.export_key().decode())

def getPubKey(fname, lname):
    for d in drivers:
        if d.fname == fname and d.lname == lname:
            return d.pubkey
    return None

for i in range(len(drivers)):
    addDriver([drivers[i]], [driver_keys[i].export_key().decode()])

#print(blockchain_records.check_chain_validity())

apiServer = Flask(__name__)

@apiServer.route('/numUsers', methods=['GET'])
def renewReg():
    return jsonify({"numUsers": len(drivers)})

@apiServer.route('/drivers', methods=['GET'])
def getDriverInfo():
    info = []
    for d in drivers:
        dInfo = blockchain_records.get_driver_info(d.pubkey)
        info.append({"name": dInfo.fname + " " + dInfo.lname,
                    "fname": dInfo.fname,
                    "lname": dInfo.lname,
                    "address": dInfo.address,
                    "DLexp": dInfo.DLexp,
                    "realID": dInfo.realID,
                    "address": dInfo.pubkey})
    return jsonify(info)

@apiServer.route('/vehicles', methods=['GET'])
def getVehicles():
    driverAddress = request.args.get("driverAddress")
    vehicles = []

    driverInfo = blockchain_records.get_driver_info(driverAddress)
    if driverInfo:
        for v in driverInfo.vehicles:
            vehicles.append({"model": v.model,
                            "titleState": v.titleState,
                            "registrationExp": v.registrationExp,
                            "vin": v.vin})
    return jsonify(vehicles)

if __name__ == "__main__":
    apiServer.run(debug=True)