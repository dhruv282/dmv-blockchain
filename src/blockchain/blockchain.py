from block import block
from entry import entry
from driver import driver
from datetime import datetime

class blockchain:
    def __init__(self, difficulty=0):
        self.chain = []
        self.difficulty = difficulty
    
    def get_latest_block(self):
        return self.chain[-1]
    
    def get_block(self, block_num):
        if block_num >= 0 and block_num < len(self.chain):
            return self.chain[block_num]
        else:
            raise Exception("Invalid block number")
    
    def add_block(self, drivers, driver_private_keys, miner_public_key, miner_private_key):
        prev_hash = self.get_latest_block().get_block_hash()

        new_entry = entry(drivers)

        new_block = block(new_entry, len(self.chain), prev_hash, miner_public_key, driver_private_keys)
        new_block.mine_block(self.difficulty)
        new_block.generate_miner_signature(miner_private_key)

        self.chain.append(new_block)
    
    def create_genesis_block(self):
        if len(self.chain) == 0:
            genesis_key = "0" * 128

            gen_driver = driver(genesis_key, "", "", "", datetime.now())
            genesis_entry = entry(gen_driver)

            prev_hash = "0"*32
            genesis_block = block(genesis_entry, 0, prev_hash, genesis_key)
            self.chain.append(genesis_block)
        else:
            raise Exception("chain already initialized")
    
    def check_chain_validity(self):
        if len(self.chain) > 0:
            for i in range(1, len(self.chain)):
                cur_block = self.chain[i]
                prev_block = self.chain[i-1]

                if not cur_block.prev_hash == prev_block.get_block_hash():
                    return False
                
                if not cur_block.verify_miner_signature():
                    return False
        return True