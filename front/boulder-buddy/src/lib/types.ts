export type Hold = {
  x: number;
  y: number;
};

export type Boulder = {
  id: number | string;
  positions: [number, number][];
  summary: string;
  image?: string;
  created_by?: number;
};
