from flask import Flask, json, request
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


for i in range(len(drivers)):
    addDriver([drivers[i]], [driver_keys[i].export_key().decode()])

print(blockchain_records.check_chain_validity())

api = Flask(__name__)

@api.route('/renewRegistration')
def renewReg():
    user = request.args.get('user')