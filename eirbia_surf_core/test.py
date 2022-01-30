#!/bin/python
import json

# Exemple de sortie attendue.
data = {
    "trashes": [
        {
            "x":10,
            "y":42,
            "w":100,
            "h":100,
            "classes":[
                {
                    "name":"tire",
                    "prob":0.78
                },
                {
                    "name":"barrel",
                    "prob":0.45
                }
            ]
        },
        {
            "x":100,
            "y":150,
            "w":50,
            "h":30,
            "classes":[
                {
                    "name":"bottle",
                    "prob":0.68
                },
                {
                    "name":"can",
                    "prob":0.35
                }
            ]
        }
    ]
}

print(json.dumps(data));