"use client";

import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

const PlaidDashboard = () => {
  const [data, setData] = useState(null);
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    // Fetch the link token from your server
    const fetchLinkToken = async () => {
      const response = await fetch("/api/plaid/create_link_token");
      const result = await response.json();
      setLinkToken(result.link_token);
    };

    fetchLinkToken();
  }, []);

  const onSuccess = async (public_token: string, metadata: any) => {
    console.log("Public Token:", public_token);
    // Exchange public token for access token
    const exchangeResponse = await fetch("/api/plaid/exchange_public_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token: public_token }),
    });
    const exchangeResult = await exchangeResponse.json();
    const accessToken = exchangeResult.access_token;

    // Use access token to fetch transactions
    const transactionsResponse = await fetch("/api/plaid/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const transactionsResult = await transactionsResponse.json();
    setData(transactionsResult);
  };

  const { open, ready, error } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div>
      <h1>Finances</h1>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>
      {data && (
        <div>
          <h2>Plaid Financial Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PlaidDashboard;
