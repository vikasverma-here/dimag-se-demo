


import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, IndianRupee, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';

const PaypalFee = () => {
  const [usdAmount, setUsdAmount] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fee structures
  const PAYPAL_FEE_PERCENTAGE = 4.4; // 4.4%
  const PAYPAL_FIXED_FEE = 0.30; // $0.30
  const CONVERSION_MARGIN = 2.5; // 2.5% margin on exchange rate
  
  // Freelancer platform fees
  const FREELANCER_FEES = {
    upwork: { percentage: 10, name: 'Upwork' },
    freelancer: { percentage: 10, name: 'Freelancer.com' },
    fiverr: { percentage: 20, name: 'Fiverr' },
    guru: { percentage: 8.95, name: 'Guru.com' },
    peopleperhour: { percentage: 20, name: 'PeoplePerHour' },
    toptal: { percentage: 0, name: 'Toptal' },
    '99designs': { percentage: 15, name: '99designs' }
  };

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Using exchangerate-api.com (free tier)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data && data.rates && data.rates.INR) {
        setExchangeRate(data.rates.INR);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      setError('Failed to fetch live rates. Using approximate rate.');
      // Fallback rate
      setExchangeRate(83.5);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const calculateConversion = () => {
    if (!usdAmount || !exchangeRate || isNaN(parseFloat(usdAmount))) {
      return null;
    }

    const amount = parseFloat(usdAmount);
    
    // Step 1: Calculate Freelancer platform fee (if selected)
    let freelancerFee = 0;
    let amountAfterFreelancerFee = amount;
    
    if (selectedPlatform && FREELANCER_FEES[selectedPlatform]) {
      freelancerFee = (amount * FREELANCER_FEES[selectedPlatform].percentage) / 100;
      amountAfterFreelancerFee = amount - freelancerFee;
    }
    
    // Step 2: Calculate PayPal fees on remaining amount
    const percentageFee = (amountAfterFreelancerFee * PAYPAL_FEE_PERCENTAGE) / 100;
    const totalPayPalFees = percentageFee + PAYPAL_FIXED_FEE;
    const amountAfterAllFees = amountAfterFreelancerFee - totalPayPalFees;
    
    // Step 3: Apply conversion margin (PayPal gives lower rate)
    const paypalRate = exchangeRate * (1 - CONVERSION_MARGIN / 100);
    
    // Step 4: Final INR amount
    const finalINR = amountAfterAllFees * paypalRate;
    
    return {
      originalAmount: amount,
      freelancerFee,
      freelancerPlatform: selectedPlatform ? FREELANCER_FEES[selectedPlatform].name : null,
      amountAfterFreelancerFee,
      paypalPercentageFee: percentageFee,
      paypalFixedFee: PAYPAL_FIXED_FEE,
      totalPayPalFees,
      amountAfterAllFees,
      marketRate: exchangeRate,
      paypalRate,
      finalINR,
      totalLoss: amount * exchangeRate - finalINR,
      totalFees: freelancerFee + totalPayPalFees
    };
  };

  const result = calculateConversion();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">PayPal USD → INR Calculator</h1>
          </div>
          <p className="text-gray-600">Calculate exact INR amount after PayPal fees & conversion margins</p>
        </div>

        {/* Exchange Rate Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-700">
              Live Rate: {exchangeRate ? `₹${exchangeRate.toFixed(2)}` : 'Loading...'}
            </span>
          </div>
          <div className="flex items-center">
            {lastUpdated && (
              <span className="text-xs text-gray-500 mr-3">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchExchangeRate}
              disabled={loading}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm">{error}</span>
          </div>
        )}

        {/* Input Section */}
        <div className="mb-8 space-y-6">
          {/* USD Amount Input */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Enter USD Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="number"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                placeholder="100.00"
                className="w-full pl-12 pr-4 py-4 text-xl text-black border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Select Freelancer Platform (Optional)
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-4 py-4 text-lg text-black border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
            >
              <option value="">No Platform / Direct Payment</option>
              {Object.entries(FREELANCER_FEES).map(([key, platform]) => (
                <option key={key} value={key}>
                  {platform.name} ({platform.percentage}% fee)
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Platform fees are deducted first, then PayPal fees are applied to the remaining amount.
            </p>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IndianRupee className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Final Amount (INR)</h3>
                    <p className="text-3xl font-bold text-green-700">
                      ₹{result.finalINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Loss</p>
                  <p className="text-lg font-semibold text-red-600">
                    -₹{result.totalLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Calculation Breakdown</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Freelancer Platform Fees */}
                {result.freelancerFee > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 border-b pb-2">Platform Fees</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Original Amount:</span>
                        <span className="font-medium">${result.originalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-purple-600">
                        <span>{result.freelancerPlatform} Fee:</span>
                        <span>-${result.freelancerFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-medium">
                        <span>After Platform Fee:</span>
                        <span>${result.amountAfterFreelancerFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Fees */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 border-b pb-2">PayPal Fees</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">${result.amountAfterFreelancerFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Fee (4.4%):</span>
                      <span>-${result.paypalPercentageFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Fixed Fee:</span>
                      <span>-${result.paypalFixedFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span>After All Fees:</span>
                      <span>${result.amountAfterAllFees.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Conversion */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 border-b pb-2">Currency Conversion</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Market Rate:</span>
                      <span className="font-medium">₹{result.marketRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>PayPal Rate (2.5% margin):</span>
                      <span>₹{result.paypalRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount to Convert:</span>
                      <span>${result.amountAfterAllFees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-medium text-green-600">
                      <span>Final INR:</span>
                      <span>₹{result.finalINR.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {result.freelancerFee > 0 && (
                <div className="bg-white border-2 border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Platform Fee</p>
                  <p className="text-lg font-bold text-purple-600">${result.freelancerFee.toFixed(2)}</p>
                </div>
              )}
              <div className="bg-white border-2 border-blue-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">PayPal Fees</p>
                <p className="text-lg font-bold text-blue-600">${result.totalPayPalFees.toFixed(2)}</p>
              </div>
              <div className="bg-white border-2 border-orange-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Rate Difference</p>
                <p className="text-lg font-bold text-orange-600">
                  ₹{(result.marketRate - result.paypalRate).toFixed(2)}
                </p>
              </div>
              <div className="bg-white border-2 border-red-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Total Loss %</p>
                <p className="text-lg font-bold text-red-600">
                  {((result.totalLoss / (result.originalAmount * result.marketRate)) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Effective Rate</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{(result.finalINR / result.originalAmount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This calculator provides estimates based on current PayPal fee structure and freelancer platform fees. 
            Actual rates and fees may vary. Exchange rates are fetched from live APIs but PayPal's exact rates may differ. Platform fees are applied first, then PayPal fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaypalFee;