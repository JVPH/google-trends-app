export interface DMAListAPIResponse {
  dma_names: string[];
}

export interface GoogleTrendsAPIResponse {
  avgRankValue: number;
  avgScoreValue: number | null;
  termName: string;
}
