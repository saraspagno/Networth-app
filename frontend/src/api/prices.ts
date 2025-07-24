  const port = 3002;
  const host = "localhost";

  export async function getStockCurrency(symbol: string): Promise<string | null> {
    const res = await fetch(`http://${host}:${port}/api/getCurrency?symbol=${symbol}`);
    const data = await res.json();
    return data.currency;
  }
  
  export async function getStockAmount(symbol: string, quantity: number): Promise<number | null> {
    const res = await fetch(`http://${host}:${port}/api/getAmount?symbol=${symbol}&quantity=${quantity}`);
    const data = await res.json();
    return data.amount ?? null;
  }
  
  export async function getCryptoAmount(symbol: string, quantity: number): Promise<number | null> {
    const res = await fetch(`http://${host}:${port}/api/getCryptoAmount?symbol=${symbol}&quantity=${quantity}`);
    const data = await res.json();
    return data.amount ?? null;
  }  

  export async function getExchangedAmount(from: string, to: string, amount: number): Promise<number | null> {
    const res = await fetch(`http://${host}:${port}/api/getExchangedAmount?from=${from}&to=${to}&amount=${amount}`);
    const data = await res.json();
    return data.converted ?? null;
  }