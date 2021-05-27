export interface StatusResponse {
  success: boolean;
  name: string;
  realms?: Realm[];
  'realms-Classic'?: Realm[];
  'realms-BCC'?: Realm[];
  regions?: Region[];
  'regions-Classic'?: Region[];
  'regions-BCC'?: Region[];
}

interface Realm {
  id: number;
  masterId: number;
  name: string;
  region: string;
  lastModified: number;
  downloadUrl?: string;
}

interface Region {
  id: number | string;
  name: string;
  lastModified: number;
  downloadUrl?: string;
}
