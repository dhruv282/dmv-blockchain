from operations import generate_signature, verify_signature

class driver:
    def __init__(self, pubkey, fName, lName, address, DLexp):
        self.pubkey = pubkey
        self.fname = fName
        self.lname = lName
        self.address = address
        self.DLexp = DLexp
        self.vehicles = []
        self.realID = False
    
    def addVehicle(self, vehicle):
        if vehicle in self.vehicles:
            raise Exception("Vehicle already added")
        else:
            self.vehicles.append(vehicle)
    
    def updateToRealID(self):
        if self.realID:
            raise Exception("Driver already has a ReadID")
        else:
            self.realID = True
    
    def updateAddress(self, newAddress):
        if self.address == newAddress:
            raise Exception("New address same as old address")
        else:
            self.address = newAddress
    
    def concat(self):
        concat =  self.pubkey + self.fname + self.lname + self.address + self.DLexp
        for v in self.vehicles:
            concat += v.concat
        concat += self.realID
        return concat
    
    def generate_driver_signature(self, private_key):
        self.signature = generate_signature(private_key, self.concat())
        return self.signature
    
    def verify_driver_signature(self):
        genesis_key = "0"*128
        if self.pubkey == genesis_key:
            return True
        return verify_signature(self.pubKey, self.signature, self.concat())