from operations import hash_string, generate_signature, verify_signature

class block:
    def __init__(self, entry, block_num, prev_hash, miner_public_key, driver_private_keys):
        self.entry = entry
        self.block_num = block_num
        self.previous_block_hash = prev_hash
        self.miner_public_key = miner_public_key
        self.nonce = 0
        self.hash = self.get_block_hash()

        self.entry.generate_entry_signature(driver_private_keys)
    
    def get_block_hash(self):
        string_to_hash = self.previous_block_hash + str(self.nonce) + self.entry.entry_signature + str(self.block_num)
        return hash_string(string_to_hash).hexdigest()
    
    def generate_miner_signature(self, miner_private_key):
        string_to_sign = self.entry.entry_signature + str(self.block_num) + self.previous_block_hash
        self.miner_signature = generate_signature(miner_private_key, string_to_sign)

    def mine_block(self, difficulty):
        while not self.hash.startswith('0'*difficulty):
            self.nonce += 1
            self.hash = self.get_block_hash()
    
    def verify_miner_signature(self):
        if not self.entry.verify_entry_signature():
            return False
        data = self.entry.entry_signature + str(self.block_num) + self.previous_block_hash
        return verify_signature(self.miner_public_key, self.miner_signature, data)