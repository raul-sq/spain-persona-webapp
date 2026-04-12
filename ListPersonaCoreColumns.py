import sys
print(sys.executable)

from datasets import load_dataset

ds = load_dataset("apol/spain-reference-personas-frontier", "persona_core")

with open("persona_core_columns.txt", "w", encoding="utf-8") as f:
    for col in ds["train"].column_names:
        print(col)
        f.write(col + "\n")

print("Saved to persona_core_columns.txt")
