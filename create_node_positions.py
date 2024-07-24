import json


nodes_to_display = [
    {"id": 0, "x": 200 - 1500, "y": 490},           # Eleonore of Portugal
    {"id": 1, "x": 400 - 1500, "y": 490},           # Frederick III
    {"id": 2, "x": 300 - 1500, "y": 620},           # Maximilian I
    {"id": 3, "x": 150 - 1500, "y": 880},           # Charles V
    {"id": 4, "x": 300 - 1500, "y": 750},           # Philip I of Castile

    {"id": 5, "x": 800, "y": 100},                  # John II of France
    {"id": 6, "x": 800, "y": 230},                  # Charles V of France
    {"id": 7, "x": 800, "y": 360},                  # Charles VI of France
    {"id": 8, "x": 875, "y": 490},                  # Charles VII of France
    {"id": 9, "x": 800, "y": 620},                  # Louis XI of France
    {"id": 10, "x": 875, "y": 750},                 # Charles VIII of France
    {"id": 11, "x": 1750-650, "y": 490},            # John of Angoulême
    {"id": 12, "x": 1750-650, "y": 880},            # Charles of Angoulême
    {"id": 13, "x": 1600-650, "y": 1010},           # Francis I of France
    {"id": 14, "x": 1600-650, "y": 1140},           # Henry II of France
    {"id": 15, "x": -300+100, "y": 230},            # Philip the Bold
    {"id": 16, "x": -300+100, "y": 360},            # John the Fearless
    {"id": 17, "x": -300+100, "y": 490},            # Philip the Good
    {"id": 18, "x": -300+100, "y": 620},            # Charles the Bold
    {"id": 19, "x": 1750-650, "y": 360},            # Louis I of Orléans
    {"id": 20, "x": 1900-650, "y": 490},            # Charles of Orléans
    {"id": 21, "x": 1900-650, "y": 880},            # Louis XII of France
    {"id": 24, "x": -500+100, "y": 230},            # Margaret III
    {"id": 25, "x": -500+100, "y": 360},            # Margaret of Bavaria
    {"id": 26, "x": -500+100, "y": 490},            # Isabella of Portugal
    {"id": 27, "x": -500+100, "y": 620},            # Margaret of York
    {"id": 29, "x": 1450-650, "y": 880},            # Louise of Savoy

    # New entries for wives of French kings
    {"id": 30, "x": 950, "y": 230},                 # Jeanne of Bourbon (wife of Charles V)
    {"id": 31, "x": 950, "y": 360},                 # Isabeau of Bavaria (wife of Charles VI)
    {"id": 32, "x": 725, "y": 490},                 # Marie of Anjou (wife of Charles VII)
    {"id": 33, "x": 950, "y": 620},                 # Margaret of Scotland (wife of Louis XI)
    {"id": 34, "x": 725, "y": 750},                 # Anne of Brittany (wife of Charles VIII)

    {"id": 37, "x": 600, "y": 230},                 # Louis I, Duke of Anjou
    {"id": 38, "x": 450, "y": 230},                 # Marie of Blois
    {"id": 35, "x": 525, "y": 360},                 # Louis II, Duke of Anjou
    {"id": 36, "x": 675, "y": 360},                 # Yolande of Aragon
    {"id": 40, "x": 600, "y": 100},                 # Bonne of Bohemia

    {"id": 41, "x": 350, "y": 490},                 # Louis III, Duke of Anjou
    {"id": 42, "x": 225, "y": 490},                 # Margaret of Savoy
    {"id": 43, "x": 600, "y": 490},                 # René of Anjou
    {"id": 44, "x": 475, "y": 490},                 # Isabella, Duchess of Lorraine
    {"id": 45, "x": 100, "y": 490},                 # Charles of Maine
    {"id": 46, "x": -25, "y": 490},                 # Cobella Ruffo

    {"id": 47, "x": 1900-650, "y": 360},            # Valentina Visconti
    {"id": 48, "x": -125, "y": 750},                # Mary of Burgundy
    {"id": 49, "x": -50, "y": 620},                 # Isabella of Bourbon

    # Ancestors of John II of France
    {"id": 113, "x": 800 + 75, "y": 0},
    {"id": 114, "x": 800 - 75, "y": 0},

    {"id": 115, "x": 800 + 150, "y": -130},
    {"id": 116, "x": 800, "y": -130},

    {"id": 117, "x": 800 + 75 + 225, "y": -260},
    {"id": 118, "x": 800 + 75 + 75, "y": -260},

    {"id": 119, "x": 800 + 300, "y": -130},
    {"id": 120, "x": 800 + 450, "y": -130},

    # Trastamara
    {"id": 50, "x": 0 - 1800, "y": 0 + 230},                    # John I of Castile
    {"id": 52, "x": -200 - 1800, "y": 130 + 230},               # Ferdinand I of Aragon
    {"id": 57, "x": 200 - 1800, "y": 130 + 230},                # Henry III of Castile
    {"id": 53, "x": 200 - 1800, "y": 260 + 230},                # John II of Castile
    {"id": 54, "x": 300 - 1800, "y": 390 + 230},                # Henry IV of Castile
    {"id": 55, "x": 100 - 1800, "y": 390 + 230},                # Isabella I of Castile
    {"id": 58, "x": -100 - 1800, "y": 260 + 230},               # John II of Aragon
    {"id": 59, "x": -300 - 1800, "y": 260 + 230},               # Alfonso V of Aragon
    {"id": 56, "x": -100 - 1800, "y": 390 + 230},               # Ferdinand II of Aragon

    {"id": 62, "x": 0 - 300 - 1800, "y": 520 + 230},            # Isabella of Aragon, Queen of Portugal
    {"id": 63, "x": 150 - 300 - 1800, "y": 520 + 230},          # John, Prince of Asturias
    {"id": 64, "x": 600 - 300 - 1800, "y": 520 + 230},          # Joanna of Castile
    {"id": 65, "x": 450 - 300 - 1800, "y": 520 + 230},          # Maria of Aragon, Queen of Portugal
    {"id": 66, "x": 300 - 300 - 1800, "y": 520 + 230},          # Catherine of Aragon, Queen of England

    # Habsburgers
    {"id": 67, "x": 300 - 1500, "y": 360},
    {"id": 68, "x": 500 - 1500, "y": 360},
    {"id": 69, "x": 400 - 1500, "y": 230},
    {"id": 70, "x": 200 - 1500, "y": 230},
    {"id": 71, "x": 300 - 1500, "y": 100},
    {"id": 72, "x": 500 - 1500, "y": 100},

    # Medici
    {"id": 75, "x": 350 - 5500, "y": 360},
    {"id": 76, "x": 500 - 5500, "y": 360},
    {"id": 74, "x": 425 - 5500, "y": 230},
    {"id": 84, "x": 275 - 5500, "y": 230},
    {"id": 83, "x": 350 - 5500, "y": 100},
    {"id": 73, "x": 500 - 5500, "y": 100},

    {"id": 86, "x": 225 - 5500, "y": 490},
    {"id": 89, "x": 50 - 5500, "y": 490},
    {"id": 85, "x": 350 - 5500, "y": 490},
    {"id": 88, "x": 475 - 5500, "y": 490},
    {"id": 91, "x": 625 - 5500, "y": 490},
    {"id": 87, "x": 750 - 5500, "y": 490},
    {"id": 90, "x": 900 - 5500, "y": 490},

    {"id": 92, "x": 825 - 5500, "y": 620},
    {"id": 93, "x": 975 - 5500, "y": 620},
    {"id": 94, "x": 550 - 5500, "y": 620},

    {"id": 97, "x": 600 - 5500, "y": -30},
    {"id": 98, "x": 400 - 5500, "y": -30},

    {"id": 99, "x": 650 - 5500, "y": 100},
    {"id": 100, "x": 800 - 5500, "y": 100},

    {"id": 101, "x": 650 + 75 - 5500, "y": 230},

    {"id": 103, "x": 650 - 5500, "y": 360},
    {"id": 102, "x": 650 + 150 - 5500 + 100, "y": 360},
    {"id": 108, "x": 650 + 300 - 5500 + 100, "y": 360},         # Caterina Sforza

    {"id": 109, "x": 650 + 300 - 75 - 5500 + 100, "y": 100},
    {"id": 110, "x": 650 + 300 + 75 - 5500 + 100, "y": 100},

    {"id": 112, "x": 650 + 150 - 5500 + 100, "y": 750},



    # Sforza
    {"id": 121, "x": 650 + 300 - 75 - 5500 + 100 + 75, "y": -30},
    {"id": 122, "x": 650 + 300 - 75 - 5500 + 100 - 75, "y": -30},

    {"id": 126, "x": 1400 - 5500, "y": 230},
    {"id": 127, "x": 1400 - 125 - 5500, "y": 230},
    {"id": 128, "x": 1400 - 2 * 125 - 5500, "y": 230},
    {"id": 129, "x": 1400 - 3 * 125 - 5500, "y": 230},
    {"id": 130, "x": 1400 - 4 * 125 - 5500, "y": 230},
    # {"id": 131, "x": 1400 + 1 * 125 - 5500, "y": 230}
    {"id": 136, "x": 1400 + 1 * 125 - 5500, "y": 230},
    {"id": 133, "x": 1400 - 2 * 125 - 5500 + 20, "y": 360},
    {"id": 132, "x": 1400 - 1 * 125 - 5500 + 20, "y": 360},
    {"id": 134, "x": 1400 - 0 * 125 - 5500 + 20, "y": 360},
    {"id": 135, "x": 1400 + 1 * 125 - 5500 + 20, "y": 360}

]

with open('data/node_positions.json', 'w') as f:
    json.dump(nodes_to_display,f)