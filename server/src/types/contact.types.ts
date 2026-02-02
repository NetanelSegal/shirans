export interface ContactRequest {
  name: string;
  email: string;
  phoneNumber: string;
  message?: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string | null;
  isRead: boolean;
  createdAt: Date;
}
