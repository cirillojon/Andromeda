"use client";

import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import BalanceChart from "./BalanceChart";
import AccountTypePieChart from "./AccountTypePieChart";
import TransactionLineChart from "./TransactionLineChart";
import ProductsOverviewChart from "./ProductsOverviewChart";

const PlaidDashboard = () => {
  const [data, setData] = useState<any>(null);
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

    // Log the response data
    console.log("Plaid Response:", transactionsResult);

    setData(transactionsResult);
  };

  const { open, ready, error } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div className="flex flex-col p-4 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Finances</h1>
      <button
        onClick={() => open()}
        disabled={!ready}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
      >
        Connect a bank account
      </button>
      {data && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-2">Plaid Financial Data</h2>
            {data.accounts.map((account: any) => (
              <Card
                className="w-full drop-shadow-md mb-4"
                key={account.account_id}
              >
                <CardHeader>
                  <CardTitle>{account.name}</CardTitle>
                  <CardDescription>{account.official_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">Current Balance</p>
                      </div>
                      <div className="text-2xl font-bold">
                        {account.balances.current
                          ? "$" + account.balances.current
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">Available Balance</p>
                      </div>
                      <div className="text-2xl font-bold">
                        {account.balances.available
                          ? "$" + account.balances.available
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">Currency</p>
                      </div>
                      <div className="text-2xl font-bold">
                        {account.balances.iso_currency_code}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">Account Type</p>
                      </div>
                      <div className="text-2xl font-bold">{account.type}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">Account Subtype</p>
                      </div>
                      <div className="text-2xl font-bold">
                        {account.subtype}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    Account ID: {account.account_id}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex-1 lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="h-48">
              <h2 className="text-xl font-semibold mb-2">Account Balances</h2>
              <BalanceChart data={data} />
            </div>
            <div className="h-48">
              <h2 className="text-xl font-semibold mb-2">Account Types</h2>
              <AccountTypePieChart data={data} />
            </div>
            <div className="h-48">
              <h2 className="text-xl font-semibold mb-2">Transaction Trends</h2>
              <TransactionLineChart data={data} />
            </div>
            <div className="h-48">
              <h2 className="text-xl font-semibold mb-2">Products Overview</h2>
              <ProductsOverviewChart data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaidDashboard;
