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
            return False
        else:
            self.ownerPubkey = newOwnerPubKey
            return True
    
    def updateTitleStateToVA(self):
        if self.titleState == "VA":
            return False
        else:
            self.titleState = "VA"
            return True
    
    def renewRegistration(self, durationInMonths):
        self.registrationExp += datetime.timedelta(months=durationInMonths)
    
    def concat(self):
        return self.ownerPubkey + self.model + self.titleState + self.registrationExp.strftime('%m/%d/%Y') + self.vin