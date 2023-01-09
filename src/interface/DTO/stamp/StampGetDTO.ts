export interface StampDTO {
  id: string;
}

export interface StampGetDTO {
  user: {
    machineId: string;
  };
  stamps: StampDTO[];
}
