import random
import string
from datetime import datetime, timedelta
from Crypto.PublicKey import RSA
from driver import driver
from vehicle import vehicle

def generate_random_string(str_len=8, lc=True, uc=True, digits=True):
    character_pool = ""
    if lc:
        character_pool += string.ascii_lowercase 
    if uc:
        character_pool += string.digits 
    if digits:
        character_pool += string.ascii_uppercase
    
    return ''.join(random.choice(character_pool) for i in range(str_len))

def generate_vehicle(pubKey, seed_date):
    state = generate_random_string(str_len=2, lc=False, digits=False)
    model = generate_random_string(str_len=5, digits=False)
    registrationExp = seed_date + timedelta(days=random.randrange(4*30, 8*30))
    vin = generate_random_string(str_len=10, lc=False) + generate_random_string(str_len=7, lc=False, uc=False)

    new_vehicle = vehicle(pubKey, model, state, registrationExp, vin)

def generate_drivers(num_drivers = 10):
    drivers = []
    seed_date = datetime.now()

    for _ in range(num_drivers):
        key_pair = RSA.generate(1024)
        fname = generate_random_string(str_len=6, digits=False)
        lname = generate_random_string(str_len=6, digits=False)
        address = generate_random_string(str_len=24)
        DLexp = seed_date + timedelta(days=random.randrange(4*30, 8*30))

        new_driver = driver(key_pair.publickey().export_key().decode(), fName, lName, address, DLexp)

        num_vehicles = random.randrange(5)
        for _ in range(num_vehicles):
            new_driver.addVehicle(generate_vehicle())
        
        drivers.append((new_driver, key_pair))
    
    return zip(*drivers)