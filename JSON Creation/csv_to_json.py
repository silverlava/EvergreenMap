import pandas as pd
dfCommands = pd.read_csv("JSON Creation/commands.csv")
json_string = dfCommands.to_json(orient="records", indent=4, force_ascii=True)
json_string = f"var map = {json_string};"
with open("JSON Creation/output.txt", "w", encoding="utf-8") as file:
    file.write(json_string)