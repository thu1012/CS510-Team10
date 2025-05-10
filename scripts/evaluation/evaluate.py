#!/usr/bin/env python3
import json
import math

data = json.load(open("k_precision_result.json", encoding="utf-8"))
k = len(data)
relevant = sum(1 for item in data if item.get("relevance"))
precision = relevant / k if k else 0
print(f"Precision@{k} = {precision:.4f} ({relevant}/{k} relevant)")

data = json.load(open("mrr_result.json", encoding="utf-8"))

# Extract individual MRRs and compute the average
mrr_values = [item.get("mrr", 0) for item in data]
count = len(mrr_values)
overall_mrr = sum(mrr_values) / count if count else 0.0

print(f"MRR = {overall_mrr:.4f} ({sum(mrr_values):.2f}/{count})")

data = json.load(open("ndcg_result.json", encoding="utf-8"))
k = len(data)
# extract the graded relevance scores
scores = [item.get("relevance", 0) for item in data]

def dcg(rels):
    return sum((2**rel - 1) / math.log2(idx + 2) 
               for idx, rel in enumerate(rels))

dcg_k  = dcg(scores)
idcg_k = dcg(sorted(scores, reverse=True))
ndcg   = dcg_k / idcg_k if idcg_k else 0.0

print(f"NDCG@{k} = {ndcg:.4f}")