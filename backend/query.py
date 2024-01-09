from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import col, countDistinct, max, when
from pyspark.sql.functions import lit
from pyspark.sql.types import IntegerType
import json

ss: SparkSession
data1: DataFrame
data2: DataFrame


def start():
    global ss
    ss = SparkSession \
        .builder \
        .appName("Python Spark SQL basic example") \
        .config("spark.some.config.option", "some-value") \
        .getOrCreate()

    file1 = 'dataset\\a146281_clean12.csv'
    file2 = 'dataset\\a146283_clean.csv'

    global data1 #Casualities and damage
    data1 = read_df(file1, ss)

    global data2 #Caution and advice
    data2 = read_df(file2, ss)


def read_df(path, sc):
    dataframe = sc.read.options(delimiter=",", header=True, inferSchema=True).csv(path)
    return dataframe

#1.	Numero totale di tweet per ogni tipologia (Type of advice or caution )
def query1():
    d = data2.groupBy("type_of_advice_or_caution").count()
    d = d.withColumnRenamed("type_of_advice_or_caution", "category")
    d2 = d.toPandas()
    dict = d2.to_dict(orient='records')
    return dict

#2.	Luoghi in cui è stato avvistato l'uragano
def query2():
    df = data2.where(col("where").isNotNull() & ~col('where').contains('Nan'))
    df = df.filter(df.type_of_advice_or_caution ==
              'A hurricane sighting has been reported').dropDuplicates(["where"]).select(["where","latitude","longitude"])
    df = df.toPandas()
    dict = df.to_dict(orient='records')
    return dict

#3.	Luoghi in cui è stata emessa o revocata un'allerta
def query3():
    df = data2.where(col("where").isNotNull() & ~col('where').contains('Nan'))
    df = df.filter( df.type_of_advice_or_caution == 'A hurricane warning has been issued or has been lifted').dropDuplicates(["where"]).select(["where","latitude","longitude"])
    df = df.toPandas()
    dict = df.to_dict(orient='records')
    return dict

#4.	Luoghi in cui è stato aperto un rifugio
def query4():
    df = data2.where(col("where").isNotNull() & ~col('where').contains('Nan'))
    df = df.filter(df.type_of_advice_or_caution ==
              'A shelter is open or available').dropDuplicates(["where"]).select(["where","latitude","longitude"])
    df = df.toPandas()
    dict = df.to_dict(orient='records')
    return dict

#5.	Luogo con il maggior numero di rifugi
def query5():
    df = data2.where(col("where").isNotNull() & ~col('where').contains('Nan'))
    df = df.filter(df.type_of_advice_or_caution == 'A shelter is open or available')
    df = df.groupBy('where').count()
    luogo = df.filter(df['count'] == df.agg({'count': 'max'}).take(1)[0][0]).select('where').collect()[0]['where']
    df = data2.filter(data2['where'] == str(luogo)).select(['latitude', 'longitude', 'where']).dropDuplicates()
    df = df.toPandas()
    dict = df.to_dict(orient='records')
    return dict

#6.	Luogo con il maggior numero di avvistamenti
def query6():
    df = data2.where(col("where").isNotNull() & ~col('where').contains('Nan'))
    df = df.filter(df.type_of_advice_or_caution == 'A hurricane sighting has been reported')
    df = df.groupBy('where').count()
    luogo = df.filter(df['count'] == df.agg({'count': 'max'}).take(1)[0][0]).select('where').collect()[0]['where']
    df = data2.filter(data2['where'] == str(luogo)).select(['latitude', 'longitude', 'where']).dropDuplicates()
    df = df.toPandas()
    dict = df.to_dict(orient='records')
    return dict

#7.	Luoghi in cui è stata emessa l’allerta e in cui Sandy è stato effettivamente avvistato
def query7():
    df = data2.where(col("where").isNotNull() & ~col('where').contains('Nan'))
    a = df.filter(df.type_of_advice_or_caution == 'A hurricane warning has been issued or has been lifted')
    b = df.filter(df.type_of_advice_or_caution == 'A hurricane sighting has been reported')
    c = a.join(b, on=['where','latitude', 'longitude'])
    c = c.select(['where','latitude', 'longitude']).dropDuplicates()
    c = c.toPandas()
    dict = c.to_dict(orient='records')
    return dict

#8.	Luoghi in cui ci sono stati danni ai mezzi di trasporto
def query8():
    df = data2.where(col("where").isNotNull() & ~col('where').contains('Nan'))
    df = df.filter(df.tweet.contains('airport') | df.tweet.contains('subway') | df.tweet.contains('taxi'))\
    .select(['where', 'latitude', 'longitude']).dropDuplicates()
    df = df.toPandas()
    dict = df.to_dict(orient='records')
    return dict


#9. Totale numero vittime , feriti e dispersi riportati
def query9_1():
    start()
    df = data1.withColumn("hom_many_injured_or_dead_if_people", data1["hom_many_injured_or_dead_if_people"].cast(IntegerType()))
    dead = df.filter((df.people_or_infrastructure == 'People dead') |
                     (df.people_or_infrastructure == 'People injured and dead') |
                     (df.people_or_infrastructure == 'Both people and infrastructure'))
    morti = dead.agg({'hom_many_injured_or_dead_if_people': 'sum'}).collect()[0][
        'sum(hom_many_injured_or_dead_if_people)']

    injured = data1.filter((data1.people_or_infrastructure == 'People injured') |
                           (data1.people_or_infrastructure == 'People injured and dead'))
    injured = injured.agg({'hom_many_injured_or_dead_if_people': 'sum'}).collect()[0][
        'sum(hom_many_injured_or_dead_if_people)']
    missing = data1.filter((data1.people_or_infrastructure == 'People missing'))
    missing = missing.agg({'hom_many_injured_or_dead_if_people': 'sum'}).collect()[0][
        'sum(hom_many_injured_or_dead_if_people)']
    number = [ {'category': 'dead', 'count': morti},{'category': 'injured', 'count': injured},{'category': 'missing', 'count': missing}]
    return number


#10. Per ogni luogo numero di feriti e vittime
def query10():
    dead = data1.filter(((data1.people_or_infrastructure == 'People dead') |
                     (data1.people_or_infrastructure == 'People injured and dead') |
                     (data1.people_or_infrastructure == 'Both people and infrastructure'))& ~col('where').contains(
        'Nan'))
    d = dead.groupBy('where').sum("hom_many_injured_or_dead_if_people")
    dead = dead.select(['where', 'latitude', 'longitude']).dropDuplicates()
    dead = dead.join(d, on=['where']).withColumnRenamed("sum(hom_many_injured_or_dead_if_people)", 'value')
    dead = dead.withColumn("width", lit(50)).withColumn("height", lit(50))
    dead = dead.toPandas()
    dict = dead.to_dict(orient='records')
    return dict


#11. Città con maggior numero di vittime
def query11():
    dead = data1.filter(((data1.people_or_infrastructure == 'People dead') |
                      (data1.people_or_infrastructure == 'People injured and dead') |
                      (data1.people_or_infrastructure == 'Both people and infrastructure')) & ~col('where').contains('Nan'))
    dead = dead.groupBy('where').sum("hom_many_injured_or_dead_if_people")
    luogo = dead.filter(dead['sum(hom_many_injured_or_dead_if_people)'] == \
                     dead.agg({'sum(hom_many_injured_or_dead_if_people)': 'max'}).take(1)[0][0]) \
        .select('where').collect()[0]['where']
    d = data1.filter(data1['where'] == str(luogo)).select(['latitude', 'longitude', 'where']).dropDuplicates()
    d = d.withColumn("width", lit(50)).withColumn("height", lit(50))
    d = d.toPandas()
    dict = d.to_dict(orient='records')
    return dict


#12. Edifici noti coinvolti
def query12():
    infrastructure = data1.filter(((data1.people_or_infrastructure == 'Infrastructure building bridge road etc damage') |
                                (data1.people_or_infrastructure == 'Not damagerelated') |
                                (data1.people_or_infrastructure == 'Both people and infrastructure')) & ~col(
        'what_infrastructure_was_damaged_if_infrastructure').contains('Nan'))

    infrastructure = infrastructure.filter(col('what_infrastructure_was_damaged_if_infrastructure').contains('Building') |
                          col('what_infrastructure_was_damaged_if_infrastructure').contains('Complex')).select(
        'what_infrastructure_was_damaged_if_infrastructure', 'latitude','longitude')
    infrastructure = infrastructure.withColumnRenamed('what_infrastructure_was_damaged_if_infrastructure','where')
    infrastructure = infrastructure.toPandas()
    dict = infrastructure.to_dict(orient='records')
    return dict

# 13. Perdite economiche e stimate
def query13():
    infrastructure = data1.filter(((data1.people_or_infrastructure == 'Infrastructure building bridge road etc damage') |
                                (data1.people_or_infrastructure == 'Not damagerelated') |
                                (data1.people_or_infrastructure == 'Both people and infrastructure')) & ~col(
        'what_infrastructure_was_damaged_if_infrastructure').contains('Nan'))

    dict = infrastructure.filter(col('what_infrastructure_was_damaged_if_infrastructure').contains('Losses') |
                          col('what_infrastructure_was_damaged_if_infrastructure').contains('Worth Damage')).select(
        ['what_infrastructure_was_damaged_if_infrastructure']) \
        .withColumnRenamed('what_infrastructure_was_damaged_if_infrastructure', 'damage').toPandas().to_dict(orient='records')
    return dict


#14. Numero tweet per strutture (metropolitana, edifici, ospedali , stazioni)
def query14():
    infrastrutture = []
    infrastructure = data1.filter(((data1.people_or_infrastructure == 'Infrastructure building bridge road etc damage') |
                                (data1.people_or_infrastructure == 'Not damagerelated') |
                                (data1.people_or_infrastructure == 'Both people and infrastructure')) & ~col(
        'what_infrastructure_was_damaged_if_infrastructure').contains('Nan'))
    possible_infr = {'Subway': [], 'Station': [], 'Hospital': [], 'Building': []}
    for i in possible_infr.keys():
        aggr = infrastructure.filter(col('what_infrastructure_was_damaged_if_infrastructure').contains(i))
        possible_infr[i] = aggr.select(countDistinct('_unit_id')).collect()[0]['count(DISTINCT _unit_id)']
        infrastrutture.append(
            {
                'category' : i,
                'count' : possible_infr[i]
            }
        )
    return infrastrutture


#15. Per ogni stato ( New York, New Jersey) categoria (people_or_infrastructure) con maggior numero di tweet
def query15():
    cat = data1.filter((data1.people_or_infrastructure != 'Not specified maybe people or infrastructure') &
                    (data1.people_or_infrastructure != 'Not damagerelated') & (~col('state').contains('Nan')) &
                    (~col('people_or_infrastructure').contains('Nan')))

    cat_where = cat.groupBy("state", "people_or_infrastructure").count()

    max_c = cat_where.groupBy("state").agg(max('count'))
    cat_where = cat_where.withColumnRenamed("state", "state2")
    max_c = max_c.join(cat_where, (max_c['state'] == cat_where['state2']) & (max_c['max(count)'] == cat_where['count']),
                       "inner")
    res = max_c.select(max_c['state'], max_c['max(count)'], max_c['people_or_infrastructure'])
    res = res.withColumn('New_col', when(res.state != 'California', "True").when(res.people_or_infrastructure != 'Infrastructure building bridge road etc damage', "True")).filter("New_col == True").drop("New_col")
    res = res.withColumnRenamed("max(count)", "count")
    res = res.withColumnRenamed("people_or_infrastructure", "category")
    res = res.replace(['Infrastructure building bridge road etc damage', 'People dead', 'Both people and infrastructure'],
                      ['https://img.lovepik.com/element/40170/8303.png_860.png','https://toppng.com/uploads/preview/people-people-icon-blue-11553450975ccznm1rxwu.png', 'https://www.kindpng.com/picc/m/275-2755802_infrastructure-icon-hd-png-download.png'], 'category')
    res = res.toPandas()
    dict = res.to_dict(orient='records')
    return dict

#16. Raggruppare per sotto-eventi
def query16():
    with open('dataset\\query16_clustering.txt') as f:
        data = f.read()
    resp = json.loads(data)
    return resp










