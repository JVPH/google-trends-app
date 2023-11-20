from google.cloud import bigquery
client = bigquery.Client()

def query_google_trends(week_start, week_end, refresh_start, refresh_end, dma_name):
  query = """
      SELECT
        term,
        AVG(score) AS avg_score,
        AVG(rank) AS avg_rank
      FROM `bigquery-public-data.google_trends.top_terms`
      WHERE (refresh_date BETWEEN @refresh_start AND @refresh_end) AND (week BETWEEN @week_start AND @week_end)
      AND dma_name = @dna_name
      GROUP BY term
      LIMIT 10
  """

  job_config = bigquery.QueryJobConfig(
    query_parameters=[
        bigquery.ScalarQueryParameter("refresh_start", "DATE", refresh_start),
        bigquery.ScalarQueryParameter("refresh_end", "DATE", refresh_end),
        bigquery.ScalarQueryParameter("week_start", "DATE", week_start),
        bigquery.ScalarQueryParameter("week_end", "DATE", week_end),
        bigquery.ScalarQueryParameter("dna_name", "STRING", dma_name),        
    ]
  )

  try:
    query_job = client.query(query, job_config=job_config)

    results = query_job.result()  # Waits for job to complete.

    result_list = [
      {"termName": row["term"], "avgScoreValue": row["avg_score"], "avgRankValue": row["avg_rank"]}
      for row in results
    ]

    return result_list
  except Exception as e:
    return {"error":f"{e}"}

def query_dna_names():  
  try:
    query_job = client.query(      
        """
        SELECT ARRAY_AGG(DISTINCT dma_name) AS dma_names
        FROM `bigquery-public-data.google_trends.top_terms`
        """
    )

    results = list(query_job.result())

    dma_names = results[0]['dma_names']
    return {"dma_names": dma_names}
  except Exception as e:
    return {"error":f"{e}"}