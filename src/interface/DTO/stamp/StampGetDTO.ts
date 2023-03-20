export interface StampDTO {
  id: string;
}

export interface StampGetDTO {
  user: {
    id: number;
  };
  stamps: StampDTO[];
}
