import datetime

class vehicle:
    def __init__(self, ownerPubkey, model, titleState, registrationExp, vin):
        self.ownerPubkey = ownerPubkey
        self.model = model
        self.titleState = titleState
        self.registrationExp = registrationExp
        self.vin = vin
    
    def changeOwner(self, newOwnerPubKey):
        if self.ownerPubkey == newOwnerPubKey:
            raise Exception("New owner same as the old owner")
        else:
            self.ownerPubkey = newOwnerPubKey
    
    def updateTitleStateToVA(self):
        if self.titleState == "VA":
            raise Exception("Vehicle already titled in VA")
        else:
            self.titleState = "VA"
    
    def renewRegistration(self, durationInMonths):
        self.registrationExp += datetime.timedelta(days=30*durationInMonths)
    
    def concat(self):
        return self.ownerPubkey + self.model + self.titleState + self.registrationExp.strftime('%m/%d/%Y') + self.vin
    