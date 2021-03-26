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

def getPrivateKey(pubkey):
    for d in driver_keys:
        if pubkey == d.publickey().export_key().decode():
            return d.export_key().decode()
    return None

for i in range(len(drivers)):
    addDriver([drivers[i]], [driver_keys[i].export_key().decode()])

#print(blockchain_records.check_chain_validity())

apiServer = Flask(__name__)

@apiServer.route('/renewReg', methods=['POST'])
def renewReg():
    driverAddress = request.args.get("driverAddress")
    driverInfo = blockchain_records.get_driver_info(driverAddress)
    newExpDate = ""

    try:
        for v in driverInfo.vehicles:
            if v.vin == request.form["vin"]:
                v.renewRegistration(int(request.form["months"]))
                driverKey = getPrivateKey(driverInfo.pubkey)
                blockchain_records.add_block([driverInfo], [driverKey], universal_miner.publickey().export_key().decode(), universal_miner.export_key().decode())
                newExpDate = v.registrationExp
                break
    except Exception as e:
        print(e)
        print("ERROR: Could not renew registration :(")
    return jsonify({"status": newExpDate})

@apiServer.route('/updateAddress', methods=['POST'])
def updateAddress():
    driverAddress = request.args.get("driverAddress")
    driverInfo = blockchain_records.get_driver_info(driverAddress)
    newAddress = ""

    try:
        driverInfo.address = request.form["address"]
        driverKey = getPrivateKey(driverInfo.pubkey)
        blockchain_records.add_block([driverInfo], [driverKey], universal_miner.publickey().export_key().decode(), universal_miner.export_key().decode())
        newAddress = driverInfo.address
    except Exception as e:
        print(e)
        print("ERROR: Could not update address :(")
    return jsonify({"status": newAddress})

@apiServer.route('/renewDL', methods=['POST'])
def renewDL():
    driverAddress = request.args.get("driverAddress")
    driverInfo = blockchain_records.get_driver_info(driverAddress)
    newDLexp = ""

    try:
        driverInfo.renewDL(int(request.form["months"]))
        driverKey = getPrivateKey(driverInfo.pubkey)
        blockchain_records.add_block([driverInfo], [driverKey], universal_miner.publickey().export_key().decode(), universal_miner.export_key().decode())
        newDLexp = driverInfo.DLexp
    except Exception as e:
        print(e)
        print("ERROR: Could not update address :(")
    return jsonify({"status": newDLexp})

@apiServer.route('/drivers', methods=['GET'])
def getDriverInfo():
    info = []
    for d in drivers:
        dInfo = blockchain_records.get_driver_info(d.pubkey)
        info.append({"fname": dInfo.fname,
                    "lname": dInfo.lname,
                    "address": dInfo.address,
                    "DLexp": dInfo.DLexp,
                    "realID": dInfo.realID,
                    "blockchainAddress": dInfo.pubkey})
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