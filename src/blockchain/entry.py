from operations import generate_signature, verify_signature, hash_string
import time

class entry:
    def __init__(self, drivers = []):
        self.drivers = drivers
        self.timestamp = time.time()
    

    def generate_entry_signature(self, private_keys):
        data = self.timestamp
        for i in len(self.drivers):
            d = self.drivers[i]
            data += d.generate_driver_signature(private_keys[i])
        self.hash = hash_string(data)
        return self.hash
    
    def verify_entry_signature(self):
        data = self.timestamp
        
        for d in self.drivers:
            res = d.verify_driver_signature()
            data += d.signature
            if not res:
                return False
        
        entry_hash = hash_string(data)
        
        return entry_hash == self.hash