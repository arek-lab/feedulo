export interface message {
  sensitivity: string | null;
  ignoreSensitivity: boolean | null;
  historical: string | null;
  ignoreHistorical: false;
  productResults: {
    product: string | null;
    result: string | null;
    additional: string | null;
  }[];
  developmentActivities: string[];
  openingSentence: string | null;
  closingSentence: string | null;
  colors: string | null;
  emotions: string | null;
  moreInfos: string | null;
  numberOfWords: string | null;
}
