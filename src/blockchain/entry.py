from operations import generate_signature, verify_signature

class entry:
    def __init__(self, drivers = [] , vehicles = []):
        self.drivers = drivers
        self.vehicles = vehicles
    

    def generate_entry_signature(self, private_keys):
        data = ""
        for i in len(self.drivers):
            d = self.drivers[i]
            data += d.generate_driver_signature(private_keys[i])
        self.entry_signature = generate_signature(data, private_key)
        return self.entry_signature
    