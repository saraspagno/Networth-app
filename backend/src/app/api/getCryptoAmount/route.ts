const SUPPORTED_SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "ADA", "DOGE", "MATIC", "LTC", "BCH"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSymbol = searchParams.get("symbol");
  const quantityParam = searchParams.get("quantity");

  if (!rawSymbol || !quantityParam) {
    return new Response(JSON.stringify({ error: "Missing symbol or quantity" }), { status: 400 });
  }

  const symbol = rawSymbol.toUpperCase();
  const quantity = parseFloat(quantityParam);

  if (!SUPPORTED_SYMBOLS.includes(symbol)) {
    return new Response(JSON.stringify({ error: `Unsupported symbol: ${symbol}` }), { status: 400 });
  }

  if (isNaN(quantity) || quantity <= 0) {
    return new Response(JSON.stringify({ error: "Invalid quantity" }), { status: 400 });
  }

  try {
    const res = await fetch(`https://api.coinbase.com/v2/prices/${symbol}-USD/spot`);
    const data = await res.json();

    const price = parseFloat(data?.data?.amount);
    if (!price || isNaN(price)) {
      return new Response(JSON.stringify({ error: "Price not found" }), { status: 404 });
    }

    const amount = price * quantity;

    return new Response(JSON.stringify({
      success: true,
      symbol,
      quantity,
      price,
      amount,
      currency: "USD",
      source: "Coinbase"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error("Coinbase fetch error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch from Coinbase" }), { status: 500 });
  }
}
