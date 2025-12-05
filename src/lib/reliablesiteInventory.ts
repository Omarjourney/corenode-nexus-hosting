// Type definitions for ReliableSite inventory API responses

export type ServerDetails = {
  dataCenter: string | null;
  description: string | null;
  detail: string | null;
  productId: string | null;
  recurring: {
    hourly: number | null;
    month_1: number | null;
    month_3: number | null;
    month_6: number | null;
    month_12: number | null;
    month_24: number | null;
    month_36: number | null;
  };
  setup: {
    hourly: number | null;
    month_1: number | null;
    month_3: number | null;
    month_6: number | null;
    month_12: number | null;
    month_24: number | null;
    month_36: number | null;
  };
  stock: number | null;
};
