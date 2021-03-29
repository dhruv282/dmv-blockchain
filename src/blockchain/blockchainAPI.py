from flask import Flask, jsonify, request, redirect, url_for, make_response
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

@apiServer.route('/')
def welcome():
    return({'msg': "Welcome to the dmv-blockchain API server, please view the documentation to learn more :)"})

@apiServer.route('/checkChainValidity', methods=['GET'])
def checkChainValidity():
    return jsonify({"result": blockchain_records.check_chain_validity()})

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
    resp = make_response(jsonify(info))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

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

@apiServer.route('/realID', methods=['GET'])
def realID():
    driverAddress = request.args.get("driverAddress")
    driverInfo = blockchain_records.get_driver_info(driverAddress)

    try:
        driverInfo.realID = True
        driverKey = getPrivateKey(driverInfo.pubkey)
        blockchain_records.add_block([driverInfo], [driverKey], universal_miner.publickey().export_key().decode(), universal_miner.export_key().decode())
    except Exception as e:
        print(e)
        print("ERROR: Could not create driver Real ID :(")
    return redirect(url_for('getDriverInfo', driverAddress=driverAddress))

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
    resp = make_response(jsonify(vehicles))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@apiServer.route('/updateVehicleOwner', methods=['POST'])
def updateVehicleOwner():
    driverAddress = request.args.get("driverAddress")
    driverInfo = blockchain_records.get_driver_info(driverAddress)
    newOwner = request.args.get("newOwner")
    newOwnerInfo = blockchain_records.get_driver_info(newOwner)
    vin = request.form["vin"]

    try:
        temp = []
        for v in driverInfo.vehicles:
            if v.vin == vin:
                v.ownerPubkey = newOwner
                newOwnerInfo.addVehicle(v)
            else:
                temp.append(v)
        driverInfo.vehicles = temp
        driverKey = getPrivateKey(driverInfo.pubkey)
        newOwnerKey = getPrivateKey(newOwnerInfo.pubkey)
        blockchain_records.add_block([driverInfo, newOwnerInfo], [driverKey, newOwnerKey], universal_miner.publickey().export_key().decode(), universal_miner.export_key().decode())
        newAddress = driverInfo.address
    except Exception as e:
        print(e)
        print("ERROR: Could not update vehicle owner :(")
    return redirect(url_for('getVehicles', driverAddress=driverAddress))

@apiServer.route('/vaTitle', methods=['GET'])
def vaTitle():
    driverAddress = request.args.get("driverAddress")
    vin = request.args.get("vin")
    driverInfo = blockchain_records.get_driver_info(driverAddress)

    try:
        for v in driverInfo.vehicles:
            if v.vin == vin:
                v.updateTitleStateToVA()
                break
        driverKey = getPrivateKey(driverInfo.pubkey)
        blockchain_records.add_block([driverInfo], [driverKey], universal_miner.publickey().export_key().decode(), universal_miner.export_key().decode())
    except Exception as e:
        print(e)
        print("ERROR: Could not update vehicle title state to VA :(")
    return redirect(url_for('getVehicles', driverAddress=driverAddress))

@apiServer.route('/vehicleSoldOrTraded', methods=['POST'])
def vehicleSoldOrTraded():
    driverAddress = request.args.get("driverAddress")
    driverInfo = blockchain_records.get_driver_info(driverAddress)
    updatedVehicles = []

    try:
        for v in driverInfo.vehicles:
            if v.vin != request.form["vin"]:
                updatedVehicles.append(v)
        driverInfo.vehicles = updatedVehicles
        driverKey = getPrivateKey(driverInfo.pubkey)
        blockchain_records.add_block([driverInfo], [driverKey], universal_miner.publickey().export_key().decode(), universal_miner.export_key().decode())
    except Exception as e:
        print(e)
        print("ERROR: Could not mark vehicle as sold or traded :(")
    return redirect(url_for('getVehicles', driverAddress=driverAddress))

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

if __name__ == "__main__":
    apiServer.run(debug=True)