from operations import generate_signature, verify_signature
import datetime

class driver:
    def __init__(self, pubkey, fName, lName, address, DLexp):
        self.pubkey = pubkey
        self.fname = fName
        self.lname = lName
        self.address = address
        self.DLexp = DLexp
        self.vehicles = []
        self.realID = False
        self.testExamScore = 0
    
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
    
    def renewDL(self, durationInMonths):
        self.DLexp += datetime.timedelta(days=30*durationInMonths)

    def updateTestExamScore(self, newScore):
        if newScore < 0:
            raise Exception("Score needs to be 0 or more")
        else:
            self.testExamScore = newScore

    def concat(self):
        concat =  self.pubkey + self.fname + self.lname + self.address + self.DLexp.strftime('%m/%d/%Y')
        for v in self.vehicles:
            concat += v.concat()
        concat += str(self.realID) + str(self.testExamScore)
        return concat
    
    def generate_driver_signature(self, private_key):
        self.signature = generate_signature(private_key, self.concat())
        return self.signature
    
    def verify_driver_signature(self):
        genesis_key = "0"*128
        if self.pubkey == genesis_key:
            return True
        return verify_signature(self.pubkey, self.signature, self.concat())