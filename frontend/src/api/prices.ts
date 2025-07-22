export async function getCryptoPrice(symbol: string): Promise<number | null> {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await res.json();
    return data[symbol]?.usd ?? null;
  }
  
  export async function getStockPrice(symbol: string): Promise<number | null> {
    const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
    const data = await res.json();
    return data.quoteResponse.result[0]?.regularMarketPrice ?? null;
  }

  export async function getStockCurrency(symbol: string): Promise<string | null> {
    const res = await fetch(`http://localhost:3000/api/getCurrency?symbol=${symbol}`);
    const data = await res.json();
    console.log(data)
    return data.currency;
  }
  
  