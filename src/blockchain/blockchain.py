from block import block

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
            return False
    
    def add_block(self):