export type Hold = {
  x: number;
  y: number;
};

export type Boulder = {
  id: number | string;
  positions: Hold[][] | any;
  summary: string;
  image?: string;
  created_by?: number;
};
