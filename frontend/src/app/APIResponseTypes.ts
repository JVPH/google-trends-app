export interface DMAListAPIResponse {
  dma_names: string[];
}

export interface GoogleTrendsAPIResponse {
  avgRankValue: number;
  avgScoreValue: number | null;
  termName: string;
}

export interface LoginAPIResponse {
  username: string;
  access_token: string;
}
