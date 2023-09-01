export interface IImageData {
  dimensions: {
    w: number;
    h: number;
  };
  label: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
}
