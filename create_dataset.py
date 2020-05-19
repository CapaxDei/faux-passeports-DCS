# coding=utf-8
import plotly.express as px

import plotly.express as px
import pandas as pd
import numpy as np
from sklearn import preprocessing
from random import randint
import plotly.graph_objects as go

#import des données brutes, parsées depuis le cryptomarché Agartha et des listes permettant de reconnaitre les indicateurs géographiques
dataset = pd.DataFrame(pd.read_csv('./data/annonces_brutes.csv', sep=','))
dataset = dataset[dataset['isPassport'] == 1]
country_code = pd.DataFrame(pd.read_csv('./data/country_code2.csv', sep=','))
country_code_clean = pd.DataFrame(pd.read_csv('./data/country_code_clean.csv', sep=','))

matrix = []
p = 0
for (i, row) in dataset.iterrows():
   # création d'un premier flux entre les nationalités proposées et les pays de résidence des vendeurs 
    index = "Error"
    for (j, cc) in country_code.iterrows():
        if cc['name'] == row['Pays vendeur']:
            index = ("are sent by a resident in " + cc['name'])
            break
        else: 
            index = ("are sent by a resident somewhere")

    if isinstance(row['NationalitésProposées'], str):
        if len(row['NationalitésProposées'].split(', '))>1:
            p += 1
        for shipping_to in row['NationalitésProposées'].split(', '):
            found = False
            for (j, cc) in country_code.iterrows():
                if cc['name'] == shipping_to:
                    matrix.append(["Passports from " + cc['name'], index])
                    found = True
                    break
            if not found:
                matrix.append(["Passports without specified nationality", index])
    else:
        matrix.append(["Passports without specified nationality",index])


# creation d'un second flux entre les pays de résidence des vendeurs et les pays d'envoi des faux passeports
    for (j, cc) in country_code.iterrows():
        if cc['name'] == row['Pays vendeur']:
            index = ("are sent by a resident in " + cc['name'])
            break
        else:
            index = ("are sent by a resident somewhere")

    if isinstance(row['Livre depuis'], str):
        for (j, cc) in country_code.iterrows():
                if cc['name'] == row['Livre depuis']:
                    matrix.append([index,"shipped from " + cc['name']])
                    found = True
                    break
        if not found :
            matrix.append([index, 'shipped from somewhere'])
    else:
        matrix.append([index, 'shipped from somewhere'])    


#création d'un troisième flux entre les pays d'envoi et les pays de destination des faux passeports
    for (j, cc) in country_code.iterrows():
        if cc['name'] == row['Livre depuis']:
            index = ("shipped from " + cc['name'])
            break
        else: 
            index = ('shipped from somewhere')

    if isinstance(row['Livre en'], str):
        if len(row['Livre en'].split(', '))>1:
            p += 1
        for shipping_to in row['Livre en'].split(', '):
            found = False
            for (j, cc) in country_code.iterrows():
                if cc['name'] == shipping_to:
                    matrix.append([index, "sent to "+ cc['name']])
                    found = True
                    break
            if not found:
                matrix.append([index, 'sent to somewhere'])
    else:
        matrix.append([index, 'sent to somewhere'])
       

#création d'un csv avec les données
matrix_df = pd.DataFrame(matrix, columns=['source', 'target'])


#ajout de la taille du thread en fonction de sa valeur
matrix_df2 = matrix_df.groupby(['source','target']).size().reset_index(name='value')
matrix_df2['Percent'] = round(matrix_df2['value']/sum(matrix_df2['value'])*100, 2)

matrix_df2.to_csv('passport_dataset.csv', index=False)

#source = []
#target = []
#value = []
#countries = country_code_clean['name'].values
#
#countries = np.append(countries, ['Unkown'])
#for (i, row) in matrix_df2.iterrows():
#    for j in range(len(countries)):
#        if countries[j] == row['source']:
#            source.append(j)
#        if countries[j] == row['target']:
#            target.append(j)
#    value.append(row['value'])
#
#fig = go.Figure(data=[go.Sankey(
#    node = dict(
#      pad = 15,
#      thickness = 20,
#      line = dict(color = "black", width = 0.5),
#      label = countries,
#      color = ['rgba('+str(randint(0,255))+', '+str(randint(0,255))+', '+str(randint(0,255))+', 0.75)' for i in range(len(countries))]
#    ),
#    link = dict(
#      source = source, # indices correspond to labels, eg A1, A2, A2, B1, ...
#      target = target,
#      value = value
#  ))])
#
#fig.update_layout(title_text="Direction des livraisons (code name des pays/continents)", font_size=10)
#fig.show()
#