import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const amountStr = searchParams.get("amount");

  if (!from || !to || !amountStr) {
    return new Response(JSON.stringify({ error: "Missing 'from', 'to', or 'amount'" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount)) {
    return new Response(JSON.stringify({ error: "Invalid 'amount'" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const symbol = `${from}${to}=X`;

  try {
    const quote = await yahooFinance.quote(symbol);
    const rate = quote?.regularMarketPrice;

    if (!rate) {
      return new Response(JSON.stringify({ error: "Rate not found for currency pair" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const converted = rate * amount;

    return new Response(JSON.stringify({
      success: true,
      from,
      to,
      amount,
      rate,
      converted,
      source: "Yahoo Finance",
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch conversion rate" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
