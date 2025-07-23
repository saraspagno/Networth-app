import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let symbol = searchParams.get("symbol");
  const quantityParam = searchParams.get("quantity");

  if (!symbol || !quantityParam) {
    return new Response(JSON.stringify({ error: "Missing symbol or quantity" }), { status: 400 });
  }

  const quantity = parseFloat(quantityParam);
  if (isNaN(quantity) || quantity <= 0) {
    return new Response(JSON.stringify({ error: "Invalid quantity" }), { status: 400 });
  }

  try {
    const quote = await yahooFinance.quote(symbol);

    if (!quote || quote.regularMarketPrice === undefined) {
      return new Response(JSON.stringify({ error: "Price not found for symbol" }), { status: 404 });
    }

    const price = quote.regularMarketPrice;
    const amount = price * quantity;

    return new Response(JSON.stringify({
      success: true,
      symbol: quote.symbol,
      quantity,
      price,
      amount,
      currency: quote.currency,
      source: "Yahoo Finance"
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch from Yahoo" }), { status: 500 });
  }
}
