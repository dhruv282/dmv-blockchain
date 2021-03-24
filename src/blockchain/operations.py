from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

'''
Function to sign given data. Assumes given key is RSA and data is hashed using hash_string()

@param private_key: RSA private key to sign data with
@param data: data to sign
'''
def generate_signature(private_key, data):
    rsa_key = RSA.import_key(private_key.encode())
    hashed_string = hash_string(data)
    return pkcs1_15.new(rsa_key).sign(hashed_string).hex()

'''
Function to verify signature. Assumes given key is RSA and data is hashed using hash_string()

@param public_key: RSA public key to decrypt signature
@param signature: Signature to decrypt
@param data: expected string after signature is decrypted
'''
def verify_signature(public_key, signature, data):
    rsa_key = RSA.import_key(public_key.encode())
    hashed_string = hash_string(data)
    
    try:
        pkcs1_15.new(rsa_key).verify(hashed_string, bytes.fromhex(signature))
        return True
    except:
        return False

'''
Function to hash given string using SHA256

@param string: string to generate a hash for
'''
def hash_string(string):
    return SHA256.new(string.encode('ascii'))
