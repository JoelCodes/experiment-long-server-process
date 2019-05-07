interface Job {
  id: string;
  remaining: number;
  confirmed: boolean;
  cancelled: boolean;
}