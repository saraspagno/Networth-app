  const port = 3003;
  export async function getStockCurrency(symbol: string): Promise<string | null> {
    const res = await fetch(`http://localhost:${port}/api/getCurrency?symbol=${symbol}`);
    const data = await res.json();
    console.log(data)
    return data.currency;
  }
  
  export async function getStockAmount(symbol: string, quantity: number): Promise<number | null> {
    const res = await fetch(`http://localhost:${port}/api/getAmount?symbol=${symbol}&quantity=${quantity}`);
    const data = await res.json();
    console.log(data);
    return data.amount ?? null;
  }
  
  export async function getCryptoAmount(symbol: string, quantity: number): Promise<number | null> {
    const res = await fetch(`http://localhost:${port}/api/getCryptoAmount?symbol=${symbol}&quantity=${quantity}`);
    const data = await res.json();
    console.log(data);
    return data.amount ?? null;
  }  