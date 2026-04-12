from datasets import load_dataset

ds = load_dataset("apol/spain-reference-personas-frontier", "persona_core")
print(ds["train"].column_names)
print(ds["train"][0])
