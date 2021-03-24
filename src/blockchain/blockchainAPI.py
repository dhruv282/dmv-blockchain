from flask import Flask, json, request

api = Flask(__name__)

@api.route('/renewRegistration')
def renewReg():
    user = request.args.get('user')