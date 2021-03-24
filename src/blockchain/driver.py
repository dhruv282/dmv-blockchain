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
            return False
        else:
            self.vehicles.append(vehicle)
            return True
    
    def updateToRealID(self):
        if self.realID:
            return False
        else:
            self.realID = True
            return True
    
    def updateAddress(self, newAddress):
        if self.address == newAddress:
            return False
        else:
            self.address = newAddress
            return True
    
    def concat(self):
        concat =  self.pubkey + self.fname + self.lname + self.address + self.DLexp
        for v in self.vehicles:
            concat += v.concat
        concat += self.realID
        return concat
    
    def generate_driver_signature(self, private_key):
        self.signature = generate_signature(private_key, self.concat())
        return self.signature