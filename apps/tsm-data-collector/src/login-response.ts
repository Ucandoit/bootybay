export interface LoginResponse {
  success: boolean;
  userId: string;
  name: string;
  isPremium: boolean;
  session: string;
  endpointSubdomains: {
    status: string;
    auctiondb: string;
  };
}
