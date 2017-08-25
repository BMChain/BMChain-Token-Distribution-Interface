export interface TransactionBase
{
  createpartner(options: any) : Promise<any>;

  buy(options: any) : Promise<any>;
}
