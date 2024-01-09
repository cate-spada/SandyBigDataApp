from flask import Flask, jsonify
import query
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
query.start()

@app.route('/query1', methods=['GET'])
def query1():
    result = query.query1()
    return jsonify(result)

@app.route('/query2', methods=['GET'])
def query2():
    result = query.query2()
    return jsonify(result)

@app.route('/query3', methods=['GET'])
def query3():
    result = query.query3()
    return jsonify(result)

@app.route('/query4', methods=['GET'])
def query4():
    result = query.query4()
    return jsonify(result)

@app.route('/query5', methods=['GET'])
def query5():
    result = query.query5()
    return jsonify(result)

@app.route('/query6', methods=['GET'])
def query6():
    result = query.query6()
    return jsonify(result)

@app.route('/query7', methods=['GET'])
def query7():
    result = query.query7()
    return jsonify(result)

@app.route('/query8', methods=['GET'])
def query8():
    result = query.query8()
    return jsonify(result)

@app.route('/query9_1', methods=['GET'])
def query9_1():
    result = query.query9_1()
    return jsonify(result)

@app.route('/query9_2', methods=['GET'])
def query9_2():
    result = query.query9_2()
    return jsonify(result)

@app.route('/query9_3', methods=['GET'])
def query9_3():
    result = query.query9_3()
    return jsonify(result)

@app.route('/query10', methods=['GET'])
def query10():
    result = query.query10()
    return jsonify(result)

@app.route('/query11', methods=['GET'])
def query11():
    result = query.query11()
    return jsonify(result)

@app.route('/query12', methods=['GET'])
def query12():
    result = query.query12()
    return jsonify(result)

@app.route('/query13', methods=['GET'])
def query13():
    result = query.query13()
    return jsonify(result)

@app.route('/query14', methods=['GET'])
def query14():
    result = query.query14()
    return jsonify(result)

@app.route('/query15', methods=['GET'])
def query15():
    result = query.query15()
    return jsonify(result)

@app.route('/query16', methods=['GET'])
def query16():
    result = query.query16()
    return jsonify(result)



