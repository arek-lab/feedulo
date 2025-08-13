export interface message {
  sensitivity: number | null;
  ignoreSensitivity: boolean | null;
  historical: number | null;
  ignoreHistorical: false;
  productResults: {
    product: string | null;
    result: string | null;
    additional: string | null;
  }[];
  developmentActivities: string[];
  openingSentence: string | null;
  closingSentence: string | null;
  colors: number | null;
  emotions: string | null;
  moreInfos: string | null;
  numberOfWords: number | null;
}
