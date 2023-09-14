// * Types for this file
export type Inputs = {
  name: string;
  sector: string;
  acceptedTerms: boolean;
};

export type InputsForAPI = {
  name: string;
  sectorId: string;
  acceptedTerms: boolean;
};

export type OptionsType = {
  id: string;
  value: number;
  label: string;
}[];

export type OptionType = {
  id: string;
  value: number;
  label: string;
};

export type UserDataType = {
  user: {
    id: string;
    name: string;
    sectorName: string;
    acceptedTerms: boolean;
    sectorId: string;
  };
  sector: {
    id: string;
    value: number;
    label: string;
  };
};

export type UserDataTypeForFetchReq = {
  name: string;
  sectorId: string;
};

export type SectorType = {
  id: string;
  value: number;
  label: string;
};
